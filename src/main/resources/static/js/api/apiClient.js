function getStoredToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

function clearAuthSession() {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(USER_STORAGE_KEY);
}

function authHeaders(extraHeaders = {}) {
  const token = getStoredToken();
  const headers = { ...extraHeaders };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

async function authenticatedFetch(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: authHeaders({
      ...(options.headers || {}),
    }),
  });

  if (response.status === 401) {
    clearAuthSession();
    window.location.reload();
    throw new Error('Session expired. Please log in again.');
  }

  return response;
}
