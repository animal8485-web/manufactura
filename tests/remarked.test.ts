import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { BookingError, bookingDates, bookingRequestId, createBooking, getBookingSlots, normalizePhone, parseSlots, startBooking, venueDateTime } from '../src/integrations/remarked.ts';
const originalFetch = globalThis.fetch;
const originalStorage = Object.getOwnPropertyDescriptor(globalThis, 'sessionStorage');
afterEach(() => { globalThis.fetch = originalFetch; if (originalStorage) Object.defineProperty(globalThis, 'sessionStorage', originalStorage); else Reflect.deleteProperty(globalThis, 'sessionStorage'); });
const session = { token: 'test-token', minGuests: 1, maxGuests: 8 };
const booking = { name: 'Тест', phone: '89991234567', date: '2026-10-08', time: '17:15', guests: 4, requestId: 'b90e969d-7593-44e0-92fb-c98d6b9b9909' };
test('venue dates are independent of browser timezone and booking includes all November', () => {
  assert.equal(venueDateTime(new Date('2026-10-07T18:00:00Z')), '2026-10-08 01:00:00');
  const dates = bookingDates(new Date('2026-10-07T18:00:00Z'));
  assert.equal(dates[0], '2026-10-08'); assert.equal(dates.at(-1), '2026-11-30');
  assert.ok(dates.includes('2026-11-01')); assert.ok(dates.includes('2026-11-30'));
  assert.ok(!dates.includes('2026-12-01'));
  assert.equal(dates.length, 54);
});
test('booking extension preserves venue-local month boundaries and later months', () => {
  assert.deepEqual(bookingDates(new Date('2026-11-30T16:59:00Z')), ['2026-11-30']);
  const december = bookingDates(new Date('2026-11-30T17:00:00Z'));
  assert.equal(december[0], '2026-12-01'); assert.equal(december.at(-1), '2026-12-31');
});
test('normalizes Russian phones and rejects short numbers', () => {
  assert.equal(normalizePhone('8 (999) 123-45-67'), '+79991234567');
  assert.equal(normalizePhone('9991234567'), '+79991234567');
  assert.equal(normalizePhone('123'), null);
});
function quarterHours(start: string, count: number) {
  const stamp = Date.parse(`${start.replace(' ', 'T')}Z`);
  return Array.from({ length: count }, (_, index) => ({
    start_datetime: new Date(stamp + index * 900000).toISOString().slice(0, 19).replace('T', ' '),
    start_stamp: 1, is_free: true, duration: 900, tables_ids: [1, 2],
    table_bundles: [] as number[][] | Record<string, number[]>,
  }));
}
const beforeVisit = new Date('2026-10-10T00:00:00Z');
test('offers all 29 quarter-hour starts from 17:00 through midnight for full three-hour visits', () => {
  const rows = quarterHours('2026-10-10 17:00:00', 40); // Open until 03:00.
  const slots = parseSlots([...rows].reverse(), '2026-10-10', beforeVisit);
  assert.equal(slots.length, 29);
  assert.deepEqual(slots.slice(0, 4).map(s => s.time), ['17:00', '17:15', '17:30', '17:45']);
  assert.deepEqual(slots.at(-1), { id: '2026-10-11 00:00:00', date: '2026-10-11', time: '00:00', duration: 180 });
  assert.ok(slots.every(s => s.duration === 180));
});
test('excludes past starts without converting the API stamp to local time', () => {
  const slots = parseSlots(quarterHours('2026-10-10 17:00:00', 40), '2026-10-10', new Date('2026-10-10T10:16:00Z'));
  assert.equal(slots[0].time, '17:30');
  assert.equal(slots.at(-1)?.date, '2026-10-11');
});
test('rejects visits that cross a busy, missing or wrong-duration quarter hour', () => {
  for (const condition of ['busy', 'missing', 'duration']) {
    const rows = quarterHours('2026-10-10 17:00:00', 24);
    if (condition === 'busy') rows[4].is_free = false;
    if (condition === 'missing') rows.splice(4, 1);
    if (condition === 'duration') rows[4].duration = 10800;
    const times = parseSlots(rows, '2026-10-10', beforeVisit).map(s => s.time);
    assert.equal(times[0], '18:15', condition);
    assert.equal(times.at(-1), '20:00', condition);
  }
});
test('requires the same table for the entire visit, not just some free table in each interval', () => {
  const rows = quarterHours('2026-10-10 17:00:00', 12);
  rows.forEach((row, index) => { row.tables_ids = index < 4 ? [1, 2] : index < 8 ? [2, 3] : [1, 3]; });
  assert.deepEqual(parseSlots(rows, '2026-10-10', beforeVisit), []);
  rows.forEach(row => row.tables_ids.push(4));
  assert.equal(parseSlots(rows, '2026-10-10', beforeVisit).length, 1);
});
test('supports a stable table bundle in array and object responses, regardless of ID order', () => {
  const rows = quarterHours('2026-10-10 17:00:00', 12);
  rows.forEach((row, index) => {
    row.tables_ids = [];
    row.table_bundles = index % 2 ? { bundle: [2, 1] } : [[1, 2]];
  });
  assert.equal(parseSlots(rows, '2026-10-10', beforeVisit).length, 1);
  rows[6].table_bundles = [[2, 3]];
  assert.deepEqual(parseSlots(rows, '2026-10-10', beforeVisit), []);
});
test('does not invent availability from missing table data or duplicate intervals', () => {
  const rows = quarterHours('2026-10-10 17:00:00', 12);
  rows.forEach(row => { row.tables_ids = []; });
  assert.deepEqual(parseSlots(rows, '2026-10-10', beforeVisit), []);
  const oneInterval = quarterHours('2026-10-10 17:00:00', 1)[0];
  assert.deepEqual(parseSlots(Array(12).fill(oneInterval), '2026-10-10', beforeVisit), []);
});
test('keeps midnight on the next calendar date across a year boundary', () => {
  const slots = parseSlots(quarterHours('2026-12-31 23:45:00', 13), '2026-12-31', beforeVisit);
  assert.deepEqual(slots.map(s => [s.date, s.time]), [['2026-12-31', '23:45'], ['2027-01-01', '00:00']]);
});
test('GetToken uses the venue ID and actual capacity', async () => {
  globalThis.fetch = async (_url, init) => {
    const body = JSON.parse(String(init?.body)); assert.equal(body.method, 'GetToken'); assert.equal(body.point, 599599);
    return Response.json({ token: 'test-token', capacity: { min: 2, max: 6 } });
  };
  assert.deepEqual(await startBooking(), { token: 'test-token', minGuests: 2, maxGuests: 6 });
});
test('availability requests use 15-minute intervals and return three-hour visits', async () => {
  globalThis.fetch = async (_url, init) => {
    const body = JSON.parse(String(init?.body)); assert.equal(body.guests_count, 6); assert.equal(body.slot_duration, 900);
    assert.deepEqual(body.reserve_date_period, { from: '2099-10-08', to: '2099-10-08' });
    return Response.json({ status: 'success', slots: quarterHours('2099-10-08 17:00:00', 13) });
  };
  const slots = await getBookingSlots(session, '2099-10-08', 6);
  assert.deepEqual(slots.map(s => [s.time, s.duration]), [['17:00', 180], ['17:15', 180]]);
});
test('HTTP 200 with API error is not success', async () => {
  globalThis.fetch = async () => Response.json({ status: 'error', message: 'Unknown error' });
  await assert.rejects(() => createBooking(session, booking), error => error instanceof BookingError && !error.uncertain);
});
test('CreateReserve preserves request ID, normalizes phone and does not subscribe to marketing', async () => {
  let count = 0;
  globalThis.fetch = async (_url, init) => {
    count++; const body = JSON.parse(String(init?.body));
    assert.equal(body.request_id, booking.requestId); assert.equal(body.point, 599599);
    assert.equal(body.reserve.phone, '+79991234567'); assert.equal(body.reserve.duration, 180);
    assert.equal(body.reserve.time, '17:15'); assert.equal(body.reserve.date, booking.date);
    assert.equal(body.reserve.source, 'site'); assert.equal(body.reserve.is_subscription, false);
    return Response.json({ status: 'success', reserve_id: 12345 });
  };
  assert.deepEqual(await createBooking(session, booking), { reserveId: 12345, paymentUrl: undefined });
  assert.equal(count, 1);
});
test('network failure is ambiguous and never automatically retried', async () => {
  let count = 0; globalThis.fetch = async () => { count++; throw new TypeError('Network error'); };
  await assert.rejects(() => createBooking(session, booking), error => error instanceof BookingError && error.uncertain);
  assert.equal(count, 1);
});
test('missing reserve ID cannot show successful booking', async () => {
  globalThis.fetch = async () => Response.json({ status: 'success' });
  await assert.rejects(() => createBooking(session, booking), error => error instanceof BookingError && error.uncertain);
});
test('retry ID is stable for the same booking; storage contains no guest details', async () => {
  const memory = new Map<string, string>();
  Object.defineProperty(globalThis, 'sessionStorage', { configurable: true, value: { getItem: (k: string) => memory.get(k) ?? null, setItem: (k: string, v: string) => memory.set(k, v) } });
  const first = await bookingRequestId(booking); const second = await bookingRequestId(booking);
  assert.equal(first, second); assert.notEqual(first, await bookingRequestId({ ...booking, guests: 5 }));
  const stored = [...memory.values()].join(''); assert.ok(!stored.includes(booking.name)); assert.ok(!stored.includes(booking.phone));
});
