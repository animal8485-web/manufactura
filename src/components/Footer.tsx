import signature from '../assets/brand/signature.svg';
import developerMark from '../assets/brand/raven-profile-s-black.png';

export function Footer() {
  return <footer className="site-footer">
    <a className="footer-credit footer-credit--designer" href="https://www.behance.net/grinchuk_m" target="_blank" rel="noopener noreferrer" aria-label="Михаил Гринчук — Behance (откроется в новой вкладке)">
      <img className="footer-signature" src={signature} alt="Grinchuk" width="148" height="24" />
      <span className="chevron" aria-hidden="true" />
    </a>
    <div className="footer-caption">
      <span>Дизайн сайта и брендинг</span>
      <span>Михаил Гринчук</span>
    </div>
    <div className="footer-caption">
      <span>Разработка и техническая реализация</span>
      <span>Иван Симаков</span>
    </div>
    <a className="footer-credit footer-credit--developer" href="https://t.me/web_auditor22" target="_blank" rel="noopener noreferrer" aria-label="Иван Симаков — Telegram (откроется в новой вкладке)">
      <img className="footer-developer-mark" src={developerMark} alt="" width="52" height="67" />
      <span className="chevron" aria-hidden="true" />
    </a>
  </footer>;
}
