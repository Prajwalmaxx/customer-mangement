import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import { formatToday } from '../utils/format';

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

function createInvoiceNumber(payments) {
  const numbers = payments
    .map((payment) => Number(payment.invoice.replace('INV-', '')))
    .filter((value) => !Number.isNaN(value));
  const next = numbers.length ? Math.max(...numbers) + 1 : 205;
  return `INV-${next}`;
}

const paymentSlice = createSlice({
  name: 'payment',
  initialState: {
    payments: INITIAL_PAYMENT_ROWS,
    viewPayment: null,
    payPayment: null,
    payMode: 'pay',
    showCreateModal: false,
    formData: EMPTY_PAYMENT_FORM,
    submitError: '',
  },
  reducers: {
    openPaymentView(state, action) {
      state.viewPayment = action.payload;
    },
    closePaymentView(state) {
      state.viewPayment = null;
    },
    openPayModal(state, action) {
      state.payPayment = action.payload.payment;
      state.payMode = action.payload.mode;
    },
    closePayModal(state) {
      state.payPayment = null;
    },
    openCreatePaymentModal(state) {
      state.showCreateModal = true;
      state.formData = {
        ...EMPTY_PAYMENT_FORM,
        invoice: createInvoiceNumber(state.payments),
      };
      state.submitError = '';
    },
    closeCreatePaymentModal(state) {
      state.showCreateModal = false;
      state.submitError = '';
    },
    updatePaymentFormField(state, action) {
      const { name, value } = action.payload;
      state.formData[name] = value;
    },
    createPayment(state, action) {
      state.payments.unshift(action.payload);
      state.showCreateModal = false;
      toast.success(`${action.payload.invoice} created successfully.`);
    },
    setPaymentSubmitError(state, action) {
      state.submitError = action.payload;
    },
    completePayment(state, action) {
      const { id, method, mode } = action.payload;
      const payment = state.payments.find((row) => row.id === id);
      if (payment) {
        payment.status = 'Paid';
        payment.method = method;
        payment.date = formatToday();
        toast.success(
          mode === 'retry'
            ? `${payment.invoice} payment retried and marked as Paid.`
            : `${payment.invoice} paid successfully via ${method}.`,
        );
      }
      state.payPayment = null;
    },
  },
});

export const {
  openPaymentView,
  closePaymentView,
  openPayModal,
  closePayModal,
  openCreatePaymentModal,
  closeCreatePaymentModal,
  updatePaymentFormField,
  createPayment,
  setPaymentSubmitError,
  completePayment,
} = paymentSlice.actions;

export default paymentSlice.reducer;
