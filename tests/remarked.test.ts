import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { BookingError, bookingDates, bookingRequestId, createBooking, getBookingSlots, normalizePhone, parseSlots, startBooking, venueDateTime } from '../src/integrations/remarked.ts';
const originalFetch = globalThis.fetch;
const originalStorage = Object.getOwnPropertyDescriptor(globalThis, 'sessionStorage');
afterEach(() => { globalThis.fetch = originalFetch; if (originalStorage) Object.defineProperty(globalThis, 'sessionStorage', originalStorage); else Reflect.deleteProperty(globalThis, 'sessionStorage'); });
const session = { token: 'test-token', minGuests: 1, maxGuests: 8 };
const booking = { name: 'Тест', phone: '89991234567', date: '2026-10-08', time: '17:00', guests: 4, requestId: 'b90e969d-7593-44e0-92fb-c98d6b9b9909' };
test('venue dates are independent of browser timezone and include the month end', () => {
  assert.equal(venueDateTime(new Date('2026-10-07T18:00:00Z')), '2026-10-08 01:00:00');
  const dates = bookingDates(new Date('2026-10-07T18:00:00Z'));
  assert.equal(dates[0], '2026-10-08'); assert.equal(dates.at(-1), '2026-10-31');
});
test('normalizes Russian phones and rejects short numbers', () => {
  assert.equal(normalizePhone('8 (999) 123-45-67'), '+79991234567');
  assert.equal(normalizePhone('9991234567'), '+79991234567');
  assert.equal(normalizePhone('123'), null);
});
test('slots exclude busy, past and wrong-duration options; retain overnight date', () => {
  const row = (start: string, free = true, duration = 10800) => ({ start_datetime: start, start_stamp: 1, is_free: free, duration });
  const slots = parseSlots([row('2026-10-07 17:00:00'), row('2026-10-07 20:00:00'), row('2026-10-07 23:00:00', false), row('2026-10-08 02:00:00'), row('2026-10-07 22:00:00', true, 3600)], '2026-10-07', new Date('2026-10-07T10:01:00Z'));
  assert.deepEqual(slots.map(s => [s.date, s.time]), [['2026-10-07', '20:00'], ['2026-10-08', '02:00']]);
});
test('GetToken uses the venue ID and actual capacity', async () => {
  globalThis.fetch = async (_url, init) => {
    const body = JSON.parse(String(init?.body)); assert.equal(body.method, 'GetToken'); assert.equal(body.point, 599599);
    return Response.json({ token: 'test-token', capacity: { min: 2, max: 6 } });
  };
  assert.deepEqual(await startBooking(), { token: 'test-token', minGuests: 2, maxGuests: 6 });
});
test('availability requests use the guest count and three-hour duration', async () => {
  globalThis.fetch = async (_url, init) => {
    const body = JSON.parse(String(init?.body)); assert.equal(body.guests_count, 6); assert.equal(body.slot_duration, 10800);
    assert.deepEqual(body.reserve_date_period, { from: '2026-10-08', to: '2026-10-08' });
    return Response.json({ status: 'success', slots: [] });
  };
  assert.deepEqual(await getBookingSlots(session, '2026-10-08', 6), []);
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
