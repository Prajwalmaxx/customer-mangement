function isValidEmail(email) {
  return /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(String(email || '').trim());
}

function validatePassword(password) {
  if (!password) {
    return 'Password is required.';
  }
  if (password.length < 8) {
    return 'Password must be at least 8 characters.';
  }
  if (!/[A-Za-z]/.test(password)) {
    return 'Password must contain at least one letter.';
  }
  if (!/\d/.test(password)) {
    return 'Password must contain at least one number.';
  }
  return null;
}

function validateEmail(email) {
  if (!String(email || '').trim()) {
    return 'Email is required.';
  }
  if (!isValidEmail(email)) {
    return 'Enter a valid email address.';
  }
  return null;
}
