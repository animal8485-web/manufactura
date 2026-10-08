import { useEffect, useRef } from 'react';
import { BookingForm } from './BookingForm';

interface BookingModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function BookingModal({ isOpen = false, onClose }: BookingModalProps) {
  const dialog = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.current?.querySelector<HTMLButtonElement>('button')?.focus();
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onCloseRef.current?.();
      if (event.key !== 'Tab') return;
      const elements = [...(dialog.current?.querySelectorAll<HTMLElement>('a[href], button, input:not(:disabled)') ?? [])];
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }
    document.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener('keydown', handleKey);
      previousFocus?.focus();
    };
  }, [isOpen]);

  if (!isOpen) return null;
  return <div className="booking-backdrop" onClick={onClose}>
    <div className="booking-dialog" ref={dialog} role="dialog" aria-modal="true" aria-label="Бронирование" onClick={(event) => event.stopPropagation()}>
      <BookingForm onBack={onClose} />
    </div>
  </div>;
}
