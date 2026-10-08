import { useEffect, useRef, useState } from 'react';
import { DishCard } from '../components';
import { Contacts } from '../components/Contacts';
import { menuCategories, menuSections } from '../data/menu';
import menuTitle from '../assets/menu/menu-title.svg';
import '../styles/menu.css';

export function MenuPage() {
  const [activeCategory, setActiveCategory] = useState('snacks');
  const categoryNav = useRef<HTMLElement>(null);

  useEffect(() => {
    function syncCategory() {
      const threshold = (categoryNav.current?.getBoundingClientRect().bottom ?? 0) + 48;
      const current = [...menuSections].reverse().find(({ id }) => {
        const section = document.getElementById(id);
        return section && section.getBoundingClientRect().top <= threshold;
      });
      setActiveCategory(current?.id ?? 'snacks');
    }
    syncCategory();
    window.addEventListener('scroll', syncCategory, { passive: true });
    window.addEventListener('resize', syncCategory);
    return () => {
      window.removeEventListener('scroll', syncCategory);
      window.removeEventListener('resize', syncCategory);
    };
  }, []);

  function navigateToCategory(id: string) {
    setActiveCategory(id);
    document.getElementById(id)?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
      block: 'start',
    });
  }

  return (
    <div className="menu-page">
      <header className="menu-mobile-header">
        <a className="menu-back" href="/" aria-label="На главную"><span className="chevron" aria-hidden="true" /></a>
        <span>Бар и кухня</span>
      </header>
      <h1 className="menu-page-title">
        <span className="sr-only">Бар и кухня</span>
        <img src={menuTitle} alt="" width="393" height="47" />
      </h1>
      <nav className="menu-categories" ref={categoryNav} aria-label="Категории меню">
        {menuCategories.map(({ id, title, available }) => (
          <button
            key={id}
            type="button"
            className={`menu-category${activeCategory === id ? ' is-active' : ''}`}
            aria-current={activeCategory === id ? 'location' : undefined}
            aria-controls={available ? id : undefined}
            disabled={!available}
            title={available ? undefined : 'Раздел пока не заполнен'}
            onClick={() => navigateToCategory(id)}
          >{title}</button>
        ))}
      </nav>
      <div className="menu-sections">
        {menuSections.map(({ id, title, dishes }) => (
          <section className="menu-category-section" id={id} key={id} aria-labelledby={`${id}-title`}>
            <h2 id={`${id}-title`}>{title}</h2>
            <div className="menu-grid">
              {dishes.map((dish) => <DishCard key={dish.id} dish={dish} />)}
            </div>
          </section>
        ))}
      </div>
      <Contacts />
    </div>
  );
}
