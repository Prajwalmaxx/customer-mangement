function App() {
  const [token, setToken] = React.useState(() => localStorage.getItem(TOKEN_STORAGE_KEY));
  const [user, setUser] = React.useState(() => readStoredUser());

  const handleAuthenticated = (payload) => {
    const nextToken = payload?.token ?? null;
    const nextUser = payload?.user ?? null;

    setToken(nextToken);
    setUser(nextUser);

    if (nextToken) {
      localStorage.setItem(TOKEN_STORAGE_KEY, nextToken);
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }

    if (nextUser) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  };

  const handleLogout = () => {
    clearAuthSession();
    handleAuthenticated({});
  };

  if (!token) {
    return <AuthScreen onAuthenticated={handleAuthenticated} />;
  }

  return <Dashboard user={user} onLogout={handleLogout} />;
}
