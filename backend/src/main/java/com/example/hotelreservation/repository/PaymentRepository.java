package com.example.hotelreservation.repository;

import com.example.hotelreservation.entity.Payment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long>, JpaSpecificationExecutor<Payment> {

    Optional<Payment> findByReservationId(Long reservationId);

    Optional<Payment> findByTransactionReference(String transactionReference);

    Page<Payment> findAllByOrderByCreatedAtDesc(Pageable pageable);

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.paymentStatus = 'PAID' AND p.createdAt BETWEEN :start AND :end")
    BigDecimal sumPaidAmountBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT COALESCE(SUM(p.gatewayFee), 0) FROM Payment p WHERE p.paymentStatus = 'PAID' AND p.createdAt BETWEEN :start AND :end")
    BigDecimal sumGatewayFeesBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT COALESCE(SUM(p.refundAmount), 0) FROM Payment p WHERE p.paymentStatus = 'REFUNDED' OR p.refundAmount > 0 AND p.createdAt BETWEEN :start AND :end")
    BigDecimal sumRefundAmountBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT p.paymentMethod, COUNT(p), COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.paymentStatus = 'PAID' AND p.createdAt BETWEEN :start AND :end GROUP BY p.paymentMethod")
    List<Object[]> sumGroupedByPaymentMethodBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT p FROM Payment p WHERE p.createdAt BETWEEN :start AND :end ORDER BY p.createdAt DESC")
    List<Payment> findPaymentsBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}
