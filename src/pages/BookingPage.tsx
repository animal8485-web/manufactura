import { BookingForm } from '../components/BookingForm';
import { useHydrated } from '../hooks/useHydrated';

export function BookingPage() {
  const hydrated = useHydrated();
  if (hydrated) return <BookingForm />;
  return <section className="booking-surface">
    <header className="screen-header"><a className="screen-back" href="/" aria-label="На главную"><span className="chevron" aria-hidden="true" /></a><h1>Бронирование</h1></header>
    <p>Забронировать стол в Мануфактуре: <a href="tel:+79965018757">+7 (996) 501-87-57</a>.</p>
  </section>;
}
