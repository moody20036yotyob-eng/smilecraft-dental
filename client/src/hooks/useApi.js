const getToken = () => localStorage.getItem('sc_admin_token')

export async function apiLogin(password) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  })
  if (!res.ok) throw new Error('Invalid password')
  const { token } = await res.json()
  localStorage.setItem('sc_admin_token', token)
  return token
}

export function apiLogout() {
  localStorage.removeItem('sc_admin_token')
}

async function authedFetch(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
      ...(options.headers || {}),
    },
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export const api = {
  getContent: () => fetch('/api/content').then(r => r.json()),
  putContent: (data) => authedFetch('/api/content', { method: 'PUT', body: JSON.stringify(data) }),

  getDoctors: () => fetch('/api/doctors').then(r => r.json()),
  createDoctor: (data) => authedFetch('/api/doctors', { method: 'POST', body: JSON.stringify(data) }),
  updateDoctor: (id, data) => authedFetch(`/api/doctors/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteDoctor: (id) => authedFetch(`/api/doctors/${id}`, { method: 'DELETE' }),

  getServices: () => fetch('/api/services').then(r => r.json()),
  createService: (data) => authedFetch('/api/services', { method: 'POST', body: JSON.stringify(data) }),
  updateService: (id, data) => authedFetch(`/api/services/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteService: (id) => authedFetch(`/api/services/${id}`, { method: 'DELETE' }),
}
