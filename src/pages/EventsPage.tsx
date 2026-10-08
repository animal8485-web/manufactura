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
            <div className="event-detail__meta">
              <span>{new Intl.DateTimeFormat('ru', { weekday: 'long' }).format(new Date(`${event.isoDate}T12:00:00`))}</span>
              <time dateTime={`${event.isoDate}T${event.description}`}>{event.description}</time>
            </div>
            <img className="event-detail__poster" src={event.image} alt={`Афиша ${event.title}`} width="342" height="470" />
          </article>
        ))}
      </div>
      <Contacts />
    </div>
  );
}
