import React from 'react';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import {
  closeCreatePaymentModal,
  closePayModal,
  closePaymentView,
  completePayment,
  createPayment,
  openCreatePaymentModal,
  openPayModal,
  openPaymentView,
  setPaymentSubmitError,
  updatePaymentFormField,
} from '../store/paymentSlice';
import { formatCurrency, formatToday } from '../utils/format';
import NewPaymentModal from './NewPaymentModal';
import PaymentPayModal from './PaymentPayModal';
import PaymentViewModal from './PaymentViewModal';
import StatCard from './StatCard';

export default function PaymentPanel({ searchQuery }) {
  const dispatch = useAppDispatch();
  const {
    payments,
    viewPayment,
    payPayment,
    payMode,
    showCreateModal,
    formData,
    submitError,
  } = useAppSelector((state) => state.payment);

  const query = searchQuery.trim().toLowerCase();
  const rows = payments.filter((row) => {
    if (!query) {
      return true;
    }

    return (
      row.invoice.toLowerCase().includes(query) ||
      row.customer.toLowerCase().includes(query) ||
      row.method.toLowerCase().includes(query) ||
      row.status.toLowerCase().includes(query)
    );
  });

  const totalPaid = payments
    .filter((row) => row.status === 'Paid')
    .reduce((sum, row) => sum + row.amount, 0);

  const totalPending = payments
    .filter((row) => row.status === 'Pending')
    .reduce((sum, row) => sum + row.amount, 0);

  const totalFailed = payments
    .filter((row) => row.status === 'Failed')
    .reduce((sum, row) => sum + row.amount, 0);

  const pendingCount = payments.filter((row) => row.status === 'Pending').length;
  const failedCount = payments.filter((row) => row.status === 'Failed').length;

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    dispatch(updatePaymentFormField({ name, value }));
  };

  const handleCreatePayment = (event) => {
    event.preventDefault();
    dispatch(setPaymentSubmitError(''));

    if (!formData.invoice.trim() || !formData.customer.trim() || !formData.amount) {
      dispatch(setPaymentSubmitError('Invoice, customer, and amount are required.'));
      toast.error('Invoice, customer, and amount are required.');
      return;
    }

    dispatch(
      createPayment({
        id: `pay-${Date.now()}`,
        invoice: formData.invoice.trim(),
        customer: formData.customer.trim(),
        method: formData.method,
        amount: Number(formData.amount),
        status: 'Pending',
        date: formatToday(),
      }),
    );
  };

  const canPayNow = (row) => row.status === 'Pending';
  const canRetry = (row) => row.status === 'Failed';

  return (
    <>
      <section className="stats-grid stats-grid--compact">
        <StatCard
          title="Paid Amount"
          value={formatCurrency(totalPaid)}
          change={`${payments.filter((row) => row.status === 'Paid').length} completed`}
          trend="up"
          tone="green"
        />
        <StatCard
          title="Pending"
          value={formatCurrency(totalPending)}
          change={`${pendingCount} payment${pendingCount === 1 ? '' : 's'} waiting`}
          trend="down"
          tone="orange"
        />
        <StatCard
          title="Failed"
          value={formatCurrency(totalFailed)}
          change={`${failedCount} need${failedCount === 1 ? 's' : ''} retry`}
          trend="down"
          tone="purple"
        />
        <StatCard
          title="Total Payments"
          value={String(payments.length)}
          change="All transactions"
          trend="up"
          tone="blue"
        />
      </section>

      <section className="customers-panel">
        <div className="customers-panel__head">
          <div>
            <h2>Payments</h2>
            <p>Total {rows.length}</p>
          </div>
          <div className="customers-panel__actions">
            <button type="button" className="btn-filter">
              Filter
            </button>
            <button type="button" className="btn-primary" onClick={() => dispatch(openCreatePaymentModal())}>
              New Payment
            </button>
          </div>
        </div>

        <div className="table-wrap">
          <table className="customers-table">
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Customer</th>
                <th>Method</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>{row.invoice}</td>
                  <td>{row.customer}</td>
                  <td>{row.method}</td>
                  <td className="money">{formatCurrency(row.amount)}</td>
                  <td>
                    <span className={`status-pill status-pill--${row.status.toLowerCase()}`}>
                      {row.status}
                    </span>
                  </td>
                  <td>{row.date}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        type="button"
                        className="action-btn action-btn--view"
                        onClick={() => dispatch(openPaymentView(row))}
                      >
                        View
                      </button>
                      <button
                        type="button"
                        className="action-btn action-btn--buy"
                        onClick={() => dispatch(openPayModal({ payment: row, mode: 'pay' }))}
                        disabled={!canPayNow(row)}
                      >
                        Pay Now
                      </button>
                      <button
                        type="button"
                        className="action-btn action-btn--confirm"
                        onClick={() => dispatch(openPayModal({ payment: row, mode: 'retry' }))}
                        disabled={!canRetry(row)}
                      >
                        Retry
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {viewPayment && (
        <PaymentViewModal payment={viewPayment} onClose={() => dispatch(closePaymentView())} />
      )}

      {payPayment && (
        <PaymentPayModal
          payment={payPayment}
          title={payMode === 'retry' ? 'Retry Payment' : 'Pay Now'}
          confirmLabel={payMode === 'retry' ? 'Retry Payment' : 'Confirm Payment'}
          onClose={() => dispatch(closePayModal())}
          onConfirm={(payment, method) =>
            dispatch(completePayment({ id: payment.id, method, mode: payMode }))
          }
        />
      )}

      {showCreateModal && (
        <NewPaymentModal
          formData={formData}
          submitError={submitError}
          onClose={() => dispatch(closeCreatePaymentModal())}
          onChange={handleFormChange}
          onSubmit={handleCreatePayment}
        />
      )}
    </>
  );
}
