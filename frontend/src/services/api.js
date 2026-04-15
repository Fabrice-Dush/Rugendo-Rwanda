import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // send refresh token cookie
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach access token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('rugendo-access-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 — attempt token refresh, then retry once
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const { data } = await axios.post('/api/auth/refresh', {}, { withCredentials: true });
        localStorage.setItem('rugendo-access-token', data.accessToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch {
        // Refresh failed — clear session and redirect
        localStorage.removeItem('rugendo-access-token');
        localStorage.removeItem('rugendo-user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
