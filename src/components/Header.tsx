import { navigationItems } from '../data/navigation';
import emblem from '../assets/brand/header-mark.svg';

export function Header({ path }: { path: string }) {
  return (
    <header className="site-header">
      <a className="site-logo" href="/" aria-label="Мануфактура — на главную">
        <img src={emblem} alt="" width="32" height="32" />
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
