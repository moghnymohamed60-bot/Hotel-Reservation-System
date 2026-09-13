package com.example.hotelreservation.mapper;

import com.example.hotelreservation.dto.response.ReservationResponse;
import com.example.hotelreservation.entity.Reservation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.temporal.ChronoUnit;

@Component
public class ReservationMapper {

    private final PaymentMapper paymentMapper;

    @Autowired
    public ReservationMapper(PaymentMapper paymentMapper) {
        this.paymentMapper = paymentMapper;
    }

    public ReservationResponse toResponse(Reservation reservation) {
        if (reservation == null) {
            return null;
        }

        long nights = ChronoUnit.DAYS.between(reservation.getCheckInDate(), reservation.getCheckOutDate());
        if (nights <= 0) nights = 1;

        return ReservationResponse.builder()
                .id(reservation.getId())
                .reservationCode(reservation.getReservationCode())
                .userId(reservation.getUser() != null ? reservation.getUser().getId() : null)
                .userFullName(reservation.getUser() != null ? reservation.getUser().getFullName() : null)
                .userEmail(reservation.getUser() != null ? reservation.getUser().getEmail() : null)
                .userPhone(reservation.getUser() != null ? reservation.getUser().getPhoneNumber() : null)
                .hotelId(reservation.getRoom() != null && reservation.getRoom().getHotel() != null ? reservation.getRoom().getHotel().getId() : null)
                .hotelName(reservation.getRoom() != null && reservation.getRoom().getHotel() != null ? reservation.getRoom().getHotel().getName() : null)
                .hotelCity(reservation.getRoom() != null && reservation.getRoom().getHotel() != null ? reservation.getRoom().getHotel().getCity() : null)
                .hotelAddress(reservation.getRoom() != null && reservation.getRoom().getHotel() != null ? reservation.getRoom().getHotel().getAddress() : null)
                .roomId(reservation.getRoom() != null ? reservation.getRoom().getId() : null)
                .roomNumber(reservation.getRoom() != null ? reservation.getRoom().getRoomNumber() : null)
                .roomType(reservation.getRoom() != null && reservation.getRoom().getRoomType() != null ? reservation.getRoom().getRoomType().name() : null)
                .pricePerNight(reservation.getRoom() != null ? reservation.getRoom().getPricePerNight() : null)
                .checkInDate(reservation.getCheckInDate())
                .checkOutDate(reservation.getCheckOutDate())
                .numberOfNights(nights)
                .numberOfGuests(reservation.getNumberOfGuests())
                .totalPrice(reservation.getTotalPrice())
                .reservationStatus(reservation.getReservationStatus())
                .specialRequests(reservation.getSpecialRequests())
                .payment(reservation.getPayment() != null ? paymentMapper.toResponse(reservation.getPayment()) : null)
                .createdAt(reservation.getCreatedAt())
                .updatedAt(reservation.getUpdatedAt())
                .build();
    }
}
