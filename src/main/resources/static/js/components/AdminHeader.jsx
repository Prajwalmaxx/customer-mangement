function AdminHeader({ user, searchQuery, onSearchChange, onLogout }) {
  return (
    <header className="admin-header">
      <div>
        <h1>Customers</h1>
        <p className="admin-subtitle">Customer Data manipulation</p>
      </div>
      <label className="admin-search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
        <input
          type="search"
          placeholder="Search investor or task name"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </label>
      <div className="admin-user">
        <span>{user?.name ?? user?.email ?? 'Admin'}</span>
        <button type="button" className="admin-logout" onClick={onLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}
