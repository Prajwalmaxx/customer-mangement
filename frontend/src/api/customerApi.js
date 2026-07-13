import api from './axiosClient';

export async function fetchReportCustomer() {
  const { data } = await api.get('/report1');
  return data;
}

export async function fetchCustomers() {
  const { data } = await api.get('/customers');
  return data;
}

export async function createCustomer(payload) {
  const { data } = await api.post('/register', payload);
  return data;
}

export async function updateCustomer(cno, payload) {
  const { data } = await api.put(`/customers/${cno}`, payload);
  return data;
}

export async function deleteCustomer(cno) {
  await api.delete(`/customers/${cno}`);
}
