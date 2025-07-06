export interface User {
  id: string;
  email: string;
  password: string;
  fullName: string;
  createdAt: string;
  lastLoginAt: string | null;
}

export const mockUsers: User[] = [
  {
    id: "admin-001",
    email: "admin@admin.com",
    password: "admin", // In a real app, this would be hashed
    fullName: "Admin User",
    createdAt: "2024-01-01T00:00:00Z",
    lastLoginAt: "2024-03-19T10:00:00Z"
  }
];

export const findUserByEmail = (email: string): User | undefined => {
  return mockUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
};

export const addUser = (user: Omit<User, 'id' | 'createdAt' | 'lastLoginAt'>): User => {
  const newUser: User = {
    ...user,
    id: `user-${mockUsers.length + 1}`,
    createdAt: new Date().toISOString(),
    lastLoginAt: null
  };
  mockUsers.push(newUser);
  return newUser;
};

export const validateCredentials = (email: string, password: string): User | null => {
  const user = findUserByEmail(email);
  if (user && user.password === password) {
    return user;
  }
  return null;
}; 