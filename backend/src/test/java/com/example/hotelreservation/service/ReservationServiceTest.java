package com.example.hotelreservation.service;

import com.example.hotelreservation.dto.request.ReservationRequest;
import com.example.hotelreservation.dto.response.ReservationResponse;
import com.example.hotelreservation.entity.Hotel;
import com.example.hotelreservation.entity.Payment;
import com.example.hotelreservation.entity.Reservation;
import com.example.hotelreservation.entity.Room;
import com.example.hotelreservation.entity.User;
import com.example.hotelreservation.enums.*;
import com.example.hotelreservation.exception.InvalidReservationException;
import com.example.hotelreservation.exception.RoomNotAvailableException;
import com.example.hotelreservation.mapper.ReservationMapper;
import com.example.hotelreservation.repository.ReservationRepository;
import com.example.hotelreservation.repository.RoomRepository;
import com.example.hotelreservation.repository.UserRepository;
import com.example.hotelreservation.security.UserPrincipal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReservationServiceTest {

    @Mock
    private ReservationRepository reservationRepository;

    @Mock
    private RoomRepository roomRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PaymentService paymentService;

    @Mock
    private ReservationMapper reservationMapper;

    @InjectMocks
    private ReservationService reservationService;

    private User user;
    private UserPrincipal userPrincipal;
    private Hotel hotel;
    private Room room;
    private Reservation reservation;
    private ReservationRequest reservationRequest;
    private ReservationResponse reservationResponse;

    @BeforeEach
    void setUp() {
        user = User.builder()
                .id(1L)
                .firstName("John")
                .lastName("Doe")
                .email("john.doe@example.com")
                .role(Role.CUSTOMER)
                .accountStatus(AccountStatus.ACTIVE)
                .build();

        userPrincipal = UserPrincipal.create(user);

        hotel = Hotel.builder()
                .id(1L)
                .name("Grand Palace")
                .city("New York")
                .build();

        room = Room.builder()
                .id(10L)
                .hotel(hotel)
                .roomNumber("301")
                .roomType(RoomType.DELUXE)
                .pricePerNight(new BigDecimal("150.00"))
                .capacity(2)
                .floor(3)
                .status(RoomStatus.AVAILABLE)
                .build();

        LocalDate checkIn = LocalDate.now().plusDays(2);
        LocalDate checkOut = LocalDate.now().plusDays(5); // 3 nights

        reservationRequest = ReservationRequest.builder()
                .roomId(10L)
                .checkInDate(checkIn)
                .checkOutDate(checkOut)
                .numberOfGuests(2)
                .paymentMethod(PaymentMethod.CARD)
                .build();

        reservation = Reservation.builder()
                .id(100L)
                .reservationCode("HTL-2026-123456")
                .user(user)
                .room(room)
                .checkInDate(checkIn)
                .checkOutDate(checkOut)
                .numberOfGuests(2)
                .totalPrice(new BigDecimal("450.00"))
                .reservationStatus(ReservationStatus.CONFIRMED)
                .build();

        reservationResponse = ReservationResponse.builder()
                .id(100L)
                .reservationCode("HTL-2026-123456")
                .totalPrice(new BigDecimal("450.00"))
                .reservationStatus(ReservationStatus.CONFIRMED)
                .build();
    }

    @Test
    @DisplayName("Should successfully create a reservation and calculate correct server-side total price")
    void testCreateReservationSuccess() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(roomRepository.findById(10L)).thenReturn(Optional.of(room));
        when(reservationRepository.findOverlappingReservations(eq(10L), any(LocalDate.class), any(LocalDate.class), any()))
                .thenReturn(Collections.emptyList());
        when(reservationRepository.findByReservationCode(anyString())).thenReturn(Optional.empty());
        when(reservationRepository.save(any(Reservation.class))).thenReturn(reservation);

        Payment payment = Payment.builder()
                .id(1L)
                .amount(new BigDecimal("450.00"))
                .paymentStatus(PaymentStatus.PAID)
                .paymentMethod(PaymentMethod.CARD)
                .transactionReference("TXN-123")
                .build();

        when(paymentService.processPayment(any(Reservation.class), eq(PaymentMethod.CARD), any(BigDecimal.class)))
                .thenReturn(payment);
        when(reservationMapper.toResponse(any(Reservation.class))).thenReturn(reservationResponse);

        ReservationResponse result = reservationService.createReservation(reservationRequest, userPrincipal);

        assertNotNull(result);
        assertEquals("HTL-2026-123456", result.getReservationCode());
        assertEquals(new BigDecimal("450.00"), result.getTotalPrice());

        verify(reservationRepository, times(1)).save(any(Reservation.class));
        verify(paymentService, times(1)).processPayment(any(Reservation.class), eq(PaymentMethod.CARD), eq(new BigDecimal("450.00")));
    }

    @Test
    @DisplayName("Should throw RoomNotAvailableException when overlapping reservation exists (Prevent Double Booking)")
    void testCreateReservationOverlapping() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(roomRepository.findById(10L)).thenReturn(Optional.of(room));
        when(reservationRepository.findOverlappingReservations(eq(10L), any(LocalDate.class), any(LocalDate.class), any()))
                .thenReturn(List.of(reservation));

        assertThrows(RoomNotAvailableException.class, () -> reservationService.createReservation(reservationRequest, userPrincipal));
        verify(reservationRepository, never()).save(any(Reservation.class));
    }

    @Test
    @DisplayName("Should throw InvalidReservationException when guests exceed capacity")
    void testCreateReservationExceedsCapacity() {
        reservationRequest.setNumberOfGuests(5); // room capacity is 2

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(roomRepository.findById(10L)).thenReturn(Optional.of(room));

        assertThrows(InvalidReservationException.class, () -> reservationService.createReservation(reservationRequest, userPrincipal));
        verify(reservationRepository, never()).save(any(Reservation.class));
    }

    @Test
    @DisplayName("Should throw InvalidReservationException when checkout date is before checkin date")
    void testCreateReservationInvalidDates() {
        reservationRequest.setCheckOutDate(reservationRequest.getCheckInDate().minusDays(1));

        assertThrows(InvalidReservationException.class, () -> reservationService.createReservation(reservationRequest, userPrincipal));
    }

    @Test
    @DisplayName("Should successfully cancel an active reservation")
    void testCancelReservationSuccess() {
        when(reservationRepository.findById(100L)).thenReturn(Optional.of(reservation));
        when(reservationRepository.save(any(Reservation.class))).thenReturn(reservation);

        ReservationResponse cancelledResponse = ReservationResponse.builder()
                .id(100L)
                .reservationStatus(ReservationStatus.CANCELLED)
                .build();
        when(reservationMapper.toResponse(any(Reservation.class))).thenReturn(cancelledResponse);

        ReservationResponse result = reservationService.cancelReservation(100L, userPrincipal);

        assertNotNull(result);
        assertEquals(ReservationStatus.CANCELLED, result.getReservationStatus());
    }
}
