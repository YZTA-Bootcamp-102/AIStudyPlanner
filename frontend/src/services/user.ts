import { api } from './auth';
import type { User, UserCreate, UserUpdate } from '../types/user';

export async function registerApi(data: UserCreate): Promise<{ user_id: number; email: string }> {
  const form = new URLSearchParams(data as any);
  const resp = await api.post('/auth/', form);
  return resp.data;
}

export async function getMeApi(): Promise<User> {
  const resp = await api.get('/auth/me');
  return resp.data;
}

export async function updateUserApi(data: UserUpdate): Promise<User> {
  const resp = await api.patch('/users/me', data);
  return resp.data;
}
export async function getUserApi(userId: number): Promise<User> {
  const resp = await api.get(`/users/${userId}`);
  return resp.data;
}
export async function getUsersApi(): Promise<User[]> {
  const resp = await api.get('/users/');
  return resp.data;
}
export async function deleteUserApi(userId: number): Promise<void> {
  await api.delete(`/users/${userId}`);
}
