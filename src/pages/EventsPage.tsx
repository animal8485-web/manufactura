import { Contacts } from '../components/Contacts';
import { EventsAnnouncement } from '../components/EventsAnnouncement';
import '../styles/events.css';

export function EventsPage() {
  return (
    <div className="events-page">
      <header className="screen-header">
        <a className="screen-back" href="/" aria-label="На главную"><span className="chevron" aria-hidden="true" /></a>
        <h1>Афиша</h1>
      </header>
      <EventsAnnouncement />
      <Contacts />
    </div>
  );
}
