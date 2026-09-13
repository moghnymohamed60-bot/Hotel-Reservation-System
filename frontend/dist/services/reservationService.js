import { ApiService } from './apiService';
export const reservationService = {
    async createReservation(data) {
        return ApiService.post('/reservations', data);
    },
    async getMyReservations() {
        return ApiService.get('/reservations/my');
    },
    async getReservations(params) {
        return ApiService.get('/reservations', params);
    },
    async getReservationById(id) {
        return ApiService.get(`/reservations/${id}`);
    },
    async getReservationByCode(code) {
        return ApiService.get(`/reservations/code/${code}`);
    },
    async cancelReservation(id) {
        return ApiService.patch(`/reservations/${id}/cancel`);
    },
    async updateReservationStatus(id, status, reason) {
        return ApiService.patch(`/reservations/${id}/status`, { status, reason });
    },
};
