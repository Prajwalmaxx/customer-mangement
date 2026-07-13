function PaymentViewModal({ payment, onClose }) {
  if (!payment) {
    return null;
  }

  return (
    <div className="register-modal" role="dialog" aria-modal="true" aria-labelledby="view-payment-title">
      <div className="register-modal__backdrop" onClick={onClose} />
      <section className="register-modal__card customer-view-card">
        <div className="register-modal__head">
          <h2 id="view-payment-title">Payment Details</h2>
          <button type="button" className="register-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="customer-view-grid">
          <div className="customer-view-item">
            <span>Invoice</span>
            <strong>{payment.invoice}</strong>
          </div>
          <div className="customer-view-item">
            <span>Customer</span>
            <strong>{payment.customer}</strong>
          </div>
          <div className="customer-view-item">
            <span>Method</span>
            <strong>{payment.method}</strong>
          </div>
          <div className="customer-view-item">
            <span>Amount</span>
            <strong>{formatCurrency(payment.amount)}</strong>
          </div>
          <div className="customer-view-item">
            <span>Status</span>
            <strong>{payment.status}</strong>
          </div>
          <div className="customer-view-item">
            <span>Date</span>
            <strong>{payment.date}</strong>
          </div>
        </div>

        <button type="button" className="btn-primary register-submit" onClick={onClose}>
          Close
        </button>
      </section>
    </div>
  );
}
