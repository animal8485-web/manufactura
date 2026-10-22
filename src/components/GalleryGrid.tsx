import type { GalleryItem } from '../types/content';
import { PhotoRail } from './PhotoRail';

export function GalleryGrid({ items = [], horizontal = false }: { items?: GalleryItem[]; horizontal?: boolean }) {
  const photos = items.map((item) => (
    <figure key={item.id}>
      <img src={item.src} alt={item.alt} loading="lazy" decoding="async" />
    </figure>
  ));
  return horizontal
    ? <PhotoRail className="gallery-grid" label="Фотографии Мануфактуры">{photos}</PhotoRail>
    : <div className="gallery-grid" aria-label="Галерея">{photos}</div>;
}
