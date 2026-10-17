import { useEffect, useRef } from 'react';

const documents = [
  'Политика обработки персональных данных.pdf',
  'Пользовательское соглашение.pdf',
  'Согласие на обработку персональных данных.pdf',
].map((title) => ({
  title: title.replace(/\.pdf$/, ''),
  href: `/documents/${encodeURIComponent(title)}`,
}));

interface LegalDocumentsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LegalDocumentsModal({ isOpen, onClose }: LegalDocumentsModalProps) {
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
      if (event.key === 'Escape') onCloseRef.current();
      if (event.key !== 'Tab') return;
      const elements = [...(dialog.current?.querySelectorAll<HTMLElement>('a[href], button') ?? [])];
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }

    document.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener('keydown', handleKey);
      previousFocus?.focus();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return <div className="legal-documents-backdrop" onClick={onClose}>
    <div className="legal-documents-dialog" ref={dialog} role="dialog" aria-modal="true" aria-labelledby="legal-documents-title" onClick={(event) => event.stopPropagation()}>
      <div className="legal-documents-heading">
        <h2 id="legal-documents-title">Документы</h2>
        <button className="legal-documents-close" type="button" onClick={onClose} aria-label="Закрыть документы">×</button>
      </div>
      <div className="legal-documents-list">
        {documents.map(({ title, href }) => <a className="legal-document-card" href={href} target="_blank" rel="noopener noreferrer" key={href}>
          <span>{title}</span>
          <span className="chevron" aria-hidden="true" />
        </a>)}
      </div>
    </div>
  </div>;
}
