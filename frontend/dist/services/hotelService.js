import { ApiService } from './apiService';
export const hotelService = {
    async getHotels(params) {
        return ApiService.get('/hotels', params);
    },
    async getHotelById(id) {
        return ApiService.get(`/hotels/${id}`);
    },
    async getCities() {
        return ApiService.get('/hotels/cities');
    },
    async createHotel(hotel) {
        return ApiService.post('/hotels', hotel);
    },
    async updateHotel(id, hotel) {
        return ApiService.put(`/hotels/${id}`, hotel);
    },
    async deleteHotel(id) {
        return ApiService.delete(`/hotels/${id}`);
    },
};
