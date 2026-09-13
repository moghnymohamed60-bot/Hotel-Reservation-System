package com.example.hotelreservation.dto.request;

import com.example.hotelreservation.enums.PaymentMethod;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class ReservationRequest {

    @NotNull(message = "Room ID is required")
    private Long roomId;

    @NotNull(message = "Check-in date is required")
    @FutureOrPresent(message = "Check-in date must be today or in the future")
    private LocalDate checkInDate;

    @NotNull(message = "Check-out date is required")
    @Future(message = "Check-out date must be in the future")
    private LocalDate checkOutDate;

    @NotNull(message = "Number of guests is required")
    @Min(value = 1, message = "At least 1 guest is required")
    private Integer numberOfGuests;

    private String specialRequests;

    private PaymentMethod paymentMethod = PaymentMethod.CARD;

    public ReservationRequest() {}

    public ReservationRequest(Long roomId, LocalDate checkInDate, LocalDate checkOutDate, Integer numberOfGuests, String specialRequests, PaymentMethod paymentMethod) {
        this.roomId = roomId;
        this.checkInDate = checkInDate;
        this.checkOutDate = checkOutDate;
        this.numberOfGuests = numberOfGuests;
        this.specialRequests = specialRequests;
        this.paymentMethod = paymentMethod != null ? paymentMethod : PaymentMethod.CARD;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long roomId;
        private LocalDate checkInDate;
        private LocalDate checkOutDate;
        private Integer numberOfGuests;
        private String specialRequests;
        private PaymentMethod paymentMethod = PaymentMethod.CARD;

        public Builder roomId(Long roomId) { this.roomId = roomId; return this; }
        public Builder checkInDate(LocalDate checkInDate) { this.checkInDate = checkInDate; return this; }
        public Builder checkOutDate(LocalDate checkOutDate) { this.checkOutDate = checkOutDate; return this; }
        public Builder numberOfGuests(Integer numberOfGuests) { this.numberOfGuests = numberOfGuests; return this; }
        public Builder specialRequests(String specialRequests) { this.specialRequests = specialRequests; return this; }
        public Builder paymentMethod(PaymentMethod paymentMethod) { this.paymentMethod = paymentMethod; return this; }

        public ReservationRequest build() {
            return new ReservationRequest(roomId, checkInDate, checkOutDate, numberOfGuests, specialRequests, paymentMethod);
        }
    }

    public Long getRoomId() { return roomId; }
    public void setRoomId(Long roomId) { this.roomId = roomId; }

    public LocalDate getCheckInDate() { return checkInDate; }
    public void setCheckInDate(LocalDate checkInDate) { this.checkInDate = checkInDate; }

    public LocalDate getCheckOutDate() { return checkOutDate; }
    public void setCheckOutDate(LocalDate checkOutDate) { this.checkOutDate = checkOutDate; }

    public Integer getNumberOfGuests() { return numberOfGuests; }
    public void setNumberOfGuests(Integer numberOfGuests) { this.numberOfGuests = numberOfGuests; }

    public String getSpecialRequests() { return specialRequests; }
    public void setSpecialRequests(String specialRequests) { this.specialRequests = specialRequests; }

    public PaymentMethod getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(PaymentMethod paymentMethod) { this.paymentMethod = paymentMethod; }
}
