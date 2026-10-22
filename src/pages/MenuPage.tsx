import { useEffect, useLayoutEffect, useRef, useState, type PointerEvent } from 'react';
import { Contacts } from '../components/Contacts';
import { menuGroups } from '../data/menu';
import menuTitle from '../assets/menu/menu-title.svg';
import '../styles/menu.css';

export function MenuPage() {
  const [activeGroup, setActiveGroup] = useState('kitchen');
  const [activeCategory, setActiveCategory] = useState('snacks');
  const navigationStart = useRef<HTMLDivElement>(null);
  const categoryNav = useRef<HTMLElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const contentAnimation = useRef<Animation | null>(null);
  const pendingMotion = useRef<{ direction: number; animate: boolean } | null>(null);
  const swipeStart = useRef<{ pointerId: number; x: number; y: number; horizontal: boolean } | null>(null);

  useLayoutEffect(() => {
    const motion = pendingMotion.current;
    pendingMotion.current = null;
    const element = content.current;
    if (!element || !motion) return;

    const previous = contentAnimation.current;
    const style = getComputedStyle(element);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const continuing = previous?.playState === 'running';
    const opacity = continuing ? Number(style.opacity) : .6;
    const transform = continuing ? style.transform : `translateX(${motion.direction * 4}%)`;
    const easing = style.getPropertyValue('--ease-out').trim();
    previous?.cancel();
    contentAnimation.current = null;
    if (!motion.animate) return;

    const animation = element.animate([
      { opacity, transform: reduced ? 'none' : transform },
      { opacity: 1, transform: 'none' },
    ], { duration: reduced ? 150 : 200, easing });
    contentAnimation.current = animation;
    animation.onfinish = () => {
      if (contentAnimation.current === animation) contentAnimation.current = null;
    };
  }, [activeGroup, activeCategory]);

  useEffect(() => () => { contentAnimation.current?.cancel(); }, []);

  useEffect(() => {
    if (activeGroup !== 'kitchen') return;
    const nav = categoryNav.current;
    const button = nav?.querySelector<HTMLButtonElement>('[aria-pressed="true"]');
    if (nav && button) nav.scrollTo({ left: button.offsetLeft - nav.clientWidth / 2 + button.offsetWidth / 2, behavior: 'instant' });
  }, [activeGroup, activeCategory]);

  function returnToMenu() {
    const top = (navigationStart.current?.getBoundingClientRect().top ?? 0) + window.scrollY;
    if (window.scrollY > top) window.scrollTo({ top, behavior: 'instant' });
  }

  function selectCategory(id: string, animate = true) {
    swipeStart.current = null;
    if (id === activeCategory) {
      if (!animate) contentAnimation.current?.cancel();
      returnToMenu();
      return;
    }
    const categories = menuGroups[0].sections;
    const from = categories.findIndex((category) => category.id === activeCategory);
    const to = categories.findIndex((category) => category.id === id);
    pendingMotion.current = { direction: to > from ? 1 : -1, animate };
    setActiveCategory(id);
    returnToMenu();
  }

  function selectGroup(id: string, animate: boolean) {
    swipeStart.current = null;
    if (id === activeGroup) {
      if (!animate) contentAnimation.current?.cancel();
      returnToMenu();
      return;
    }
    const from = menuGroups.findIndex((group) => group.id === activeGroup);
    const to = menuGroups.findIndex((group) => group.id === id);
    pendingMotion.current = { direction: to > from ? 1 : -1, animate };
    setActiveGroup(id);
    returnToMenu();
  }

  function startSwipe(event: PointerEvent<HTMLDivElement>) {
    swipeStart.current = null;
    if (activeGroup !== 'kitchen' || event.pointerType !== 'touch' || !event.isPrimary) return;
    swipeStart.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, horizontal: false };
  }

  function moveSwipe(event: PointerEvent<HTMLDivElement>) {
    const start = swipeStart.current;
    if (!start || start.pointerId !== event.pointerId) return;
    const dx = Math.abs(event.clientX - start.x);
    const dy = Math.abs(event.clientY - start.y);
    if (!start.horizontal && dy > 12 && dy > dx) {
      swipeStart.current = null;
    } else if (!start.horizontal && dx > 12 && dx > dy * 1.4) {
      start.horizontal = true;
      event.currentTarget.setPointerCapture(event.pointerId);
    }
  }

  function finishSwipe(event: PointerEvent<HTMLDivElement>) {
    const start = swipeStart.current;
    swipeStart.current = null;
    if (!start || start.pointerId !== event.pointerId) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    const threshold = Math.min(64, event.currentTarget.clientWidth * .18);
    if (Math.abs(dx) < threshold || Math.abs(dx) < Math.abs(dy) * 1.4) return;
    const categories = menuGroups[0].sections;
    const current = categories.findIndex(({ id }) => id === activeCategory);
    const next = categories[current + (dx < 0 ? 1 : -1)];
    if (next) selectCategory(next.id);
  }

  return (
    <div className="menu-page">
      <header className="menu-mobile-header">
        <a className="menu-back" href="/" aria-label="На главную"><span className="chevron" aria-hidden="true" /></a>
        <span>Бар и кухня</span>
        <a className="menu-booking" href="/booking">Бронь</a>
      </header>
      <h1 className="menu-page-title">
        <span className="sr-only">Бар и кухня</span>
        <img src={menuTitle} alt="" width="393" height="47" />
      </h1>
      <div ref={navigationStart} />
      <div className="menu-navigation">
        <nav className="menu-groups" aria-label="Разделы меню">
          {menuGroups.map(({ id, title }) => (
            <button key={id} type="button" className="menu-group" aria-pressed={activeGroup === id}
              aria-controls={`menu-panel-${id}`}
              onClick={(event) => selectGroup(id, event.detail > 0)}>
              {title}
            </button>
          ))}
        </nav>
        {activeGroup === 'kitchen' && (
          <nav className="menu-categories" ref={categoryNav} aria-label="Категории кухни">
            {menuGroups[0].sections.map(({ id, title }) => (
              <button key={id} type="button" className="menu-category" aria-pressed={activeCategory === id}
                aria-controls={`menu-section-kitchen-${id}`}
                onClick={(event) => selectCategory(id, event.detail > 0)}>{title}</button>
            ))}
          </nav>
        )}
      </div>
      <div className="menu-content-viewport">
      <div ref={content} className={`menu-sections${activeGroup === 'kitchen' ? ' menu-sections--swipe' : ''}`}
        onPointerDown={startSwipe} onPointerMove={moveSwipe} onPointerUp={finishSwipe}
        onPointerCancel={() => { swipeStart.current = null; }}
        onLostPointerCapture={(event) => {
          if (event.target === event.currentTarget && swipeStart.current?.pointerId === event.pointerId) swipeStart.current = null;
        }}>
        {menuGroups.map((group) => (
          <div id={`menu-panel-${group.id}`} key={group.id} hidden={activeGroup !== group.id}>
            {group.sections.map(({ id, title, dishes }) => (
              <section className="menu-category-section"
                id={`menu-section-${group.id}-${id}`} key={id} aria-labelledby={`menu-title-${group.id}-${id}`}
                hidden={group.id === 'kitchen' && activeCategory !== id}>
                <h2 id={`menu-title-${group.id}-${id}`}>{title}</h2>
                <ul className="menu-list">
                  {dishes.map((dish) => (
                    <li className={`menu-item${dish.image ? ' menu-item--with-photo' : ''}`} key={dish.id}>
                      {dish.image && <img className="menu-item__photo" src={dish.image} alt="" width="480" height="480" loading="lazy" decoding="async" draggable={false} />}
                      <div className="menu-item__copy">
                        <h3>{dish.name}</h3>
                        {dish.ingredients && <p>{dish.ingredients}</p>}
                      </div>
                      {dish.portion && <span className="menu-item__portion">{dish.portion}</span>}
                      <span className="menu-item__price" aria-label={`${dish.price} рублей`}>{dish.price}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
            {group.id === 'kitchen' && <p className="menu-note">Скажите нам, если у вас есть аллергия на какой-то продукт</p>}
            {group.id === 'cocktails' && <p className="menu-note">Можем приготовить коктейль на ваш вкус — просто скажите</p>}
          </div>
        ))}
      </div>
      </div>
      <Contacts />
    </div>
  );
}
