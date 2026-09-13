import { ApiService } from './apiService';
import { Page, Reservation, ReservationStatus } from '../types';

export const reservationService = {
  async createReservation(data: {
    roomId: number;
    checkInDate: string;
    checkOutDate: string;
    numberOfGuests: number;
    specialRequests?: string;
    paymentMethod?: string;
  }): Promise<Reservation> {
    return ApiService.post<Reservation>('/reservations', data);
  },

  async getMyReservations(): Promise<Reservation[]> {
    return ApiService.get<Reservation[]>('/reservations/my');
  },

  async getReservations(params?: {
    hotelId?: number;
    roomId?: number;
    status?: ReservationStatus;
    startDate?: string;
    endDate?: string;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
  }): Promise<Page<Reservation>> {
    return ApiService.get<Page<Reservation>>('/reservations', params);
  },

  async getReservationById(id: number): Promise<Reservation> {
    return ApiService.get<Reservation>(`/reservations/${id}`);
  },

  async getReservationByCode(code: string): Promise<Reservation> {
    return ApiService.get<Reservation>(`/reservations/code/${code}`);
  },

  async cancelReservation(id: number): Promise<Reservation> {
    return ApiService.patch<Reservation>(`/reservations/${id}/cancel`);
  },

  async updateReservationStatus(id: number, status: ReservationStatus, reason?: string): Promise<Reservation> {
    return ApiService.patch<Reservation>(`/reservations/${id}/status`, { status, reason });
  },
};
