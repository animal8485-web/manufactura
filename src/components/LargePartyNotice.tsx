import { useRef } from 'react';

export function LargePartyNotice({ id }: { id: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  return <>
    <button className="booking-option booking-option--guest booking-option--group" type="button" aria-haspopup="dialog" aria-controls={id} onClick={() => dialog.current?.showModal()}><span>8+</span></button>
    <dialog className="booking-group-dialog" id={id} ref={dialog} aria-labelledby={`${id}-title`} aria-describedby={`${id}-description`}
      onKeyDown={event => { if (event.key === 'Escape' || event.key === 'Tab') event.stopPropagation(); }}
      onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
      <div className="booking-group-content">
        <h2 id={`${id}-title`}>Компания 8+ персон</h2>
        <p id={`${id}-description`}>Бронирование на 8+ персон производится по предварительному согласованию. Свяжитесь с нами:</p>
        <a className="booking-group-phone" href="tel:+79965018757">+7 (996) 501-87-57</a>
        <button className="booking-submit" type="button" onClick={() => dialog.current?.close()}>Понятно</button>
      </div>
    </dialog>
  </>;
}
