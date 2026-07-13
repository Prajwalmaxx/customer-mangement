const INITIAL_ORDER_ROWS = [
  { id: 'ord-101', orderNo: 'ORD-101', customer: 'Amazon', amount: 21710, status: 'Completed', date: '12-03-2025' },
  { id: 'ord-102', orderNo: 'ORD-102', customer: 'Apple', amount: 6840, status: 'Pending', date: '10-03-2025' },
  { id: 'ord-103', orderNo: 'ORD-103', customer: 'Spotify', amount: 2460, status: 'Processing', date: '08-03-2025' },
  { id: 'ord-104', orderNo: 'ORD-104', customer: 'HP', amount: 3850, status: 'Completed', date: '05-03-2025' },
];

function OrdersPanel({ searchQuery }) {
  const [orders, setOrders] = React.useState(INITIAL_ORDER_ROWS);
  const [buyOrder, setBuyOrder] = React.useState(null);
  const [message, setMessage] = React.useState('');

  const query = searchQuery.trim().toLowerCase();
  const rows = orders.filter((row) => {
    if (!query) {
      return true;
    }

    return (
      row.orderNo.toLowerCase().includes(query) ||
      row.customer.toLowerCase().includes(query) ||
      row.status.toLowerCase().includes(query)
    );
  });

  const updateOrderStatus = (orderId, status) => {
    setOrders((prev) => prev.map((row) => (row.id === orderId ? { ...row, status } : row)));
  };

  const handleBuyClick = (row) => {
    if (row.status === 'Completed') {
      setMessage(`${row.orderNo} is already completed.`);
      return;
    }

    if (row.status === 'Processing') {
      setMessage(`${row.orderNo} is already being processed.`);
      return;
    }

    setBuyOrder(row);
    setMessage('');
  };

  const handleBuyConfirm = (row) => {
    updateOrderStatus(row.id, 'Processing');
    setBuyOrder(null);
    setMessage(`${row.orderNo} purchased successfully. Status: Processing.`);
  };

  const handleConfirmOrder = (row) => {
    if (row.status === 'Completed') {
      setMessage(`${row.orderNo} is already confirmed.`);
      return;
    }

    const confirmed = window.confirm(`Confirm order ${row.orderNo} for ${row.customer}?`);
    if (!confirmed) {
      return;
    }

    updateOrderStatus(row.id, 'Completed');
    setMessage(`${row.orderNo} confirmed successfully.`);
  };

  const canBuy = (row) => row.status === 'Pending';
  const canConfirm = (row) => row.status === 'Pending' || row.status === 'Processing';

  return (
    <section className="customers-panel">
      <div className="customers-panel__head">
        <div>
          <h2>Orders</h2>
          <p>Total {rows.length}</p>
        </div>
      </div>

      {message && <div className="response-box admin-toast">{message}</div>}

      <div className="table-wrap">
        <table className="customers-table">
          <thead>
            <tr>
              <th>Order No</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.orderNo}</td>
                <td>{row.customer}</td>
                <td className="money">{formatCurrency(row.amount)}</td>
                <td>
                  <span className={`status-pill status-pill--${row.status.toLowerCase()}`}>{row.status}</span>
                </td>
                <td>{row.date}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      type="button"
                      className="action-btn action-btn--buy"
                      onClick={() => handleBuyClick(row)}
                      disabled={!canBuy(row)}
                    >
                      Buy
                    </button>
                    <button
                      type="button"
                      className="action-btn action-btn--confirm"
                      onClick={() => handleConfirmOrder(row)}
                      disabled={!canConfirm(row)}
                    >
                      Confirm Order
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {buyOrder && (
        <OrderBuyModal order={buyOrder} onClose={() => setBuyOrder(null)} onConfirm={handleBuyConfirm} />
      )}
    </section>
  );
}
