import type { EventItem } from '../types/content';

export function EventCard({ event }: { event: EventItem }) {
  return <article className="card event-card" aria-label={event.title}>
    {event.image && <img src={event.image} alt={event.title} />}
    <div className="card__body">
      {event.date && <p className="event-card__date">{event.date}</p>}
      {event.description && <p>{event.description}</p>}
    </div>
  </article>;
}
