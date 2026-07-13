function OrderBuyModal({ order, onClose, onConfirm }) {
  if (!order) {
    return null;
  }

  return (
    <div className="register-modal" role="dialog" aria-modal="true" aria-labelledby="buy-order-title">
      <div className="register-modal__backdrop" onClick={onClose} />
      <section className="register-modal__card customer-view-card">
        <div className="register-modal__head">
          <h2 id="buy-order-title">Buy Order</h2>
          <button type="button" className="register-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="customer-view-grid">
          <div className="customer-view-item">
            <span>Order No</span>
            <strong>{order.orderNo}</strong>
          </div>
          <div className="customer-view-item">
            <span>Customer</span>
            <strong>{order.customer}</strong>
          </div>
          <div className="customer-view-item">
            <span>Amount</span>
            <strong>{formatCurrency(order.amount)}</strong>
          </div>
          <div className="customer-view-item">
            <span>Status</span>
            <strong>{order.status}</strong>
          </div>
          <div className="customer-view-item">
            <span>Date</span>
            <strong>{order.date}</strong>
          </div>
        </div>

        <p className="order-buy-note">Review the order details and confirm your purchase.</p>

        <div className="order-modal-actions">
          <button type="button" className="btn-filter" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn-primary" onClick={() => onConfirm(order)}>
            Confirm Purchase
          </button>
        </div>
      </section>
    </div>
  );
}
