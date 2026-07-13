function LoginForm({ loginForm, setLoginForm, remember, setRemember, isSubmitting, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="login-form">
      <label className="login-field">
        <span className="login-field__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </span>
        <input
          type="email"
          placeholder="ID"
          autoComplete="email"
          value={loginForm.email}
          onChange={(event) => setLoginForm((prev) => ({ ...prev, email: event.target.value }))}
        />
      </label>

      <label className="login-field">
        <span className="login-field__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </span>
        <input
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          value={loginForm.password}
          onChange={(event) => setLoginForm((prev) => ({ ...prev, password: event.target.value }))}
        />
      </label>

      <div className="login-options">
        <label className="login-remember">
          <input
            type="checkbox"
            checked={remember}
            onChange={(event) => setRemember(event.target.checked)}
          />
          <span>Remember me</span>
        </label>
        <a href="#forgot" className="login-forgot" onClick={(event) => event.preventDefault()}>
          Forgot Password?
        </a>
      </div>

      <button type="submit" className="login-submit" disabled={isSubmitting}>
        {isSubmitting ? 'SUBMITTING...' : 'SUBMIT'}
      </button>
    </form>
  );
}
