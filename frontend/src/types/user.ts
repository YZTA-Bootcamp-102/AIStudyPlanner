export type UserRole = 'kullanıcı' | 'yönetici';

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  role: UserRole;
  is_active: boolean;
}

export interface UserCreate {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  password: string;
  role: UserRole;
}

export interface UserUpdate {
  first_name?: string;
  last_name?: string;
  username?: string;
  email?: string;
  phone_number?: string;
  role?: UserRole;
  old_password?: string;
  new_password?: string;
}
