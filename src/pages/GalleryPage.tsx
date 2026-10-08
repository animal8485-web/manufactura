import { GalleryGrid } from '../components';
import { Contacts } from '../components/Contacts';
import { gallery } from '../data/gallery';
import '../styles/gallery.css';

export function GalleryPage() {
  return <div className="gallery-page">
    <header className="screen-header">
      <a className="screen-back" href="/" aria-label="На главную"><span className="chevron" aria-hidden="true" /></a>
      <h1>Галерея</h1>
    </header>
    <GalleryGrid items={gallery} />
    <Contacts />
  </div>;
}
