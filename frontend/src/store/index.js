import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import customerReducer from './customerSlice';
import orderReducer from './orderSlice';
import paymentReducer from './paymentSlice';
import uiReducer from './uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    customer: customerReducer,
    order: orderReducer,
    payment: paymentReducer,
    ui: uiReducer,
  },
});
