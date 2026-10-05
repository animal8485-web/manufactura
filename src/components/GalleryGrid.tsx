import type { GalleryItem } from '../types/content';

export function GalleryGrid({ items = [] }: { items?: GalleryItem[] }) {
  return (
    <div className="gallery-grid" aria-label="Галерея">
      {items.map((item) => (
        <figure key={item.id}>
          <img src={item.src} alt={item.alt} />
        </figure>
      ))}
    </div>
  );
}
