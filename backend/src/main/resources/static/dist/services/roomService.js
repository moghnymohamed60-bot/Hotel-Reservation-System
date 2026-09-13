import { ApiService } from './apiService';
export const roomService = {
    async getRooms(params) {
        return ApiService.get('/rooms', params);
    },
    async getRoomById(id) {
        return ApiService.get(`/rooms/${id}`);
    },
    async getRoomsByHotelId(hotelId) {
        return ApiService.get(`/rooms/hotel/${hotelId}`);
    },
    async findAvailableRooms(params) {
        return ApiService.get('/rooms/available', params);
    },
    async createRoom(room) {
        return ApiService.post('/rooms', room);
    },
    async updateRoom(id, room) {
        return ApiService.put(`/rooms/${id}`, room);
    },
    async updateRoomStatus(id, status) {
        return ApiService.patch(`/rooms/${id}/status`, undefined, { status });
    },
    async deleteRoom(id) {
        return ApiService.delete(`/rooms/${id}`);
    },
};
