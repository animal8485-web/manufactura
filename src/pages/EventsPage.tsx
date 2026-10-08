import { Contacts } from '../components/Contacts';
import { events } from '../data/events';
import '../styles/events.css';

export function EventsPage() {
  return (
    <div className="events-page">
      <header className="screen-header">
        <a className="screen-back" href="/" aria-label="На главную"><span className="chevron" aria-hidden="true" /></a>
        <h1>Афиша</h1>
      </header>
      <div className="events-list">
        {events.map((event) => (
          <article className="event-detail" key={event.id} aria-label={event.title}>
            <h2><time dateTime={event.isoDate}>{event.date}</time></h2>
            <time className="event-detail__time" dateTime={`${event.isoDate}T${event.description}`}>{event.description}</time>
            <div className="event-detail__weekday">
              <div className="event-detail__bars" aria-hidden="true">{Array.from({ length: 7 }, (_, i) => <span key={i} className={i === (new Date(`${event.isoDate}T12:00:00Z`).getUTCDay() + 6) % 7 ? 'is-active' : undefined} />)}</div>
              <span>{new Intl.DateTimeFormat('ru', { weekday: 'long', timeZone: 'UTC' }).format(new Date(`${event.isoDate}T12:00:00Z`))}</span>
            </div>
            <img className="event-detail__poster" src={event.image} alt={`Афиша ${event.title}`} width="342" height="470" />
          </article>
        ))}
      </div>
      <Contacts />
    </div>
  );
}
