const API_URL = 'https://app.remarked.ru/api/v1/ApiReservesWidget';
export const REMARKED_POINT = 599599;
export const BOOKING_MINUTES = 180;
export const SLOT_MINUTES = 15;
export const VENUE_TIME_ZONE = 'Asia/Barnaul';

export type BookingSession = { token: string; minGuests: number; maxGuests: number };
export type BookingSlot = { id: string; date: string; time: string; duration: number };
export type BookingRequest = { name: string; phone: string; date: string; time: string; guests: number; requestId: string };
export type BookingReceipt = { reserveId: number; paymentUrl?: string };

type Json = Record<string, unknown>;
export class BookingError extends Error {
  uncertain: boolean;
  constructor(message: string, uncertain = false) {
    super(message);
    this.name = 'BookingError';
    this.uncertain = uncertain;
  }
}

function object(value: unknown): Json {
  return typeof value === 'object' && value !== null && !Array.isArray(value) ? value as Json : {};
}

async function request(method: string, params: Json, signal?: AbortSignal): Promise<Json> {
  const timeout = AbortSignal.timeout(method === 'CreateReserve' ? 30000 : 15000);
  let data: Json;
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ method, request_id: crypto.randomUUID(), ...params }),
      signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
      credentials: 'omit',
      referrerPolicy: 'strict-origin-when-cross-origin',
    });
    if (!response.ok) throw new Error('Upstream HTTP error');
    data = object(await response.json());
  } catch (error) {
    if (signal?.aborted) throw error;
    throw new BookingError(method === 'CreateReserve'
      ? 'Не удалось получить ответ о бронировании. Заявка могла поступить. Повторная проверка отправит тот же запрос; также можно уточнить бронь по телефону.'
      : 'Не удалось загрузить свободное время. Попробуйте ещё раз или позвоните нам.', method === 'CreateReserve');
  }
  if (data.status === 'error' || data.error) {
    throw new BookingError(method === 'CreateReserve'
      ? 'Сервис не принял заявку. Обновите доступное время и попробуйте снова или позвоните нам.'
      : 'Сервис бронирования временно недоступен. Попробуйте ещё раз или позвоните нам.');
  }
  return data;
}

export function venueDateTime(now = new Date()) {
  const parts = new Intl.DateTimeFormat('sv-SE', {
    timeZone: VENUE_TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
  }).formatToParts(now);
  const part = (name: Intl.DateTimeFormatPartTypes) => parts.find(p => p.type === name)?.value ?? '';
  return `${part('year')}-${part('month')}-${part('day')} ${part('hour')}:${part('minute')}:${part('second')}`;
}

export function bookingDates(now = new Date()): string[] {
  const today = venueDateTime(now).slice(0, 10);
  const date = new Date(`${today}T12:00:00Z`);
  const month = date.getUTCMonth();
  const dates: string[] = [];
  while (date.getUTCMonth() === month) {
    dates.push(date.toISOString().slice(0, 10));
    date.setUTCDate(date.getUTCDate() + 1);
  }
  return dates;
}

export function normalizePhone(value: string) {
  let digits = value.replace(/\D/g, '');
  if (digits.length === 10) digits = `7${digits}`;
  if (digits.length === 11 && digits.startsWith('8')) digits = `7${digits.slice(1)}`;
  return digits.length >= 11 && digits.length <= 15 ? `+${digits}` : null;
}

export async function startBooking(signal?: AbortSignal): Promise<BookingSession> {
  const data = await request('GetToken', { point: REMARKED_POINT, additional_info: true }, signal);
  if (typeof data.token !== 'string' || !data.token) throw new BookingError('Не удалось подключиться к бронированию. Попробуйте ещё раз или позвоните нам.');
  const capacity = object(data.capacity);
  const min = Number(capacity.min ?? 1);
  const max = Number(capacity.max ?? 8);
  if (!Number.isInteger(min) || !Number.isInteger(max) || min < 1 || max < min || max > 100) {
    throw new BookingError('Не удалось получить условия бронирования. Позвоните нам.');
  }
  return { token: data.token, minGuests: min, maxGuests: max };
}

// ReMarked's start_datetime is the venue's wall time. Do not derive it from
// start_stamp: this point currently returns stamps with a different UTC offset.
export function parseSlots(raw: unknown, date: string, now = new Date()): BookingSlot[] {
  if (!Array.isArray(raw)) throw new BookingError('Не удалось прочитать свободное время. Попробуйте ещё раз.');
  const current = venueDateTime(now);
  const next = new Date(`${date}T12:00:00Z`);
  next.setUTCDate(next.getUTCDate() + 1);
  const nextDate = next.toISOString().slice(0, 10);
  const step = SLOT_MINUTES * 60 * 1000;
  const intervals = new Map<number, Set<string>>();
  for (const item of raw) {
    const row = object(item);
    const start = typeof row.start_datetime === 'string' ? row.start_datetime.replace('T', ' ').slice(0, 19) : '';
    const duration = Number(row.duration);
    if (row.is_free !== true || !/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(start)
      || start <= current || duration !== SLOT_MINUTES * 60) continue;
    const slotDate = start.slice(0, 10);
    if (slotDate !== date && slotDate !== nextDate) continue;
    // UTC is only used for arithmetic on the venue's local calendar values.
    const stamp = Date.parse(`${start.replace(' ', 'T')}Z`);
    if (!Number.isFinite(stamp) || new Date(stamp).toISOString().slice(0, 19).replace('T', ' ') !== start) continue;
    const choices = intervals.get(stamp) ?? new Set<string>();
    const tables = Array.isArray(row.tables_ids) ? row.tables_ids.map(id => [id]) : [];
    const bundles = Array.isArray(row.table_bundles) ? row.table_bundles : Object.values(object(row.table_bundles));
    for (const choice of [...tables, ...bundles]) {
      if (!Array.isArray(choice) || !choice.length) continue;
      const ids = choice.map(Number);
      if (ids.some(id => !Number.isSafeInteger(id) || id <= 0)) continue;
      choices.add([...new Set(ids)].sort((a, b) => a - b).join(','));
    }
    intervals.set(stamp, choices);
  }
  const slots: BookingSlot[] = [];
  for (const [stamp, choices] of intervals) {
    // A free quarter hour alone does not guarantee a three-hour reservation.
    // Keep a table (or the same table bundle) available throughout the visit.
    let common = [...choices];
    for (let offset = 1; offset < BOOKING_MINUTES / SLOT_MINUTES && common.length; offset++) {
      const following = intervals.get(stamp + offset * step);
      common = common.filter(choice => following?.has(choice));
    }
    if (!common.length) continue;
    const start = new Date(stamp).toISOString().slice(0, 19).replace('T', ' ');
    slots.push({ id: start, date: start.slice(0, 10), time: start.slice(11, 16), duration: BOOKING_MINUTES });
  }
  return slots.sort((a, b) => a.id.localeCompare(b.id));
}

export async function getBookingSlots(session: BookingSession, date: string, guests: number, signal?: AbortSignal) {
  const data = await request('GetSlots', {
    token: session.token, reserve_date_period: { from: date, to: date },
    guests_count: guests, slot_duration: SLOT_MINUTES * 60,
  }, signal);
  if (data.status !== 'success') throw new BookingError('Не удалось получить свободное время. Попробуйте ещё раз.');
  return parseSlots(data.slots, date);
}

export async function createBooking(session: BookingSession, input: BookingRequest): Promise<BookingReceipt> {
  const phone = normalizePhone(input.phone);
  if (!phone || !input.name.trim() || input.name.length > 80 || input.guests < session.minGuests
    || input.guests > session.maxGuests || !Number.isInteger(input.guests)) {
    throw new BookingError('Проверьте имя, телефон и количество гостей.');
  }
  const data = await request('CreateReserve', {
    token: session.token,
    point: REMARKED_POINT,
    request_id: input.requestId,
    reserve: {
      name: input.name.trim(), phone, date: input.date, time: input.time,
      guests_count: input.guests, duration: BOOKING_MINUTES,
      source: 'site', type: 'booking', is_subscription: false,
    },
  });
  const reserveId = Number(data.reserve_id);
  if (data.status !== 'success' || !Number.isSafeInteger(reserveId) || reserveId <= 0) {
    throw new BookingError('Не удалось подтвердить получение заявки. Уточните бронь по телефону или повторите тот же запрос.', true);
  }
  let paymentUrl: string | undefined;
  if (typeof data.form_url === 'string') {
    try { const url = new URL(data.form_url); if (url.protocol === 'https:') paymentUrl = url.href; } catch { /* No usable payment link. */ }
  }
  return { reserveId, paymentUrl };
}

const ATTEMPT_KEY = 'manufactura.booking.attempt.v1';
export async function bookingRequestId(input: Omit<BookingRequest, 'requestId'>) {
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(JSON.stringify(input)));
  const fingerprint = Array.from(new Uint8Array(hash), b => b.toString(16).padStart(2, '0')).join('');
  try {
    const saved = JSON.parse(sessionStorage.getItem(ATTEMPT_KEY) ?? 'null');
    if (saved?.fingerprint === fingerprint && typeof saved.requestId === 'string') return saved.requestId as string;
  } catch { /* Storage may be unavailable. */ }
  const requestId = crypto.randomUUID();
  try { sessionStorage.setItem(ATTEMPT_KEY, JSON.stringify({ fingerprint, requestId })); } catch { /* In-memory retry still reuses the same ID. */ }
  return requestId;
}
