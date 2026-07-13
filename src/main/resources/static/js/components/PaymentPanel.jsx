const INITIAL_PAYMENT_ROWS = [
  { id: 'pay-201', invoice: 'INV-201', customer: 'Amazon', method: 'Card', amount: 21710, status: 'Paid', date: '12-03-2025' },
  { id: 'pay-202', invoice: 'INV-202', customer: 'Apple', method: 'UPI', amount: 6840, status: 'Pending', date: '10-03-2025' },
  { id: 'pay-203', invoice: 'INV-203', customer: 'Spotify', method: 'Net Banking', amount: 2460, status: 'Failed', date: '08-03-2025' },
  { id: 'pay-204', invoice: 'INV-204', customer: 'HP', method: 'Card', amount: 3850, status: 'Paid', date: '05-03-2025' },
];

const EMPTY_PAYMENT_FORM = {
  invoice: '',
  customer: '',
  method: 'Card',
  amount: '',
};

function createPaymentId() {
  return `pay-${Date.now()}`;
}

function createInvoiceNumber(payments) {
  const numbers = payments
    .map((payment) => Number(payment.invoice.replace('INV-', '')))
    .filter((value) => !Number.isNaN(value));
  const next = numbers.length ? Math.max(...numbers) + 1 : 205;
  return `INV-${next}`;
}

function PaymentPanel({ searchQuery }) {
  const [payments, setPayments] = React.useState(INITIAL_PAYMENT_ROWS);
  const [viewPayment, setViewPayment] = React.useState(null);
  const [payPayment, setPayPayment] = React.useState(null);
  const [payMode, setPayMode] = React.useState('pay');
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [formData, setFormData] = React.useState(EMPTY_PAYMENT_FORM);
  const [submitError, setSubmitError] = React.useState('');
  const [message, setMessage] = React.useState('');

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

  const updatePayment = (paymentId, updates) => {
    setPayments((prev) =>
      prev.map((row) => (row.id === paymentId ? { ...row, ...updates } : row)),
    );
  };

  const openCreateModal = () => {
    setFormData({
      ...EMPTY_PAYMENT_FORM,
      invoice: createInvoiceNumber(payments),
    });
    setSubmitError('');
    setShowCreateModal(true);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreatePayment = (event) => {
    event.preventDefault();
    setSubmitError('');

    if (!formData.invoice.trim() || !formData.customer.trim() || !formData.amount) {
      setSubmitError('Invoice, customer, and amount are required.');
      return;
    }

    const newPayment = {
      id: createPaymentId(),
      invoice: formData.invoice.trim(),
      customer: formData.customer.trim(),
      method: formData.method,
      amount: Number(formData.amount),
      status: 'Pending',
      date: formatToday(),
    };

    setPayments((prev) => [newPayment, ...prev]);
    setShowCreateModal(false);
    setMessage(`${newPayment.invoice} created successfully.`);
  };

  const handlePayNow = (row) => {
    setPayMode('pay');
    setPayPayment(row);
    setMessage('');
  };

  const handleRetry = (row) => {
    setPayMode('retry');
    setPayPayment(row);
    setMessage('');
  };

  const handlePayConfirm = (row, method) => {
    updatePayment(row.id, {
      status: 'Paid',
      method,
      date: formatToday(),
    });
    setPayPayment(null);
    setMessage(
      payMode === 'retry'
        ? `${row.invoice} payment retried and marked as Paid.`
        : `${row.invoice} paid successfully via ${method}.`,
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
            <button type="button" className="btn-primary" onClick={openCreateModal}>
              New Payment
            </button>
          </div>
        </div>

        {message && <div className="response-box admin-toast">{message}</div>}

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
                        onClick={() => setViewPayment(row)}
                      >
                        View
                      </button>
                      <button
                        type="button"
                        className="action-btn action-btn--buy"
                        onClick={() => handlePayNow(row)}
                        disabled={!canPayNow(row)}
                      >
                        Pay Now
                      </button>
                      <button
                        type="button"
                        className="action-btn action-btn--confirm"
                        onClick={() => handleRetry(row)}
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

      {viewPayment && <PaymentViewModal payment={viewPayment} onClose={() => setViewPayment(null)} />}

      {payPayment && (
        <PaymentPayModal
          payment={payPayment}
          title={payMode === 'retry' ? 'Retry Payment' : 'Pay Now'}
          confirmLabel={payMode === 'retry' ? 'Retry Payment' : 'Confirm Payment'}
          onClose={() => setPayPayment(null)}
          onConfirm={handlePayConfirm}
        />
      )}

      {showCreateModal && (
        <NewPaymentModal
          formData={formData}
          submitError={submitError}
          onClose={() => setShowCreateModal(false)}
          onChange={handleFormChange}
          onSubmit={handleCreatePayment}
        />
      )}
    </>
  );
}
