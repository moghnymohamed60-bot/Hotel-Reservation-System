// TypeScript Data Models for Hotel Reservation System

export type Role = 'CUSTOMER' | 'STAFF' | 'ADMIN';
export type AccountStatus = 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED';
export type RoomType = 'SINGLE' | 'DOUBLE' | 'TWIN' | 'SUITE' | 'DELUXE' | 'FAMILY';
export type RoomStatus = 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'INACTIVE';
export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'REJECTED';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
export type PaymentMethod = 'CASH' | 'CARD' | 'ONLINE';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: Role;
  accountStatus: AccountStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  expiresIn: number;
  user: User;
}

export interface Hotel {
  id: number;
  name: string;
  description: string;
  address: string;
  city: string;
  country: string;
  phoneNumber: string;
  email: string;
  starRating: number;
  checkInTime: string;
  checkOutTime: string;
  imageUrl?: string;
  amenities?: string;
  minPrice?: number;
  totalRooms?: number;
  rooms?: Room[];
  createdAt: string;
  updatedAt: string;
}

export interface Room {
  id: number;
  hotelId: number;
  hotelName?: string;
  hotelCity?: string;
  roomNumber: string;
  roomType: RoomType;
  pricePerNight: number;
  capacity: number;
  floor: number;
  description?: string;
  status: RoomStatus;
  imageUrl?: string;
  amenities?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: number;
  reservationId: number;
  amount: number;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  transactionReference: string;
  createdAt: string;
}

export interface Reservation {
  id: number;
  reservationCode: string;
  userId: number;
  userFullName: string;
  userEmail: string;
  userPhone: string;
  hotelId: number;
  hotelName: string;
  hotelCity: string;
  hotelAddress: string;
  roomId: number;
  roomNumber: string;
  roomType: string;
  pricePerNight: number;
  checkInDate: string;
  checkOutDate: string;
  numberOfNights: number;
  numberOfGuests: number;
  totalPrice: number;
  reservationStatus: ReservationStatus;
  specialRequests?: string;
  payment?: Payment;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalHotels: number;
  totalRooms: number;
  totalAvailableRooms: number;
  totalUsers: number;
  totalCustomers: number;
  totalStaff: number;
  totalReservations: number;
  pendingReservations: number;
  confirmedReservations: number;
  cancelledReservations: number;
  completedReservations: number;
  totalRevenue: number;
  occupancyRatePercentage: number;
  recentReservations: Reservation[];
  reservationsByStatus: Record<string, number>;
  roomsByType: Record<string, number>;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  timestamp: string;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
