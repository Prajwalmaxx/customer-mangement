function SignupForm({ signupForm, setSignupForm, isSubmitting, emailStatus, onEmailBlur, onSubmit }) {
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
          type="text"
          placeholder="Full name"
          autoComplete="name"
          value={signupForm.name}
          onChange={(event) => setSignupForm((prev) => ({ ...prev, name: event.target.value }))}
        />
      </label>

      <label className="login-field">
        <span className="login-field__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4h16v16H4z" />
            <path d="M8 8h8M8 12h8M8 16h5" />
          </svg>
        </span>
        <input
          type="email"
          placeholder="ID"
          autoComplete="email"
          value={signupForm.email}
          onChange={(event) => setSignupForm((prev) => ({ ...prev, email: event.target.value }))}
          onBlur={onEmailBlur}
        />
      </label>
      {emailStatus && (
        <p className={`field-hint field-hint--${emailStatus.tone}`}>{emailStatus.message}</p>
      )}

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
          autoComplete="new-password"
          value={signupForm.password}
          onChange={(event) => setSignupForm((prev) => ({ ...prev, password: event.target.value }))}
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
          placeholder="Confirm password"
          autoComplete="new-password"
          value={signupForm.confirmPassword}
          onChange={(event) =>
            setSignupForm((prev) => ({ ...prev, confirmPassword: event.target.value }))
          }
        />
      </label>

      <button type="submit" className="login-submit" disabled={isSubmitting || emailStatus?.exists}>
        {isSubmitting ? 'SUBMITTING...' : 'SUBMIT'}
      </button>
    </form>
  );
}
