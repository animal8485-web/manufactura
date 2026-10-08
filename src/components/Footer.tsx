import signature from '../assets/brand/signature.svg';

export function Footer() {
  return <footer className="site-footer">
    <a className="footer-credit" href="https://www.behance.net/grinchuk_m" target="_blank" rel="noopener noreferrer" aria-label="Михаил Гринчук — Behance (откроется в новой вкладке)">
      <img className="footer-signature" src={signature} alt="Grinchuk" width="148" height="24" />
      <span className="chevron" aria-hidden="true" />
    </a>
    <div className="footer-caption"><span>Дизайн сайта и брендинг</span><span>Михаил Гринчук</span></div>
  </footer>;
}
