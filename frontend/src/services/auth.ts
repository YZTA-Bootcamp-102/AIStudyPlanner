import axios from 'axios';
import type { TokenResponse } from '../types/auth';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: BASE_URL,
});

let isLogout = false;


api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  async error => {
    const isLogout = localStorage.getItem('isLogout') === 'true';
    if (isLogout) {
      return Promise.reject(error);
    }

    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh');
        if (!refreshToken) throw new Error('No refresh token found');

        const res = await axios.post(`${BASE_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        });

        const { access_token } = res.data;
        localStorage.setItem('access', access_token);

      
        api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        originalRequest.headers['Authorization'] = `Bearer ${access_token}`;

        return api(originalRequest);
      } catch (refreshError) {
        clearTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);


export async function loginApi(
  username: string,
  password: string,
  remember: boolean
): Promise<TokenResponse> {
  const form = new FormData();
  form.append('username', username);
  form.append('password', password);
  form.append('remember_me', remember ? 'true' : 'false');
  const resp = await api.post('/auth/token', form);
  return resp.data;
}

export async function registerApi(data: {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  phone_number?: string;
}): Promise<{ user_id: number; email: string }> {
  const form = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) form.append(key, value);
  });
  const resp = await api.post('/auth/', form);
  return resp.data;
}

export async function getMe() {
  const resp = await api.get('/auth/me');
  return resp.data;
}

export async function resetPasswordRequest(email: string) {
  const form = new URLSearchParams({ email });
  return await api.post('/auth/password-reset/request', form);
}

export function setTokens(access: string, refresh: string) {
  localStorage.setItem('access', access);
  localStorage.setItem('refresh', refresh);
  api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
}

export function clearTokens() {
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
  localStorage.setItem('isLogout', 'true');
  delete api.defaults.headers.common['Authorization'];
}