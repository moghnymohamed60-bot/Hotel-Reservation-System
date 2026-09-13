import { ApiService } from './apiService';
import { Page, Room, RoomStatus, RoomType } from '../types';

export const roomService = {
  async getRooms(params?: {
    hotelId?: number;
    roomType?: RoomType;
    capacity?: number;
    status?: RoomStatus;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
  }): Promise<Page<Room>> {
    return ApiService.get<Page<Room>>('/rooms', params);
  },

  async getRoomById(id: number): Promise<Room> {
    return ApiService.get<Room>(`/rooms/${id}`);
  },

  async getRoomsByHotelId(hotelId: number): Promise<Room[]> {
    return ApiService.get<Room[]>(`/rooms/hotel/${hotelId}`);
  },

  async findAvailableRooms(params: {
    hotelId?: number;
    city?: string;
    checkInDate: string;
    checkOutDate: string;
    guests?: number;
    roomType?: RoomType;
  }): Promise<Room[]> {
    return ApiService.get<Room[]>('/rooms/available', params);
  },

  async createRoom(room: Partial<Room>): Promise<Room> {
    return ApiService.post<Room>('/rooms', room);
  },

  async updateRoom(id: number, room: Partial<Room>): Promise<Room> {
    return ApiService.put<Room>(`/rooms/${id}`, room);
  },

  async updateRoomStatus(id: number, status: RoomStatus): Promise<Room> {
    return ApiService.patch<Room>(`/rooms/${id}/status`, undefined, { status });
  },

  async deleteRoom(id: number): Promise<void> {
    return ApiService.delete<void>(`/rooms/${id}`);
  },
};
