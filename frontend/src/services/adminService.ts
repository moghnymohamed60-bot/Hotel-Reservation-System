import { ApiService } from './apiService';
import { DashboardStats } from '../types';

export const adminService = {
  async getDashboardStatistics(): Promise<DashboardStats> {
    return ApiService.get<DashboardStats>('/admin/dashboard/statistics');
  },
};
