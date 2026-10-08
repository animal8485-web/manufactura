import { useEffect, useId, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import {
  BookingError, bookingDates, bookingRequestId, createBooking, getBookingSlots, normalizePhone, startBooking,
} from '../integrations/remarked';
import type { BookingReceipt, BookingRequest, BookingSession, BookingSlot } from '../integrations/remarked';
import '../styles/booking.css';
import { PhoneInput } from './PhoneInput';
import { LargePartyNotice } from './LargePartyNotice';

const dateLabel = (date: string, options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('ru', { ...options, timeZone: 'UTC' }).format(new Date(`${date}T12:00:00Z`)).replace('.', '');
const fallback = 'Не удалось связаться с сервисом бронирования. Попробуйте ещё раз или позвоните нам.';

export function BookingForm({ onBack }: { onBack?: () => void }) {
  const id = useId();
  const [dates] = useState(bookingDates);
  const [date, setDate] = useState(dates[0]);
  const [guests, setGuests] = useState(4);
  const [time, setTime] = useState('');
  const [session, setSession] = useState<BookingSession | null>(null);
  const [availability, setAvailability] = useState<{ date: string; guests: number; slots: BookingSlot[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [reload, setReload] = useState(0);
  const [notice, setNotice] = useState('');
  const [sending, setSending] = useState(false);
  const [attempt, setAttempt] = useState<BookingRequest | null>(null);
  const [receipt, setReceipt] = useState<BookingReceipt | null>(null);
  const submitLock = useRef(false);
  const noticeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    startBooking(controller.signal).then(value => {
      setSession(value);
      setGuests(current => Math.max(value.minGuests, Math.min(value.maxGuests, current)));
    }).catch(error => {
      if (!controller.signal.aborted) { setLoadError(error instanceof Error ? error.message : fallback); setLoading(false); }
    });
    return () => controller.abort();
  }, [reload]);

  useEffect(() => {
    if (!session) return;
    const controller = new AbortController();
    getBookingSlots(session, date, guests, controller.signal).then(slots => {
      if (!controller.signal.aborted) {
        setAvailability({ date, guests, slots }); setLoading(false); setLoadError('');
      }
    }).catch(error => {
      if (!controller.signal.aborted) { setLoadError(error instanceof Error ? error.message : fallback); setLoading(false); }
    });
    return () => controller.abort();
  }, [session, date, guests]);

  useEffect(() => { if (notice || receipt) noticeRef.current?.focus(); }, [notice, receipt]);

  const slots = !loadError && availability?.date === date && availability.guests === guests ? availability.slots : [];
  const nextDate = new Date(`${date}T12:00:00Z`);
  nextDate.setUTCDate(nextDate.getUTCDate() + 1);
  const timeOptions = Array.from({ length: 29 }, (_, index) => {
    const minutes = 17 * 60 + index * 15;
    const value = `${String(Math.floor(minutes / 60) % 24).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
    const slotDate = minutes === 24 * 60 ? nextDate.toISOString().slice(0, 10) : date;
    const slotId = `${slotDate} ${value}:00`;
    return { id: slotId, time: value, nextDay: slotDate !== date, available: slots.some(slot => slot.id === slotId) };
  });
  const hasAvailableTime = timeOptions.some(option => option.available);
  const selected = timeOptions.some(option => option.id === time && option.available) ? slots.find(slot => slot.id === time) : undefined;
  const locked = sending || attempt !== null;
  const guestOptions = session ? Array.from({ length: session.maxGuests - session.minGuests + 1 }, (_, i) => i + session.minGuests) : [1, 2, 3, 4, 5, 6, 7, 8];

  function refresh() {
    setLoadError(''); setNotice(''); setTime(''); setLoading(true); setAvailability(null); setSession(null);
    setReload(value => value + 1);
  }

  function changeSelection(nextDate: string, nextGuests: number) {
    setDate(nextDate); setGuests(nextGuests); setTime(''); setNotice(''); setLoadError(''); setLoading(true);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session || receipt || submitLock.current) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    if (data.get('website')) return;
    if (!attempt && (!selected || data.get('consent') !== 'on')) return;
    const phone = normalizePhone(String(data.get('phone') ?? ''));
    if (!attempt && !phone) {
      const input = form.elements.namedItem('phone') as HTMLInputElement;
      input.setCustomValidity('Введите корректный номер телефона.'); input.reportValidity(); return;
    }
    submitLock.current = true; setSending(true); setNotice('');
    try {
      let request = attempt;
      if (!request && selected && phone) {
        const freshSlots = await getBookingSlots(session, date, guests);
        setAvailability({ date, guests, slots: freshSlots });
        if (!freshSlots.some(slot => slot.id === selected.id)) {
          setTime(''); throw new BookingError('Это время уже занято. Выберите другой свободный интервал.');
        }
        const input = { name: String(data.get('name') ?? '').trim(), phone, date: selected.date, time: selected.time, guests };
        request = { ...input, requestId: await bookingRequestId(input) };
        setAttempt(request);
      }
      if (!request) return;
      const result = await createBooking(session, request);
      setReceipt(result); setAttempt(null);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : fallback);
      if (!(error instanceof BookingError && error.uncertain)) setAttempt(null);
    } finally { submitLock.current = false; setSending(false); }
  }

  return (
    <div className="booking-surface">
      <header className="screen-header">
        {onBack ? <button className="screen-back" type="button" onClick={onBack} aria-label="Закрыть бронирование"><span className="chevron" aria-hidden="true" /></button>
          : <a className="screen-back" href="/" aria-label="На главную"><span className="chevron" aria-hidden="true" /></a>}
        <h1 id={`${id}-title`}>Бронирование</h1>
      </header>
      {receipt ? <div className="booking-notice booking-success" role="status" tabIndex={-1} ref={noticeRef}>
        <h2>Заявка отправлена</h2>
        <p>Номер заявки: {receipt.reserveId}. Ожидайте подтверждения от администратора.</p>
        {receipt.paymentUrl && <p><a href={receipt.paymentUrl} target="_blank" rel="noopener noreferrer">Перейти к оплате бронирования</a></p>}
        <p>По вопросам бронирования: <a href="tel:+79965018757">+7 (996) 501-87-57</a></p>
        <a className="booking-home" href="/">На главную</a>
      </div> : <form className="booking-form" onSubmit={submit} aria-labelledby={`${id}-title`} aria-busy={sending}>
        <div className="booking-fields">
          <label className="booking-field">
            <span className="sr-only">Ваше имя</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="12" cy="7" r="4" /><path d="M3 21c0-7 18-7 18 0" /></svg>
            <input name="name" autoComplete="given-name" placeholder="Ваше имя" required maxLength={80} pattern=".*\S.*" disabled={locked} />
          </label>
          <label className="booking-field">
            <span className="sr-only">Номер телефона</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m6 3 4 5-3 3c2 3 3 4 6 6l3-3 5 4c-1 3-2 4-5 3C8 18 3 13 2 7c0-2 1-4 4-4Z" /></svg>
            <PhoneInput disabled={locked} />
          </label>
        </div>
        <div className="booking-honeypot" aria-hidden="true"><label>Ваш сайт<input name="website" autoComplete="off" tabIndex={-1} /></label></div>
        <fieldset className="booking-choice booking-choice--dates" disabled={locked || !session}>
          <legend>Выберите дату</legend>
          <div className="booking-options">
            {dates.map(value => <label className="booking-option booking-option--date" key={value}>
              <input type="radio" name="date" value={value} checked={date === value} onChange={() => changeSelection(value, guests)} required />
              <span><strong>{Number(value.slice(8))}</strong><small>{dateLabel(value, { month: 'short' })}, {dateLabel(value, { weekday: 'short' })}</small></span>
            </label>)}
          </div>
        </fieldset>
        <fieldset className="booking-choice" disabled={locked}>
          <legend>Количество персон</legend>
          <div className="booking-options booking-options--guests">
            {guestOptions.map(value => <label className="booking-option booking-option--guest" key={value}>
              <input type="radio" name="guests" disabled={!session} value={value} checked={guests === value} onChange={() => changeSelection(date, value)} />
              <span>{value}</span>
            </label>)}
            <LargePartyNotice id={`${id}-large-party`} />
          </div>
        </fieldset>
        <fieldset className="booking-choice" aria-describedby={`${id}-reservation-terms`} disabled={locked || loading}>
          <legend>Выберите время</legend>
          <p className="booking-reservation-note" id={`${id}-reservation-terms`}>Стол будет зарезервирован для Вас на 3 часа. Мы сохраняем бронь в течение 20 минут после указанного времени. Если Вы задерживаетесь, пожалуйста, предупредите нас заранее.</p>
          <p className="booking-timezone">Время местное, Барнаул.</p>
          <div className="booking-availability" role="status" aria-live="polite">
            {loading ? <p>Проверяем свободное время…</p> : loadError ? <p>{loadError}</p> : !hasAvailableTime ? <p>На эту дату нет свободного времени для {guests} гостей. Выберите другую дату или количество персон.</p> : null}
          </div>
          <div className="booking-options">
            {timeOptions.map(option => <label className="booking-option booking-option--time" key={option.id}>
              <input type="radio" name="time" value={option.id} checked={time === option.id} disabled={!option.available} onChange={() => { setTime(option.id); setNotice(''); }} required />
              <span>{option.time}{option.nextDay && <small>+1 день</small>}</span>
            </label>)}
          </div>
        </fieldset>
        {loadError && <div className="booking-notice"><button className="booking-retry" type="button" onClick={refresh} disabled={locked}>Попробовать снова</button><p><a href="tel:+79965018757">Позвонить: +7 (996) 501-87-57</a></p></div>}
        <label className="booking-consent">
          <input type="checkbox" name="consent" required disabled={locked} />
          <span>Даю согласие на обработку моих персональных данных<br />на условиях, определённых Политикой конфиденциальности</span>
        </label>
        <button className="booking-submit" type="submit" disabled={sending || (!attempt && (!selected || loading || !!loadError))}>{sending ? 'Отправляем заявку…' : attempt ? 'Повторить тот же запрос' : 'Отправить заявку'}</button>
        {notice && <div className="booking-notice" role="status" tabIndex={-1} ref={noticeRef}><p>{notice}</p><a href="tel:+79965018757">+7 (996) 501-87-57</a></div>}
      </form>}
    </div>
  );
}
