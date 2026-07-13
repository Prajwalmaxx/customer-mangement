import React from 'react';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import {
  closeBuyModal,
  confirmOrder,
  markOrderProcessing,
  openBuyModal,
} from '../store/orderSlice';
import { formatCurrency } from '../utils/format';
import OrderBuyModal from './OrderBuyModal';

export default function OrdersPanel({ searchQuery }) {
  const dispatch = useAppDispatch();
  const { orders, buyOrder } = useAppSelector((state) => state.order);

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

  const handleBuyClick = (row) => {
    if (row.status === 'Completed') {
      toast.error(`${row.orderNo} is already completed.`);
      return;
    }

    if (row.status === 'Processing') {
      toast.error(`${row.orderNo} is already being processed.`);
      return;
    }

    dispatch(openBuyModal(row));
  };

  const handleConfirmOrder = (row) => {
    if (row.status === 'Completed') {
      toast.error(`${row.orderNo} is already confirmed.`);
      return;
    }

    const confirmed = window.confirm(`Confirm order ${row.orderNo} for ${row.customer}?`);
    if (!confirmed) {
      return;
    }

    dispatch(confirmOrder(row));
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
        <OrderBuyModal
          order={buyOrder}
          onClose={() => dispatch(closeBuyModal())}
          onConfirm={(order) => dispatch(markOrderProcessing(order))}
        />
      )}
    </section>
  );
}
