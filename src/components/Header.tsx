import { navigationItems } from '../data/navigation';

export function Header() {
  return (
    <header className="site-header">
      <a className="site-logo" href="/" aria-label="Мануфактура — на главную">
        Мануфактура
      </a>
      <nav className="site-nav" aria-label="Основная навигация">
        {navigationItems.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
      <button className="button button--primary" type="button">
        Забронировать
      </button>
    </header>
  );
}
