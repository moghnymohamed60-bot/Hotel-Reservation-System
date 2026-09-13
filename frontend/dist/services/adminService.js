import { ApiService } from './apiService';
export const adminService = {
    async getDashboardStatistics() {
        return ApiService.get('/admin/dashboard/statistics');
    },
};
