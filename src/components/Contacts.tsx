import { useState } from 'react';
import { LegalDocumentsModal } from './LegalDocumentsModal';

const contacts = [
  { label: '+7 (996) 501-87-57', href: 'tel:+79965018757' },
  { label: 'TELEGRAM', href: 'https://t.me/manufactura_bar' },
  { label: 'MAX', href: null },
  { label: 'INSTAGRAM', href: 'https://www.instagram.com/manufacturabar?stkn=MTI1Y3N5Zmo4M28xMg==' },
  { label: '2GIS', href: 'https://2gis.ru/barnaul/geo/70000001115000756' },
];

export function Contacts({ className = '' }: { className?: string }) {
  const [documentsOpen, setDocumentsOpen] = useState(false);

  return (
    <section className={`contacts-section ${className}`} aria-label="Контакты">
      <div className="contact-list">
        {contacts.map(({ label, href }) => href ? (
          <a className="contact-row" href={href} key={label}
            target={href.startsWith('https:') ? '_blank' : undefined}
            rel={href.startsWith('https:') ? 'noopener noreferrer' : undefined}>
            <span>{label}</span><span className="chevron" aria-hidden="true" />
          </a>
        ) : (
          <span className="contact-row" key={label} aria-disabled="true">
            <span>{label}</span><span className="chevron" aria-hidden="true" />
          </span>
        ))}
      </div>
      <div className="legal-section">
        <p>ООО «Вкусные Делишки»</p>
        <p>ИНН 2225239190</p>
        <button className="legal-documents-trigger" type="button" onClick={() => setDocumentsOpen(true)}>Политика обработки персональных данных</button>
        <p>2026, Все права защищены</p>
      </div>
      <LegalDocumentsModal isOpen={documentsOpen} onClose={() => setDocumentsOpen(false)} />
    </section>
  );
}
