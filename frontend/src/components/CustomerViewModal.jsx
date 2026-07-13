import React from 'react';
import { formatCurrency } from '../utils/format';

export default function CustomerViewModal({ row, onClose }) {
  if (!row) {
    return null;
  }

  const customer = row.rawCustomer;

  return (
    <div className="register-modal" role="dialog" aria-modal="true" aria-labelledby="view-customer-title">
      <div className="register-modal__backdrop" onClick={onClose} />
      <section className="register-modal__card customer-view-card">
        <div className="register-modal__head">
          <h2 id="view-customer-title">Customer Details</h2>
          <button type="button" className="register-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="customer-view-grid">
          <div className="customer-view-item">
            <span>Company</span>
            <strong>{row.company}</strong>
          </div>
          <div className="customer-view-item">
            <span>Email</span>
            <strong>{row.email}</strong>
          </div>
          <div className="customer-view-item">
            <span>User Name</span>
            <strong>{row.userName}</strong>
          </div>
          <div className="customer-view-item">
            <span>Customer Number</span>
            <strong>{row.cno ?? row.sessions}</strong>
          </div>
          <div className="customer-view-item">
            <span>Outstanding</span>
            <strong>{formatCurrency(row.outstanding)}</strong>
          </div>
          <div className="customer-view-item">
            <span>Notes</span>
            <strong>{row.notes}</strong>
          </div>
          <div className="customer-view-item">
            <span>Date</span>
            <strong>{row.date}</strong>
          </div>
          <div className="customer-view-item">
            <span>Source</span>
            <strong>{row.source}</strong>
          </div>
        </div>

        {customer && (
          <div className="customer-view-extra">
            <h3>Additional Details</h3>
            <p>
              <strong>Studies:</strong>{' '}
              {Array.isArray(customer.studies) ? customer.studies.join(', ') : '-'}
            </p>
            <p>
              <strong>Favorite Colors:</strong>{' '}
              {Array.isArray(customer.favColor) ? customer.favColor.join(', ') : '-'}
            </p>
            <p>
              <strong>Phone Numbers:</strong>{' '}
              {Array.isArray(customer.phoneNumbers) ? customer.phoneNumbers.join(', ') : '-'}
            </p>
            <p>
              <strong>Company Address:</strong> {customer.company?.addrs ?? '-'}
            </p>
            <p>
              <strong>Company Type:</strong> {customer.company?.type ?? '-'}
            </p>
          </div>
        )}

        <button type="button" className="btn-primary register-submit" onClick={onClose}>
          Close
        </button>
      </section>
    </div>
  );
}
