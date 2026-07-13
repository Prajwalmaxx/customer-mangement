import React, { useState } from 'react';
import { formatCurrency } from '../utils/format';

export default function PaymentPayModal({ payment, title, confirmLabel, onClose, onConfirm }) {
  const [method, setMethod] = useState(payment?.method ?? 'Card');

  if (!payment) {
    return null;
  }

  return (
    <div className="register-modal" role="dialog" aria-modal="true" aria-labelledby="pay-payment-title">
      <div className="register-modal__backdrop" onClick={onClose} />
      <section className="register-modal__card customer-view-card">
        <div className="register-modal__head">
          <h2 id="pay-payment-title">{title}</h2>
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
            <span>Amount</span>
            <strong>{formatCurrency(payment.amount)}</strong>
          </div>
          <div className="customer-view-item">
            <span>Status</span>
            <strong>{payment.status}</strong>
          </div>
        </div>

        <div className="payment-form-field">
          <label htmlFor="payment-method">Payment Method</label>
          <select
            id="payment-method"
            value={method}
            onChange={(event) => setMethod(event.target.value)}
          >
            <option value="Card">Card</option>
            <option value="UPI">UPI</option>
            <option value="Net Banking">Net Banking</option>
            <option value="Wallet">Wallet</option>
          </select>
        </div>

        <div className="order-modal-actions">
          <button type="button" className="btn-filter" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn-primary" onClick={() => onConfirm(payment, method)}>
            {confirmLabel}
          </button>
        </div>
      </section>
    </div>
  );
}
