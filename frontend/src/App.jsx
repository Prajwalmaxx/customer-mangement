import React from 'react';
import { useAppDispatch, useAppSelector } from './hooks/redux';
import { logout } from './store/authSlice';
import AuthScreen from './components/AuthScreen';
import Dashboard from './components/Dashboard';

export default function App() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  return <Dashboard user={user} onLogout={() => dispatch(logout())} />;
}
