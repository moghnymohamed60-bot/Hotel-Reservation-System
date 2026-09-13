import { ApiService } from './apiService';
import { Page, User } from '../types';

export const userService = {
  async getUsers(params?: { page?: number; size?: number; sortBy?: string; sortDir?: string }): Promise<Page<User>> {
    return ApiService.get<Page<User>>('/users', params);
  },

  async getUserById(id: number): Promise<User> {
    return ApiService.get<User>(`/users/${id}`);
  },

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    return ApiService.put<User>(`/users/${id}`, data);
  },

  async changePassword(id: number, data: { currentPassword: string; newPassword: string }): Promise<void> {
    return ApiService.post<void>(`/users/${id}/change-password`, data);
  },

  async deleteUser(id: number): Promise<void> {
    return ApiService.delete<void>(`/users/${id}`);
  },
};
