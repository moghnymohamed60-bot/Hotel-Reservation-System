package com.example.hotelreservation.entity;

import com.example.hotelreservation.enums.ReservationStatus;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "reservations", indexes = {
    @Index(name = "idx_reservations_code", columnList = "reservation_code"),
    @Index(name = "idx_reservations_user_id", columnList = "user_id"),
    @Index(name = "idx_reservations_room_id", columnList = "room_id"),
    @Index(name = "idx_reservations_status", columnList = "reservation_status"),
    @Index(name = "idx_reservations_dates", columnList = "room_id, check_in_date, check_out_date, reservation_status")
})
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "reservation_code", nullable = false, unique = true, length = 30)
    private String reservationCode;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @Column(name = "check_in_date", nullable = false)
    private LocalDate checkInDate;

    @Column(name = "check_out_date", nullable = false)
    private LocalDate checkOutDate;

    @Column(name = "number_of_guests", nullable = false)
    private Integer numberOfGuests;

    @Column(name = "total_price", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalPrice;

    @Enumerated(EnumType.STRING)
    @Column(name = "reservation_status", nullable = false, length = 20)
    private ReservationStatus reservationStatus = ReservationStatus.PENDING;

    @Column(name = "special_requests", columnDefinition = "TEXT")
    private String specialRequests;

    @OneToOne(mappedBy = "reservation", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Payment payment;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public Reservation() {}

    public Reservation(Long id, String reservationCode, User user, Room room, LocalDate checkInDate, LocalDate checkOutDate, Integer numberOfGuests, BigDecimal totalPrice, ReservationStatus reservationStatus, String specialRequests, Payment payment, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.reservationCode = reservationCode;
        this.user = user;
        this.room = room;
        this.checkInDate = checkInDate;
        this.checkOutDate = checkOutDate;
        this.numberOfGuests = numberOfGuests;
        this.totalPrice = totalPrice;
        this.reservationStatus = reservationStatus != null ? reservationStatus : ReservationStatus.PENDING;
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
        private User user;
        private Room room;
        private LocalDate checkInDate;
        private LocalDate checkOutDate;
        private Integer numberOfGuests;
        private BigDecimal totalPrice;
        private ReservationStatus reservationStatus = ReservationStatus.PENDING;
        private String specialRequests;
        private Payment payment;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder reservationCode(String reservationCode) { this.reservationCode = reservationCode; return this; }
        public Builder user(User user) { this.user = user; return this; }
        public Builder room(Room room) { this.room = room; return this; }
        public Builder checkInDate(LocalDate checkInDate) { this.checkInDate = checkInDate; return this; }
        public Builder checkOutDate(LocalDate checkOutDate) { this.checkOutDate = checkOutDate; return this; }
        public Builder numberOfGuests(Integer numberOfGuests) { this.numberOfGuests = numberOfGuests; return this; }
        public Builder totalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; return this; }
        public Builder reservationStatus(ReservationStatus reservationStatus) { this.reservationStatus = reservationStatus; return this; }
        public Builder specialRequests(String specialRequests) { this.specialRequests = specialRequests; return this; }
        public Builder payment(Payment payment) { this.payment = payment; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public Builder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public Reservation build() {
            return new Reservation(id, reservationCode, user, room, checkInDate, checkOutDate, numberOfGuests, totalPrice, reservationStatus, specialRequests, payment, createdAt, updatedAt);
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getReservationCode() { return reservationCode; }
    public void setReservationCode(String reservationCode) { this.reservationCode = reservationCode; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Room getRoom() { return room; }
    public void setRoom(Room room) { this.room = room; }

    public LocalDate getCheckInDate() { return checkInDate; }
    public void setCheckInDate(LocalDate checkInDate) { this.checkInDate = checkInDate; }

    public LocalDate getCheckOutDate() { return checkOutDate; }
    public void setCheckOutDate(LocalDate checkOutDate) { this.checkOutDate = checkOutDate; }

    public Integer getNumberOfGuests() { return numberOfGuests; }
    public void setNumberOfGuests(Integer numberOfGuests) { this.numberOfGuests = numberOfGuests; }

    public BigDecimal getTotalPrice() { return totalPrice; }
    public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }

    public ReservationStatus getReservationStatus() { return reservationStatus; }
    public void setReservationStatus(ReservationStatus reservationStatus) { this.reservationStatus = reservationStatus; }

    public String getSpecialRequests() { return specialRequests; }
    public void setSpecialRequests(String specialRequests) { this.specialRequests = specialRequests; }

    public Payment getPayment() { return payment; }
    public void setPayment(Payment payment) { this.payment = payment; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
