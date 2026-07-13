import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import { getApiErrorMessage } from '../api/errorUtils';
import {
  createCustomer,
  deleteCustomer,
  fetchCustomers,
  fetchReportCustomer,
  updateCustomer,
} from '../api/customerApi';
import { customerToFormData } from '../utils/customerUtils';

export const loadCustomerData = createAsyncThunk('customer/load', async (_, { rejectWithValue }) => {
  try {
    const [liveCustomer, registeredCustomers] = await Promise.all([
      fetchReportCustomer(),
      fetchCustomers(),
    ]);
    return { liveCustomer, registeredCustomers };
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, 'Failed to load customers.'));
    }
});

export const createCustomerRecord = createAsyncThunk(
  'customer/create',
  async (formData, { rejectWithValue }) => {
    try {
      return await createCustomer(formData);
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, 'Could not register customer.'));
    }
  },
);

export const updateCustomerRecord = createAsyncThunk(
  'customer/update',
  async ({ cno, formData }, { rejectWithValue }) => {
    try {
      return await updateCustomer(cno, formData);
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, 'Could not update customer.'));
    }
  },
);

export const deleteCustomerRecord = createAsyncThunk(
  'customer/delete',
  async ({ cno, company }, { rejectWithValue }) => {
    try {
      await deleteCustomer(cno);
      return { cno, company };
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, 'Could not delete customer.'));
    }
  },
);

const customerSlice = createSlice({
  name: 'customer',
  initialState: {
    liveCustomer: null,
    registeredCustomers: [],
    hiddenRowIds: [],
    loading: true,
    modalMode: null,
    selectedRow: null,
    formData: customerToFormData(),
    submitError: '',
  },
  reducers: {
    openCreateModal(state) {
      state.modalMode = 'create';
      state.selectedRow = null;
      state.formData = customerToFormData();
      state.submitError = '';
    },
    openViewModal(state, action) {
      state.modalMode = 'view';
      state.selectedRow = action.payload;
    },
    openUpdateModal(state, action) {
      state.modalMode = 'update';
      state.selectedRow = action.payload;
      state.formData = customerToFormData(action.payload.rawCustomer);
      state.submitError = '';
    },
    closeModal(state) {
      state.modalMode = null;
      state.selectedRow = null;
      state.submitError = '';
    },
    setFormData(state, action) {
      state.formData = action.payload;
    },
    updateFormField(state, action) {
      const { name, value } = action.payload;
      state.formData[name] = value;
    },
    hideSampleRow(state, action) {
      state.hiddenRowIds.push(action.payload);
    },
    clearSubmitError(state) {
      state.submitError = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCustomerData.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadCustomerData.fulfilled, (state, action) => {
        state.loading = false;
        state.liveCustomer = action.payload.liveCustomer;
        state.registeredCustomers = action.payload.registeredCustomers;
      })
      .addCase(loadCustomerData.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload);
      })
      .addCase(createCustomerRecord.fulfilled, (state, action) => {
        state.registeredCustomers.unshift(action.payload);
        state.modalMode = null;
        state.formData = customerToFormData();
        toast.success(`${action.payload.cname ?? 'Customer'} added to the list.`);
      })
      .addCase(createCustomerRecord.rejected, (state, action) => {
        state.submitError = action.payload;
        toast.error(action.payload);
      })
      .addCase(updateCustomerRecord.fulfilled, (state, action) => {
        state.registeredCustomers = state.registeredCustomers.map((item) =>
          item.cno === action.payload.cno ? action.payload : item,
        );
        state.modalMode = null;
        toast.success(`${action.payload.cname ?? 'Customer'} updated successfully.`);
      })
      .addCase(updateCustomerRecord.rejected, (state, action) => {
        state.submitError = action.payload;
        toast.error(action.payload);
      })
      .addCase(deleteCustomerRecord.fulfilled, (state, action) => {
        state.registeredCustomers = state.registeredCustomers.filter(
          (item) => item.cno !== action.payload.cno,
        );
        toast.success(`${action.payload.company} deleted successfully.`);
      })
      .addCase(deleteCustomerRecord.rejected, (_, action) => {
        toast.error(action.payload);
      });
  },
});

export const {
  openCreateModal,
  openViewModal,
  openUpdateModal,
  closeModal,
  setFormData,
  updateFormField,
  hideSampleRow,
  clearSubmitError,
} = customerSlice.actions;

export default customerSlice.reducer;
