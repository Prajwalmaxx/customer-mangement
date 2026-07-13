function SidebarLink({ label, active, onClick, children }) {
  return (
    <button
      type="button"
      className={active ? 'sidebar-link sidebar-link--active' : 'sidebar-link'}
      onClick={onClick}
    >
      <span className="sidebar-link__icon">{children}</span>
      <span className="sidebar-link__label">{label}</span>
    </button>
  );
}

function Sidebar({ activeSection, onSectionChange }) {
  return (
    <aside className="admin-sidebar">
      <p className="sidebar-heading">Menu</p>
      <nav className="sidebar-nav">
        <SidebarLink
          label="All Customers"
          active={activeSection === 'customers'}
          onClick={() => onSectionChange('customers')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M17 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </SidebarLink>

        <SidebarLink
          label="Orders"
          active={activeSection === 'orders'}
          onClick={() => onSectionChange('orders')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M6 6h15l-1.5 9h-12z" />
            <circle cx="9" cy="20" r="1" />
            <circle cx="18" cy="20" r="1" />
          </svg>
        </SidebarLink>

        <SidebarLink
          label="Payment"
          active={activeSection === 'payment'}
          onClick={() => onSectionChange('payment')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <path d="M2 10h20" />
          </svg>
        </SidebarLink>
      </nav>
    </aside>
  );
}
