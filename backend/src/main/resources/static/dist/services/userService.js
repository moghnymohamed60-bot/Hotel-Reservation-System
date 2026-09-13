import { ApiService } from './apiService';
export const userService = {
    async getUsers(params) {
        return ApiService.get('/users', params);
    },
    async getUserById(id) {
        return ApiService.get(`/users/${id}`);
    },
    async updateUser(id, data) {
        return ApiService.put(`/users/${id}`, data);
    },
    async changePassword(id, data) {
        return ApiService.post(`/users/${id}/change-password`, data);
    },
    async deleteUser(id) {
        return ApiService.delete(`/users/${id}`);
    },
};
