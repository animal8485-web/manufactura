import type { EventItem } from '../types/content';

export function EventCard({ event }: { event: EventItem }) {
  return (
    <article className="card event-card">
      {event.image && <img src={event.image} alt="" />}
      <div className="card__body">
        {event.date && <time>{event.date}</time>}
        <h3>{event.title}</h3>
        {event.description && <p>{event.description}</p>}
      </div>
    </article>
  );
}
