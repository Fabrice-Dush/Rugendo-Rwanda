import api from './api.js';

export const authService = {
  async login(credentials) {
    const { data } = await api.post('/auth/login', credentials);
    if (data.accessToken) {
      localStorage.setItem('rugendo-access-token', data.accessToken);
    }
    return data;
  },

  async register(payload) {
    const { data } = await api.post('/auth/register', payload);
    return data;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('rugendo-access-token');
    }
  },

  async forgotPassword(email) {
    const { data } = await api.post('/auth/forgot-password', { email });
    return data;
  },

  async resetPassword(token, password) {
    const { data } = await api.post('/auth/reset-password', { token, password });
    return data;
  },
};
