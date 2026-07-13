export function getApiErrorMessage(error, fallback = 'Request failed.') {
  const data = error?.response?.data;
  if (typeof data === 'string' && data.trim()) {
    return data;
  }
  if (data?.message) {
    return data.message;
  }
  if (data?.error) {
    return data.error;
  }
  if (error?.message && !error.message.startsWith('Request failed with status code')) {
    return error.message;
  }
  if (error?.response?.status === 400) {
    return 'Invalid customer data. Check customer number, phone numbers, and ID details.';
  }
  return fallback;
}
