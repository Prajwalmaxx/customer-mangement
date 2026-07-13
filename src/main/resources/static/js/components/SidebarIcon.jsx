function SidebarIcon({ children, active = false, label }) {
  return (
    <button
      type="button"
      className={active ? 'sidebar-icon sidebar-icon--active' : 'sidebar-icon'}
      title={label}
    >
      {children}
    </button>
  );
}
