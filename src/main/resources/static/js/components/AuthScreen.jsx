function AuthScreen({ onAuthenticated }) {
  const [mode, setMode] = React.useState('login');
  const [error, setError] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [remember, setRemember] = React.useState(false);
  const [emailStatus, setEmailStatus] = React.useState(null);
  const [loginForm, setLoginForm] = React.useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = React.useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');

    const emailError = validateEmail(loginForm.email);
    if (emailError) {
      setError(emailError);
      return;
    }

    const passwordError = validatePassword(loginForm.password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = await sendAuthRequest('/api/auth/login', {
        email: loginForm.email.trim(),
        password: loginForm.password,
      });
      onAuthenticated(payload);
    } catch (authError) {
      setError(authError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignupEmailBlur = async () => {
    const email = signupForm.email.trim();
    if (!email) {
      setEmailStatus(null);
      return;
    }

    const emailError = validateEmail(email);
    if (emailError) {
      setEmailStatus({ tone: 'error', message: emailError, exists: false });
      return;
    }

    try {
      const result = await checkEmailAvailability(email);
      setEmailStatus({
        tone: result.exists ? 'error' : 'success',
        message: result.message,
        exists: result.exists,
      });
    } catch (checkError) {
      setEmailStatus({ tone: 'error', message: checkError.message, exists: false });
    }
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    setError('');

    if (!signupForm.name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    const emailError = validateEmail(signupForm.email);
    if (emailError) {
      setError(emailError);
      return;
    }

    const passwordError = validatePassword(signupForm.password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (signupForm.password !== signupForm.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setIsSubmitting(true);
      const availability = await checkEmailAvailability(signupForm.email.trim());
      if (availability.exists) {
        setEmailStatus({
          tone: 'error',
          message: availability.message,
          exists: true,
        });
        setError(availability.message);
        return;
      }

      const payload = await sendAuthRequest('/api/auth/register', {
        name: signupForm.name.trim(),
        email: signupForm.email.trim(),
        password: signupForm.password,
      });
      onAuthenticated(payload);
    } catch (authError) {
      setError(authError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setError('');
    setEmailStatus(null);
  };

  return (
    <div className="login-page">
      <div className="login-page__bg" aria-hidden="true" />

      <div className="login-glass">
        <p className="login-brand">Customer Data manipulation</p>
        <h1 className="login-title">{mode === 'login' ? 'Login Account' : 'Create Account'}</h1>

        {error && <div className="login-error">{error}</div>}

        {mode === 'login' ? (
          <LoginForm
            loginForm={loginForm}
            setLoginForm={setLoginForm}
            remember={remember}
            setRemember={setRemember}
            isSubmitting={isSubmitting}
            onSubmit={handleLogin}
          />
        ) : (
          <SignupForm
            signupForm={signupForm}
            setSignupForm={setSignupForm}
            isSubmitting={isSubmitting}
            emailStatus={emailStatus}
            onEmailBlur={handleSignupEmailBlur}
            onSubmit={handleSignup}
          />
        )}

        <p className="login-switch">
          {mode === 'login' ? (
            <>
              New user?{' '}
              <button type="button" className="login-switch__btn" onClick={() => switchMode('signup')}>
                Sign up
              </button>
            </>
          ) : (
            <>
              Already registered?{' '}
              <button type="button" className="login-switch__btn" onClick={() => switchMode('login')}>
                Log in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
