function Dashboard({ user, onLogout }) {
  const [activeSection, setActiveSection] = React.useState('customers');
  const [customer, setCustomer] = React.useState(null);
  const [registeredCustomers, setRegisteredCustomers] = React.useState([]);
  const [hiddenRowIds, setHiddenRowIds] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [modalMode, setModalMode] = React.useState(null);
  const [selectedRow, setSelectedRow] = React.useState(null);
  const [formData, setFormData] = React.useState(customerToFormData());
  const [responseMessage, setResponseMessage] = React.useState('');
  const [submitError, setSubmitError] = React.useState('');

  const loadCustomers = () =>
    authenticatedFetch('/customers')
      .then((res) => (res.ok ? res.json() : []))
      .catch(() => []);

  React.useEffect(() => {
    Promise.all([
      authenticatedFetch('/report1').then((res) => res.json()),
      loadCustomers(),
    ])
      .then(([reportCustomer, savedCustomers]) => {
        setCustomer(reportCustomer);
        setRegisteredCustomers(Array.isArray(savedCustomers) ? savedCustomers : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const liveRow = customer
    ? customerToRow(customer, 0, 'live')
    : null;

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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedRow(null);
    setSubmitError('');
  };

  const openRegisterModal = () => {
    setSelectedRow(null);
    setFormData(customerToFormData());
    setModalMode('create');
    setSubmitError('');
    setResponseMessage('');
  };

  const handleView = (row) => {
    setSelectedRow(row);
    setModalMode('view');
  };

  const handleUpdate = (row) => {
    if (row.source !== 'registered' || !row.rawCustomer) {
      setResponseMessage('Only registered customers can be updated.');
      return;
    }

    setSelectedRow(row);
    setFormData(customerToFormData(row.rawCustomer));
    setModalMode('update');
    setSubmitError('');
  };

  const handleDelete = async (row) => {
    const confirmed = window.confirm(`Delete ${row.company}?`);
    if (!confirmed) {
      return;
    }

    if (row.source === 'registered' && row.cno != null) {
      try {
        const result = await authenticatedFetch(`/customers/${row.cno}`, { method: 'DELETE' });
        if (!result.ok && result.status !== 204) {
          throw new Error('Could not delete customer.');
        }
        setRegisteredCustomers((prev) => prev.filter((item) => item.cno !== row.cno));
        setResponseMessage(`${row.company} deleted successfully.`);
      } catch (error) {
        setResponseMessage(error.message);
      }
      return;
    }

    setHiddenRowIds((prev) => [...prev, row.id]);
    setResponseMessage(`${row.company} removed from the dashboard.`);
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    setSubmitError('');
    setResponseMessage('');

    const payload = formDataToCustomerPayload(formData);

    try {
      const result = await authenticatedFetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!result.ok) {
        throw new Error('Could not register customer. Please check the form values.');
      }

      const savedCustomer = await result.json();
      setRegisteredCustomers((prev) => [savedCustomer, ...prev]);
      setResponseMessage(`${savedCustomer.cname ?? 'Customer'} added to the list.`);
      closeModal();
      setActiveSection('customers');
    } catch (error) {
      setSubmitError(error.message);
    }
  };

  const handleUpdateSubmit = async (event) => {
    event.preventDefault();
    setSubmitError('');
    setResponseMessage('');

    if (!selectedRow?.cno) {
      setSubmitError('Customer number is required for update.');
      return;
    }

    const payload = formDataToCustomerPayload(formData);

    try {
      const result = await authenticatedFetch(`/customers/${selectedRow.cno}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!result.ok) {
        throw new Error('Could not update customer.');
      }

      const updatedCustomer = await result.json();
      setRegisteredCustomers((prev) =>
        prev.map((item) => (item.cno === updatedCustomer.cno ? updatedCustomer : item)),
      );
      setResponseMessage(`${updatedCustomer.cname ?? 'Customer'} updated successfully.`);
      closeModal();
    } catch (error) {
      setSubmitError(error.message);
    }
  };

  return (
    <div className="admin-shell">
      <Navbar
        user={user}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onLogout={onLogout}
      />

      <div className="admin-body">
        <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />

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
                onOpenRegister={openRegisterModal}
                onView={handleView}
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

          {responseMessage && !modalMode && (
            <div className="response-box admin-toast">{responseMessage}</div>
          )}

          {modalMode === 'view' && (
            <CustomerViewModal row={selectedRow} onClose={closeModal} />
          )}

          {modalMode === 'create' && (
            <RegisterCustomerModal
              title="Register Customer"
              submitLabel="Submit"
              formData={formData}
              submitError={submitError}
              responseMessage={responseMessage}
              onClose={closeModal}
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
              responseMessage={responseMessage}
              onClose={closeModal}
              onChange={handleChange}
              onSubmit={handleUpdateSubmit}
            />
          )}
        </main>
      </div>
    </div>
  );
}
