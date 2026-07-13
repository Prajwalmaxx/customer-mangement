import api from './axiosClient';

export async function loginRequest(credentials) {
  const { data } = await api.post('/api/auth/login', credentials);
  return data;
}

export async function registerRequest(payload) {
  const { data } = await api.post('/api/auth/register', payload);
  return data;
}

export async function checkEmailAvailability(email) {
  const { data } = await api.get('/api/auth/check-email', {
    params: { email: email.trim() },
  });
  return data;
}
