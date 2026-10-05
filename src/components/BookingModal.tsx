interface BookingModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function BookingModal({ isOpen = false, onClose }: BookingModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="booking-title" onClick={(event) => event.stopPropagation()}>
        <button className="modal__close" type="button" onClick={onClose} aria-label="Закрыть">
          ×
        </button>
        <h2 id="booking-title">Бронирование</h2>
        <p>Форма бронирования будет подключена на следующем этапе.</p>
      </section>
    </div>
  );
}
