import React from 'react';

export default function NewPaymentModal({ formData, submitError, onClose, onChange, onSubmit }) {
  return (
    <div className="register-modal" role="dialog" aria-modal="true" aria-labelledby="new-payment-title">
      <div className="register-modal__backdrop" onClick={onClose} />
      <section className="register-modal__card">
        <div className="register-modal__head">
          <h2 id="new-payment-title">New Payment</h2>
          <button type="button" className="register-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={onSubmit} className="form-grid">
          {submitError && <div className="auth-error register-error">{submitError}</div>}
          <input
            name="invoice"
            value={formData.invoice}
            onChange={onChange}
            placeholder="Invoice Number"
          />
          <input
            name="customer"
            value={formData.customer}
            onChange={onChange}
            placeholder="Customer Name"
          />
          <select name="method" value={formData.method} onChange={onChange}>
            <option value="Card">Card</option>
            <option value="UPI">UPI</option>
            <option value="Net Banking">Net Banking</option>
            <option value="Wallet">Wallet</option>
          </select>
          <input
            name="amount"
            type="number"
            value={formData.amount}
            onChange={onChange}
            placeholder="Amount"
          />
          <button type="submit" className="btn-primary register-submit">
            Create Payment
          </button>
        </form>
      </section>
    </div>
  );
}
