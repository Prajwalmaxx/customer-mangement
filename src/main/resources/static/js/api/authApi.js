function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || 'null');
  } catch {
    return null;
  }
}

async function parseJsonResponse(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

async function sendAuthRequest(path, body) {
  const response = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const payload = await parseJsonResponse(response);

  if (!response.ok) {
    throw new Error(
      payload?.message ??
        (response.status === 401
          ? 'Invalid email or password.'
          : `Auth request failed (${response.status}).`),
    );
  }

  return payload;
}

async function checkEmailAvailability(email) {
  const response = await fetch(`/api/auth/check-email?email=${encodeURIComponent(email.trim())}`);
  const payload = await parseJsonResponse(response);

  if (!response.ok) {
    throw new Error(payload?.message ?? 'Could not verify email.');
  }

  return payload;
}
