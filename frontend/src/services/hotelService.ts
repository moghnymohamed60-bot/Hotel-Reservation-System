import { ApiService } from './apiService';
import { Hotel, Page } from '../types';

export const hotelService = {
  async getHotels(params?: {
    city?: string;
    name?: string;
    starRating?: number;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
  }): Promise<Page<Hotel>> {
    return ApiService.get<Page<Hotel>>('/hotels', params);
  },

  async getHotelById(id: number): Promise<Hotel> {
    return ApiService.get<Hotel>(`/hotels/${id}`);
  },

  async getCities(): Promise<string[]> {
    return ApiService.get<string[]>('/hotels/cities');
  },

  async createHotel(hotel: Partial<Hotel>): Promise<Hotel> {
    return ApiService.post<Hotel>('/hotels', hotel);
  },

  async updateHotel(id: number, hotel: Partial<Hotel>): Promise<Hotel> {
    return ApiService.put<Hotel>(`/hotels/${id}`, hotel);
  },

  async deleteHotel(id: number): Promise<void> {
    return ApiService.delete<void>(`/hotels/${id}`);
  },
};
