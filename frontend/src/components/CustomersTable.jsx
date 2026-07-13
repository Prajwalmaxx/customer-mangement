import React from 'react';
import { formatCurrency } from '../utils/format';

export default function CustomersTable({ rows, loading, totalCount, onOpenRegister, onView, onUpdate, onDelete }) {
  return (
    <section className="customers-panel">
      <div className="customers-panel__head">
        <div>
          <h2>Customers List</h2>
          <p>Total {loading ? '...' : totalCount}</p>
        </div>
        <div className="customers-panel__actions">
          <button type="button" className="btn-filter">
            Filter
          </button>
          <button type="button" className="btn-primary" onClick={onOpenRegister}>
            New Customer
          </button>
        </div>
      </div>

      <div className="table-wrap">
        <table className="customers-table">
          <thead>
            <tr>
              <th>
                <input type="checkbox" aria-label="Select all customers" />
              </th>
              <th>Customer Name</th>
              <th>User Name</th>
              <th>Sessions</th>
              <th>Notes</th>
              <th>Total Outstanding</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>
                  <input type="checkbox" aria-label={`Select ${row.company}`} />
                </td>
                <td>
                  <div className="customer-cell">
                    <span className={`customer-logo ${row.logoClass}`}>{row.logo}</span>
                    <span>
                      <strong>{row.company}</strong>
                      <small>{row.email}</small>
                    </span>
                  </div>
                </td>
                <td>{row.userName}</td>
                <td>{row.sessions}</td>
                <td>{row.notes}</td>
                <td className="money">{formatCurrency(row.outstanding)}</td>
                <td>{row.date}</td>
                <td>
                  <div className="action-buttons">
                    <button type="button" className="action-btn action-btn--view" onClick={() => onView(row)}>
                      View
                    </button>
                    <button type="button" className="action-btn action-btn--update" onClick={() => onUpdate(row)}>
                      Update
                    </button>
                    <button type="button" className="action-btn action-btn--delete" onClick={() => onDelete(row)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
