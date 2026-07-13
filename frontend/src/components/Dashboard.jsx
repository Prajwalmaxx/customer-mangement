import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import { CUSTOMER_ROWS } from '../data/customerRows';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import {
  closeModal,
  createCustomerRecord,
  deleteCustomerRecord,
  hideSampleRow,
  loadCustomerData,
  openCreateModal,
  openUpdateModal,
  openViewModal,
  updateCustomerRecord,
  updateFormField,
} from '../store/customerSlice';
import { setActiveSection, setSearchQuery } from '../store/uiSlice';
import { customerSchema, validateYup } from '../validation/customerSchemas';
import { customerToFormData, customerToRow, sampleRowToViewRow } from '../utils/customerUtils';
import { formDataToCustomerPayload } from '../utils/customerPayload';
import CustomerViewModal from './CustomerViewModal';
import CustomersTable from './CustomersTable';
import Navbar from './Navbar';
import OrdersPanel from './OrdersPanel';
import PaymentPanel from './PaymentPanel';
import RegisterCustomerModal from './RegisterCustomerModal';
import Sidebar from './Sidebar';
import StatsGrid from './StatsGrid';

export default function Dashboard({ user, onLogout }) {
  const dispatch = useAppDispatch();
  const { activeSection, searchQuery } = useAppSelector((state) => state.ui);
  const {
    liveCustomer,
    registeredCustomers,
    hiddenRowIds,
    loading,
    modalMode,
    selectedRow,
    formData,
    submitError,
  } = useAppSelector((state) => state.customer);

  useEffect(() => {
    dispatch(loadCustomerData());
  }, [dispatch]);

  const liveRow = liveCustomer ? customerToRow(liveCustomer, 0, 'live') : null;
  const registeredRows = registeredCustomers.map((item, index) => customerToRow(item, index, 'registered'));
  const allRows = [
    ...registeredRows,
    ...(liveRow ? [liveRow] : []),
    ...CUSTOMER_ROWS.map(sampleRowToViewRow).filter(
      (row) =>
        !registeredRows.some((registered) => registered.company === row.company) &&
        (!liveRow || liveRow.company !== row.company),
    ),
  ].filter((row) => !hiddenRowIds.includes(row.id));

  const filteredRows = allRows.filter((row) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return true;
    }

    return (
      row.company.toLowerCase().includes(query) ||
      row.email.toLowerCase().includes(query) ||
      row.userName.toLowerCase().includes(query) ||
      row.notes.toLowerCase().includes(query)
    );
  });

  const totalOutstanding = allRows.reduce((sum, row) => sum + Number(row.outstanding || 0), 0);

  const handleChange = (event) => {
    const { name, value } = event.target;
    dispatch(updateFormField({ name, value }));
  };

  const handleUpdate = (row) => {
    if (row.source !== 'registered' || !row.rawCustomer) {
      toast.error('Only registered customers can be updated.');
      return;
    }
    dispatch(openUpdateModal(row));
  };

  const handleDelete = async (row) => {
    const confirmed = window.confirm(`Delete ${row.company}?`);
    if (!confirmed) {
      return;
    }

    if (row.source === 'registered' && row.cno != null) {
      dispatch(deleteCustomerRecord({ cno: row.cno, company: row.company }));
      return;
    }

    dispatch(hideSampleRow(row.id));
    toast.success(`${row.company} removed from the dashboard.`);
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    const validationError = await validateYup(customerSchema, formData);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    dispatch(createCustomerRecord(formDataToCustomerPayload(formData)));
    dispatch(setActiveSection('customers'));
  };

  const handleUpdateSubmit = async (event) => {
    event.preventDefault();

    if (!selectedRow?.cno) {
      toast.error('Customer number is required for update.');
      return;
    }

    const validationError = await validateYup(customerSchema, formData);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    dispatch(
      updateCustomerRecord({
        cno: selectedRow.cno,
        formData: formDataToCustomerPayload(formData),
      }),
    );
  };

  return (
    <div className="admin-shell">
      <Navbar
        user={user}
        searchQuery={searchQuery}
        onSearchChange={(value) => dispatch(setSearchQuery(value))}
        onLogout={onLogout}
      />

      <div className="admin-body">
        <Sidebar
          activeSection={activeSection}
          onSectionChange={(section) => dispatch(setActiveSection(section))}
        />

        <main className="admin-main">
          {activeSection === 'customers' && (
            <>
              <div className="section-heading">
                <h2>All Customers</h2>
                <p>Manage customer records and outstanding balances.</p>
              </div>

              <StatsGrid totalOutstanding={totalOutstanding} />

              <CustomersTable
                rows={filteredRows}
                loading={loading}
                totalCount={allRows.length}
                onOpenRegister={() => dispatch(openCreateModal())}
                onView={(row) => dispatch(openViewModal(row))}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            </>
          )}

          {activeSection === 'orders' && (
            <>
              <div className="section-heading">
                <h2>Orders</h2>
                <p>Track customer orders and fulfillment status.</p>
              </div>
              <OrdersPanel searchQuery={searchQuery} />
            </>
          )}

          {activeSection === 'payment' && (
            <>
              <div className="section-heading">
                <h2>Payment</h2>
                <p>Review invoices, payment methods, and transaction status.</p>
              </div>
              <PaymentPanel searchQuery={searchQuery} />
            </>
          )}

          {modalMode === 'view' && (
            <CustomerViewModal row={selectedRow} onClose={() => dispatch(closeModal())} />
          )}

          {modalMode === 'create' && (
            <RegisterCustomerModal
              title="Register Customer"
              submitLabel="Submit"
              formData={formData}
              submitError={submitError}
              onClose={() => dispatch(closeModal())}
              onChange={handleChange}
              onSubmit={handleCreate}
            />
          )}

          {modalMode === 'update' && (
            <RegisterCustomerModal
              title="Update Customer"
              submitLabel="Update"
              formData={formData}
              submitError={submitError}
              onClose={() => dispatch(closeModal())}
              onChange={handleChange}
              onSubmit={handleUpdateSubmit}
            />
          )}
        </main>
      </div>
    </div>
  );
}
