import { useEffect, useRef, type ReactNode } from 'react';

export function PhotoRail({ children, className, label }: {
  children: ReactNode;
  className: string;
  label: string;
}) {
  const rail = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const current = rail.current;
    if (!current) return;
    const element = current;
    let target = element.scrollLeft;
    let direction = 0;
    let pending = false;
    let visible = false;
    let touching = false;
    let autoDirection = 1;
    let autoPosition: number | null = null;
    let resumeAt = 0;
    let previousTime = 0;
    let frame = 0;
    let wake = 0;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

    function canMove() {
      return visible && !document.hidden && !reduced.matches && !touching
        && !element.matches(':focus-visible') && element.scrollWidth > element.clientWidth + 1;
    }

    function tick(time: number) {
      frame = 0;
      if (!canMove()) return;
      const elapsed = previousTime ? Math.min(time - previousTime, 50) : 0;
      previousTime = time;
      const max = element.scrollWidth - element.clientWidth;
      autoPosition = Math.max(0, Math.min(max, (autoPosition ?? element.scrollLeft) + autoDirection * elapsed * .018));
      // Move at 18 px/s, reversing gently at the ends without a reset jump.
      element.scrollTo({ left: autoPosition, behavior: 'instant' });
      if (autoPosition >= max) autoDirection = -1;
      else if (autoPosition <= 0) autoDirection = 1;
      frame = requestAnimationFrame(tick);
    }

    function syncMotion() {
      cancelAnimationFrame(frame);
      clearTimeout(wake);
      frame = 0;
      previousTime = 0;
      if (!canMove()) return;
      const wait = resumeAt - performance.now();
      if (wait > 0) wake = window.setTimeout(syncMotion, wait);
      else frame = requestAnimationFrame(tick);
    }

    function manualControl() {
      autoPosition = null;
      resumeAt = performance.now() + 3500;
      syncMotion();
    }

    function stopScroll() {
      target = element.scrollLeft;
      pending = false;
      direction = 0;
      element.scrollTo({ left: target, behavior: 'instant' });
    }

    function pointerDown() {
      touching = true;
      stopScroll();
      manualControl();
    }

    function pointerUp() {
      if (!touching) return;
      touching = false;
      manualControl();
    }

    function finishScroll() {
      target = element.scrollLeft;
      pending = false;
    }

    function wheel(event: WheelEvent) {
      if (event.ctrlKey || event.defaultPrevented) return;
      manualControl();
      // Keep native horizontal trackpad gestures and browser zoom intact.
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
        if (pending) stopScroll();
        return;
      }
      if (!event.deltaY) return;
      const max = element.scrollWidth - element.clientWidth;
      const nextDirection = Math.sign(event.deltaY);
      const position = element.scrollLeft;
      // At either end, the same wheel gesture can continue down the page.
      if (max <= 1 || (nextDirection < 0 && position <= 1) || (nextDirection > 0 && position >= max - 1)) return;
      event.preventDefault();
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? element.clientWidth : 1;
      if (!pending || direction !== nextDirection) target = position;
      target = Math.max(0, Math.min(max, target + event.deltaY * unit));
      direction = nextDirection;
      autoDirection = nextDirection;
      pending = true;
      element.scrollTo({ left: target, behavior: reduced.matches ? 'instant' : 'smooth' });
    }

    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      autoPosition = null;
      syncMotion();
    }, { threshold: .15 });
    const resize = new ResizeObserver(() => { autoPosition = null; syncMotion(); });
    function motionPreference() {
      if (reduced.matches) stopScroll();
      autoPosition = null;
      syncMotion();
    }
    visibility.observe(element);
    resize.observe(element);
    element.addEventListener('wheel', wheel, { passive: false });
    element.addEventListener('pointerdown', pointerDown);
    element.addEventListener('scrollend', finishScroll);
    element.addEventListener('focusin', syncMotion);
    element.addEventListener('focusout', syncMotion);
    element.addEventListener('keydown', manualControl);
    window.addEventListener('pointerup', pointerUp);
    window.addEventListener('pointercancel', pointerUp);
    document.addEventListener('visibilitychange', syncMotion);
    reduced.addEventListener('change', motionPreference);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(wake);
      visibility.disconnect();
      resize.disconnect();
      element.removeEventListener('wheel', wheel);
      element.removeEventListener('pointerdown', pointerDown);
      element.removeEventListener('scrollend', finishScroll);
      element.removeEventListener('focusin', syncMotion);
      element.removeEventListener('focusout', syncMotion);
      element.removeEventListener('keydown', manualControl);
      window.removeEventListener('pointerup', pointerUp);
      window.removeEventListener('pointercancel', pointerUp);
      document.removeEventListener('visibilitychange', syncMotion);
      reduced.removeEventListener('change', motionPreference);
    };
  }, []);

  return <div ref={rail} className={`${className} photo-rail`} role="group" aria-label={label} tabIndex={0}>
    {children}
  </div>;
}
