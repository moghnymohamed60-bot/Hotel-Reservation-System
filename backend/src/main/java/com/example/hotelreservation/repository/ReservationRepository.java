package com.example.hotelreservation.repository;

import com.example.hotelreservation.entity.Reservation;
import com.example.hotelreservation.enums.BookingChannel;
import com.example.hotelreservation.enums.ReservationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long>, JpaSpecificationExecutor<Reservation> {

    Optional<Reservation> findByReservationCode(String reservationCode);

    Page<Reservation> findByUserId(Long userId, Pageable pageable);

    List<Reservation> findByUserIdOrderByCreatedAtDesc(Long userId);

    @Query("""
        SELECT r FROM Reservation r
        WHERE r.room.id = :roomId
          AND r.reservationStatus NOT IN :excludedStatuses
          AND r.checkInDate < :checkOutDate
          AND r.checkOutDate > :checkInDate
    """)
    List<Reservation> findOverlappingReservations(
        @Param("roomId") Long roomId,
        @Param("checkInDate") LocalDate checkInDate,
        @Param("checkOutDate") LocalDate checkOutDate,
        @Param("excludedStatuses") Collection<ReservationStatus> excludedStatuses
    );

    long countByReservationStatus(ReservationStatus status);

    @Query("SELECT COUNT(r) FROM Reservation r WHERE r.createdAt BETWEEN :start AND :end")
    long countBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT COUNT(r) FROM Reservation r WHERE r.reservationStatus = :status AND r.createdAt BETWEEN :start AND :end")
    long countByStatusBetween(@Param("status") ReservationStatus status, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT COALESCE(SUM(r.totalPrice), 0) FROM Reservation r WHERE r.reservationStatus IN ('CONFIRMED', 'COMPLETED')")
    BigDecimal calculateTotalRevenue();

    @Query("SELECT COALESCE(SUM(r.totalPrice), 0) FROM Reservation r WHERE r.reservationStatus IN ('CONFIRMED', 'COMPLETED') AND r.createdAt BETWEEN :start AND :end")
    BigDecimal calculateGrossRevenueBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT COALESCE(SUM(r.addOnRevenue), 0) FROM Reservation r WHERE r.reservationStatus IN ('CONFIRMED', 'COMPLETED') AND r.createdAt BETWEEN :start AND :end")
    BigDecimal calculateAddOnRevenueBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT COALESCE(SUM(r.totalPrice), 0) FROM Reservation r WHERE r.reservationStatus = 'CANCELLED' AND r.createdAt BETWEEN :start AND :end")
    BigDecimal calculateCancelledLossBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT r.bookingChannel, COUNT(r), COALESCE(SUM(r.totalPrice), 0) FROM Reservation r WHERE r.createdAt BETWEEN :start AND :end AND r.reservationStatus IN ('CONFIRMED', 'COMPLETED') GROUP BY r.bookingChannel")
    List<Object[]> findRevenueByBookingChannelBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT r.room.roomType, COUNT(r), COALESCE(SUM(r.totalPrice), 0) FROM Reservation r WHERE r.createdAt BETWEEN :start AND :end AND r.reservationStatus IN ('CONFIRMED', 'COMPLETED') GROUP BY r.room.roomType")
    List<Object[]> findRevenueByRoomTypeBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT r FROM Reservation r WHERE r.createdAt BETWEEN :start AND :end ORDER BY r.createdAt DESC")
    List<Reservation> findReservationsBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT r FROM Reservation r ORDER BY r.createdAt DESC")
    List<Reservation> findRecentReservations(Pageable pageable);
}
