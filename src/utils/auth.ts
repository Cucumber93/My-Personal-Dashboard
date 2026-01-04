// Authentication utility functions

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';
const TOKEN_EXPIRY_KEY = 'token_expiry';

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface AuthData {
  token: string;
  user: User;
}

// Store auth token with 7-day expiration
export const setAuthToken = (token: string): void => {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 7); // 7 days from now
  
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(TOKEN_EXPIRY_KEY, expiryDate.toISOString());
};

// Get auth token if still valid
export const getAuthToken = (): string | null => {
  const token = localStorage.getItem(TOKEN_KEY);
  const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
  
  if (!token || !expiry) {
    return null;
  }
  
  const expiryDate = new Date(expiry);
  const now = new Date();
  
  // Check if token has expired
  if (now > expiryDate) {
    clearAuth();
    return null;
  }
  
  return token;
};

// Store user data
export const setUserData = (user: User): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

// Get user data
export const getUserData = (): User | null => {
  const userData = localStorage.getItem(USER_KEY);
  
  if (!userData) {
    return null;
  }
  
  try {
    return JSON.parse(userData);
  } catch {
    return null;
  }
};

// Store complete auth data (token + user)
export const setAuthData = (authData: AuthData): void => {
  setAuthToken(authData.token);
  setUserData(authData.user);
};

// Get complete auth data
export const getAuthData = (): AuthData | null => {
  const token = getAuthToken();
  const user = getUserData();
  
  if (!token || !user) {
    return null;
  }
  
  return { token, user };
};

// Clear all auth data
export const clearAuth = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
  // Also clear old userId if it exists
  localStorage.removeItem('userId');
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return getAuthToken() !== null;
};

