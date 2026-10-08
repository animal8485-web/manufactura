import { navigationItems } from '../data/navigation';
import emblem from '../assets/brand/emblem.svg';

export function Header({ path }: { path: string }) {
  const isInterior = ['/menu', '/events'].includes(path);
  return (
    <header className="site-header">
      <a className="site-logo" href="/" aria-label="Мануфактура — на главную">
        {isInterior ? <img src={emblem} alt="" width="28" height="32" /> : 'Мануфактура'}
      </a>
      <nav className="site-nav" aria-label="Основная навигация">
        {navigationItems.map((item) => (
          <a key={item.href} href={item.href} aria-current={path === item.href ? 'page' : undefined}>{item.label}</a>
        ))}
      </nav>
      <a className="button button--primary" href="/booking">Забронировать</a>
    </header>
  );
}
