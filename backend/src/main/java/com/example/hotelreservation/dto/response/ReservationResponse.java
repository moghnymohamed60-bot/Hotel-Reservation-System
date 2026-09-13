package com.example.hotelreservation.dto.response;

import com.example.hotelreservation.enums.ReservationStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class ReservationResponse {

    private Long id;
    private String reservationCode;
    private Long userId;
    private String userFullName;
    private String userEmail;
    private String userPhone;
    private Long hotelId;
    private String hotelName;
    private String hotelCity;
    private String hotelAddress;
    private Long roomId;
    private String roomNumber;
    private String roomType;
    private BigDecimal pricePerNight;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private long numberOfNights;
    private Integer numberOfGuests;
    private BigDecimal totalPrice;
    private ReservationStatus reservationStatus;
    private String specialRequests;
    private PaymentResponse payment;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ReservationResponse() {}

    public ReservationResponse(Long id, String reservationCode, Long userId, String userFullName, String userEmail, String userPhone, Long hotelId, String hotelName, String hotelCity, String hotelAddress, Long roomId, String roomNumber, String roomType, BigDecimal pricePerNight, LocalDate checkInDate, LocalDate checkOutDate, long numberOfNights, Integer numberOfGuests, BigDecimal totalPrice, ReservationStatus reservationStatus, String specialRequests, PaymentResponse payment, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.reservationCode = reservationCode;
        this.userId = userId;
        this.userFullName = userFullName;
        this.userEmail = userEmail;
        this.userPhone = userPhone;
        this.hotelId = hotelId;
        this.hotelName = hotelName;
        this.hotelCity = hotelCity;
        this.hotelAddress = hotelAddress;
        this.roomId = roomId;
        this.roomNumber = roomNumber;
        this.roomType = roomType;
        this.pricePerNight = pricePerNight;
        this.checkInDate = checkInDate;
        this.checkOutDate = checkOutDate;
        this.numberOfNights = numberOfNights;
        this.numberOfGuests = numberOfGuests;
        this.totalPrice = totalPrice;
        this.reservationStatus = reservationStatus;
        this.specialRequests = specialRequests;
        this.payment = payment;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String reservationCode;
        private Long userId;
        private String userFullName;
        private String userEmail;
        private String userPhone;
        private Long hotelId;
        private String hotelName;
        private String hotelCity;
        private String hotelAddress;
        private Long roomId;
        private String roomNumber;
        private String roomType;
        private BigDecimal pricePerNight;
        private LocalDate checkInDate;
        private LocalDate checkOutDate;
        private long numberOfNights;
        private Integer numberOfGuests;
        private BigDecimal totalPrice;
        private ReservationStatus reservationStatus;
        private String specialRequests;
        private PaymentResponse payment;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder reservationCode(String reservationCode) { this.reservationCode = reservationCode; return this; }
        public Builder userId(Long userId) { this.userId = userId; return this; }
        public Builder userFullName(String userFullName) { this.userFullName = userFullName; return this; }
        public Builder userEmail(String userEmail) { this.userEmail = userEmail; return this; }
        public Builder userPhone(String userPhone) { this.userPhone = userPhone; return this; }
        public Builder hotelId(Long hotelId) { this.hotelId = hotelId; return this; }
        public Builder hotelName(String hotelName) { this.hotelName = hotelName; return this; }
        public Builder hotelCity(String hotelCity) { this.hotelCity = hotelCity; return this; }
        public Builder hotelAddress(String hotelAddress) { this.hotelAddress = hotelAddress; return this; }
        public Builder roomId(Long roomId) { this.roomId = roomId; return this; }
        public Builder roomNumber(String roomNumber) { this.roomNumber = roomNumber; return this; }
        public Builder roomType(String roomType) { this.roomType = roomType; return this; }
        public Builder pricePerNight(BigDecimal pricePerNight) { this.pricePerNight = pricePerNight; return this; }
        public Builder checkInDate(LocalDate checkInDate) { this.checkInDate = checkInDate; return this; }
        public Builder checkOutDate(LocalDate checkOutDate) { this.checkOutDate = checkOutDate; return this; }
        public Builder numberOfNights(long numberOfNights) { this.numberOfNights = numberOfNights; return this; }
        public Builder numberOfGuests(Integer numberOfGuests) { this.numberOfGuests = numberOfGuests; return this; }
        public Builder totalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; return this; }
        public Builder reservationStatus(ReservationStatus reservationStatus) { this.reservationStatus = reservationStatus; return this; }
        public Builder specialRequests(String specialRequests) { this.specialRequests = specialRequests; return this; }
        public Builder payment(PaymentResponse payment) { this.payment = payment; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public Builder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public ReservationResponse build() {
            return new ReservationResponse(id, reservationCode, userId, userFullName, userEmail, userPhone, hotelId, hotelName, hotelCity, hotelAddress, roomId, roomNumber, roomType, pricePerNight, checkInDate, checkOutDate, numberOfNights, numberOfGuests, totalPrice, reservationStatus, specialRequests, payment, createdAt, updatedAt);
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getReservationCode() { return reservationCode; }
    public void setReservationCode(String reservationCode) { this.reservationCode = reservationCode; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUserFullName() { return userFullName; }
    public void setUserFullName(String userFullName) { this.userFullName = userFullName; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public String getUserPhone() { return userPhone; }
    public void setUserPhone(String userPhone) { this.userPhone = userPhone; }

    public Long getHotelId() { return hotelId; }
    public void setHotelId(Long hotelId) { this.hotelId = hotelId; }

    public String getHotelName() { return hotelName; }
    public void setHotelName(String hotelName) { this.hotelName = hotelName; }

    public String getHotelCity() { return hotelCity; }
    public void setHotelCity(String hotelCity) { this.hotelCity = hotelCity; }

    public String getHotelAddress() { return hotelAddress; }
    public void setHotelAddress(String hotelAddress) { this.hotelAddress = hotelAddress; }

    public Long getRoomId() { return roomId; }
    public void setRoomId(Long roomId) { this.roomId = roomId; }

    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }

    public String getRoomType() { return roomType; }
    public void setRoomType(String roomType) { this.roomType = roomType; }

    public BigDecimal getPricePerNight() { return pricePerNight; }
    public void setPricePerNight(BigDecimal pricePerNight) { this.pricePerNight = pricePerNight; }

    public LocalDate getCheckInDate() { return checkInDate; }
    public void setCheckInDate(LocalDate checkInDate) { this.checkInDate = checkInDate; }

    public LocalDate getCheckOutDate() { return checkOutDate; }
    public void setCheckOutDate(LocalDate checkOutDate) { this.checkOutDate = checkOutDate; }

    public long getNumberOfNights() { return numberOfNights; }
    public void setNumberOfNights(long numberOfNights) { this.numberOfNights = numberOfNights; }

    public Integer getNumberOfGuests() { return numberOfGuests; }
    public void setNumberOfGuests(Integer numberOfGuests) { this.numberOfGuests = numberOfGuests; }

    public BigDecimal getTotalPrice() { return totalPrice; }
    public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }

    public ReservationStatus getReservationStatus() { return reservationStatus; }
    public void setReservationStatus(ReservationStatus reservationStatus) { this.reservationStatus = reservationStatus; }

    public String getSpecialRequests() { return specialRequests; }
    public void setSpecialRequests(String specialRequests) { this.specialRequests = specialRequests; }

    public PaymentResponse getPayment() { return payment; }
    public void setPayment(PaymentResponse payment) { this.payment = payment; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
