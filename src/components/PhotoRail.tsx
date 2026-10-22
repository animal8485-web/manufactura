import { useEffect, useRef, type ReactNode } from 'react';

export function PhotoRail({ children, className, label }: {
  children: ReactNode;
  className: string;
  label: string;
}) {
  const rail = useRef<HTMLDivElement>(null);
  const leadingSet = useRef<HTMLDivElement>(null);
  const originalSet = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const current = rail.current;
    if (!current) return;
    const element = current;
    let period = 0;
    let target = 0;
    let direction = 0;
    let pending = false;
    let visible = false;
    let touching = false;
    let keyboardFocused = false;
    let autoDirection = 1;
    let autoPosition: number | null = null;
    let resumeAt = 0;
    let previousTime = 0;
    let frame = 0;
    let wake = 0;
    let scrollSettled = 0;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

    function wrap(position: number) {
      return period ? period + ((position - period) % period + period) % period : position;
    }

    function normalizeScroll() {
      if (!period) return;
      const position = element.scrollLeft;
      // Adjacent copies are identical, so moving by one period is invisible.
      if (position >= period - 1 && position < period * 2 - 1) return;
      const normalized = wrap(position);
      const shift = normalized - position;
      element.scrollTo({ left: normalized, behavior: 'instant' });
      target += shift;
      if (autoPosition !== null) autoPosition += shift;
    }

    function canMove() {
      return visible && !document.hidden && !reduced.matches
        && !touching && !keyboardFocused && period > 0;
    }

    function tick(time: number) {
      frame = 0;
      if (!canMove()) return;
      const elapsed = previousTime ? Math.min(time - previousTime, 50) : 0;
      previousTime = time;
      autoPosition = wrap((autoPosition ?? element.scrollLeft) + autoDirection * elapsed * .018);
      element.scrollTo({ left: autoPosition, behavior: 'instant' });
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
      clearTimeout(scrollSettled);
      pending = false;
      direction = 0;
      element.scrollTo({ left: element.scrollLeft, behavior: 'instant' });
      normalizeScroll();
      target = element.scrollLeft;
    }

    function pointerDown() {
      touching = true;
      keyboardFocused = false;
      stopScroll();
      manualControl();
    }

    function pointerUp(event: Event) {
      // Native panning cancels the pointer stream before the finger is lifted.
      // Touch events keep ownership until the gesture actually ends.
      if (event.type === 'pointercancel' && (event as globalThis.PointerEvent).pointerType === 'touch') return;
      if (event.type.startsWith('touch') && (event as TouchEvent).touches.length) return;
      if (!touching) return;
      touching = false;
      manualControl();
    }

    function touchStart() {
      touching = true;
      keyboardFocused = false;
      manualControl();
    }

    function focusIn() {
      keyboardFocused = !touching && element.matches(':focus-visible');
      syncMotion();
    }

    function focusOut() {
      keyboardFocused = false;
      syncMotion();
    }

    function keyDown() {
      keyboardFocused = true;
      manualControl();
    }

    function finishScroll() {
      clearTimeout(scrollSettled);
      pending = false;
      normalizeScroll();
      target = element.scrollLeft;
    }

    function scroll() {
      // Let the browser finish smooth wheel navigation before recentering it.
      if (pending) {
        clearTimeout(scrollSettled);
        scrollSettled = window.setTimeout(finishScroll, 140);
      } else normalizeScroll();
    }

    function wheel(event: WheelEvent) {
      if (event.ctrlKey || event.defaultPrevented) return;
      manualControl();
      // Native horizontal trackpad gestures keep the browser's momentum.
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
        if (pending) stopScroll();
        return;
      }
      if (!event.deltaY || !period) return;
      event.preventDefault();
      const nextDirection = Math.sign(event.deltaY);
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? element.clientWidth : 1;
      if (!pending || direction !== nextDirection) {
        stopScroll();
        target = element.scrollLeft;
      }
      target = Math.max(0, Math.min(element.scrollWidth - element.clientWidth, target + event.deltaY * unit));
      direction = nextDirection;
      autoDirection = nextDirection;
      pending = true;
      element.scrollTo({ left: target, behavior: reduced.matches ? 'instant' : 'smooth' });
      clearTimeout(scrollSettled);
      scrollSettled = window.setTimeout(finishScroll, 140);
    }

    function measure() {
      const first = leadingSet.current?.firstElementChild;
      const original = originalSet.current?.firstElementChild;
      if (!first || !original) return;
      const nextPeriod = original.getBoundingClientRect().left - first.getBoundingClientRect().left;
      if (Math.abs(nextPeriod - period) > .1) {
        const phase = period ? ((element.scrollLeft - period) % period + period) % period / period : 0;
        period = nextPeriod;
        pending = false;
        target = period * (1 + phase);
        autoPosition = null;
        element.scrollTo({ left: target, behavior: 'instant' });
      }
      syncMotion();
    }

    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      autoPosition = null;
      syncMotion();
    }, { threshold: .15 });
    const resize = new ResizeObserver(measure);
    function motionPreference() {
      if (reduced.matches) stopScroll();
      autoPosition = null;
      syncMotion();
    }
    measure();
    visibility.observe(element);
    resize.observe(element);
    element.addEventListener('wheel', wheel, { passive: false });
    element.addEventListener('pointerdown', pointerDown);
    element.addEventListener('touchstart', touchStart, { passive: true });
    element.addEventListener('scroll', scroll, { passive: true });
    element.addEventListener('scrollend', finishScroll);
    element.addEventListener('focusin', focusIn);
    element.addEventListener('focusout', focusOut);
    element.addEventListener('keydown', keyDown);
    window.addEventListener('pointerup', pointerUp);
    window.addEventListener('pointercancel', pointerUp);
    window.addEventListener('touchend', pointerUp, { passive: true });
    window.addEventListener('touchcancel', pointerUp, { passive: true });
    document.addEventListener('visibilitychange', syncMotion);
    reduced.addEventListener('change', motionPreference);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(wake);
      clearTimeout(scrollSettled);
      visibility.disconnect();
      resize.disconnect();
      element.removeEventListener('wheel', wheel);
      element.removeEventListener('pointerdown', pointerDown);
      element.removeEventListener('touchstart', touchStart);
      element.removeEventListener('scroll', scroll);
      element.removeEventListener('scrollend', finishScroll);
      element.removeEventListener('focusin', focusIn);
      element.removeEventListener('focusout', focusOut);
      element.removeEventListener('keydown', keyDown);
      window.removeEventListener('pointerup', pointerUp);
      window.removeEventListener('pointercancel', pointerUp);
      window.removeEventListener('touchend', pointerUp);
      window.removeEventListener('touchcancel', pointerUp);
      document.removeEventListener('visibilitychange', syncMotion);
      reduced.removeEventListener('change', motionPreference);
    };
  }, []);

  return <div ref={rail} className={`${className} photo-rail`} role="group" aria-label={label} tabIndex={0}>
    <div ref={leadingSet} className="photo-rail__set" aria-hidden="true" inert>{children}</div>
    <div ref={originalSet} className="photo-rail__set" data-rail-original>{children}</div>
    <div className="photo-rail__set" aria-hidden="true" inert>{children}</div>
  </div>;
}
