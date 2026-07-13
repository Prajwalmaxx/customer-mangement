import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';

const INITIAL_ORDER_ROWS = [
  { id: 'ord-101', orderNo: 'ORD-101', customer: 'Amazon', amount: 21710, status: 'Completed', date: '12-03-2025' },
  { id: 'ord-102', orderNo: 'ORD-102', customer: 'Apple', amount: 6840, status: 'Pending', date: '10-03-2025' },
  { id: 'ord-103', orderNo: 'ORD-103', customer: 'Spotify', amount: 2460, status: 'Processing', date: '08-03-2025' },
  { id: 'ord-104', orderNo: 'ORD-104', customer: 'HP', amount: 3850, status: 'Completed', date: '05-03-2025' },
];

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    orders: INITIAL_ORDER_ROWS,
    buyOrder: null,
  },
  reducers: {
    openBuyModal(state, action) {
      state.buyOrder = action.payload;
    },
    closeBuyModal(state) {
      state.buyOrder = null;
    },
    markOrderProcessing(state, action) {
      const order = state.orders.find((row) => row.id === action.payload.id);
      if (order) {
        order.status = 'Processing';
        toast.success(`${order.orderNo} purchased successfully. Status: Processing.`);
      }
      state.buyOrder = null;
    },
    confirmOrder(state, action) {
      const order = state.orders.find((row) => row.id === action.payload.id);
      if (order) {
        order.status = 'Completed';
        toast.success(`${order.orderNo} confirmed successfully.`);
      }
    },
  },
});

export const { openBuyModal, closeBuyModal, markOrderProcessing, confirmOrder } = orderSlice.actions;

export default orderSlice.reducer;
