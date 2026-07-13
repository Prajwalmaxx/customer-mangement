import {
  REMEMBER_EMAIL_KEY,
  REMEMBER_FLAG_KEY,
  SESSION_COOKIE_KEY,
  TOKEN_STORAGE_KEY,
  USER_STORAGE_KEY,
} from '../constants';

export function getToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function removeToken() {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || 'null');
  } catch {
    return null;
  }
}

export function setStoredUser(user) {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
}

export function removeStoredUser() {
  localStorage.removeItem(USER_STORAGE_KEY);
}

export function getRememberEmail() {
  return localStorage.getItem(REMEMBER_EMAIL_KEY) || '';
}

export function setRememberEmail(email) {
  localStorage.setItem(REMEMBER_EMAIL_KEY, email);
}

export function clearRememberEmail() {
  localStorage.removeItem(REMEMBER_EMAIL_KEY);
}

export function isRememberMeEnabled() {
  return localStorage.getItem(REMEMBER_FLAG_KEY) === 'true';
}

export function setRememberMeEnabled(enabled) {
  localStorage.setItem(REMEMBER_FLAG_KEY, enabled ? 'true' : 'false');
}

export function setSessionCookie() {
  localStorage.setItem(SESSION_COOKIE_KEY, 'active');
}

export function clearSessionCookie() {
  localStorage.removeItem(SESSION_COOKIE_KEY);
}

export function hasSessionCookie() {
  return localStorage.getItem(SESSION_COOKIE_KEY) === 'active';
}

export function clearAuthStorage() {
  removeToken();
  removeStoredUser();
  clearSessionCookie();
}
