import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import {
  checkSignupEmail,
  clearAuthError,
  clearEmailStatus,
  loginUser,
  registerUser,
  setRemember,
} from '../store/authSlice';
import { loginSchema, signupSchema, validateYup } from '../validation/authSchemas';
import * as yup from 'yup';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

export default function AuthScreen() {
  const dispatch = useAppDispatch();
  const { loading, error, remember, rememberedEmail, emailStatus } = useAppSelector((state) => state.auth);
  const [mode, setMode] = useState('login');
  const [loginForm, setLoginForm] = useState({
    email: rememberedEmail,
    password: '',
  });
  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleLogin = async (event) => {
    event.preventDefault();
    dispatch(clearAuthError());

    const validationError = await validateYup(loginSchema, loginForm);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    dispatch(
      loginUser({
        email: loginForm.email.trim(),
        password: loginForm.password,
        remember,
      }),
    );
  };

  const handleSignupEmailBlur = async () => {
    const email = signupForm.email.trim();
    if (!email) {
      dispatch(clearEmailStatus());
      return;
    }

    const validationError = await validateYup(
      yup.object({ email: yup.string().trim().required('Email is required.').email('Enter a valid email address.') }),
      { email },
    );
    if (validationError) {
      toast.error(validationError);
      return;
    }

    dispatch(checkSignupEmail(email));
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    dispatch(clearAuthError());

    const validationError = await validateYup(signupSchema, signupForm);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    if (emailStatus?.exists) {
      toast.error(emailStatus.message);
      return;
    }

    dispatch(registerUser(signupForm));
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    dispatch(clearAuthError());
    dispatch(clearEmailStatus());
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
            setRemember={(value) => dispatch(setRemember(value))}
            isSubmitting={loading}
            onSubmit={handleLogin}
          />
        ) : (
          <SignupForm
            signupForm={signupForm}
            setSignupForm={setSignupForm}
            isSubmitting={loading}
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
