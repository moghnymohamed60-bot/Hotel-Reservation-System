package com.example.hotelreservation.repository;

import com.example.hotelreservation.entity.Reservation;
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

    @Query("SELECT COALESCE(SUM(r.totalPrice), 0) FROM Reservation r WHERE r.reservationStatus IN ('CONFIRMED', 'COMPLETED')")
    BigDecimal calculateTotalRevenue();

    @Query("SELECT r FROM Reservation r ORDER BY r.createdAt DESC")
    List<Reservation> findRecentReservations(Pageable pageable);
}
