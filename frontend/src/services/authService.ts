import { ApiService } from './apiService';
import { AuthResponse, User } from '../types';

export const authService = {
  async register(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
    role?: string;
  }): Promise<AuthResponse> {
    const res = await ApiService.post<AuthResponse>('/auth/register', data);
    ApiService.setToken(res.token);
    ApiService.setUser(res.user);
    return res;
  },

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    const res = await ApiService.post<AuthResponse>('/auth/login', data);
    ApiService.setToken(res.token);
    ApiService.setUser(res.user);
    return res;
  },

  async getCurrentUser(): Promise<User> {
    const user = await ApiService.get<User>('/auth/me');
    ApiService.setUser(user);
    return user;
  },

  logout(): void {
    ApiService.clearSession();
    window.location.href = 'login.html';
  },

  getCurrentStoredUser(): User | null {
    return ApiService.getUser();
  },

  isLoggedIn(): boolean {
    return ApiService.isAuthenticated();
  },

  isAdmin(): boolean {
    const user = this.getCurrentStoredUser();
    return user?.role === 'ADMIN';
  },

  isStaffOrAdmin(): boolean {
    const user = this.getCurrentStoredUser();
    return user?.role === 'ADMIN' || user?.role === 'STAFF';
  },
};
