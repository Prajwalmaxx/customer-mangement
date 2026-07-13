function Navbar({ user, searchQuery, onSearchChange, onLogout }) {
  const displayName = user?.name ?? user?.email ?? 'Admin';
  const email = user?.email ?? 'admin@customerdata.com';
  const initials = displayName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="admin-navbar">
      <div className="navbar-brand">
        <span className="navbar-logo">CD</span>
        <div>
          <p className="navbar-eyebrow">Dashboard</p>
          <h1 className="navbar-title">Customer Data manipulation</h1>
        </div>
      </div>

      <label className="admin-search navbar-search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
        <input
          type="search"
          placeholder="Search customers, orders, or payments"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </label>

      <div className="navbar-profile">
        <div className="profile-avatar">{initials}</div>
        <div className="profile-info">
          <strong>{displayName}</strong>
          <small>{email}</small>
        </div>
        <button type="button" className="admin-logout" onClick={onLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}
