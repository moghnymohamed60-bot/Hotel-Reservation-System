package com.example.hotelreservation.service;

import com.example.hotelreservation.dto.response.PaymentResponse;
import com.example.hotelreservation.entity.Payment;
import com.example.hotelreservation.entity.Reservation;
import com.example.hotelreservation.enums.PaymentMethod;
import com.example.hotelreservation.enums.PaymentStatus;
import com.example.hotelreservation.mapper.PaymentMapper;
import com.example.hotelreservation.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final PaymentMapper paymentMapper;

    @Autowired
    public PaymentService(PaymentRepository paymentRepository, PaymentMapper paymentMapper) {
        this.paymentRepository = paymentRepository;
        this.paymentMapper = paymentMapper;
    }

    @Transactional
    public Payment processPayment(Reservation reservation, PaymentMethod paymentMethod, BigDecimal amount) {
        // Generate a unique transaction reference
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String randomSuffix = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        String prefix = switch (paymentMethod) {
            case CARD -> "TXN-CARD";
            case ONLINE -> "TXN-ONL";
            case CASH -> "TXN-CSH";
        };
        String transactionReference = String.format("%s-%s-%s", prefix, timestamp, randomSuffix);

        // Simulated payment status
        PaymentStatus initialStatus = paymentMethod == PaymentMethod.CASH ?
                PaymentStatus.PENDING : PaymentStatus.PAID;

        Payment payment = Payment.builder()
                .reservation(reservation)
                .amount(amount)
                .paymentMethod(paymentMethod)
                .paymentStatus(initialStatus)
                .transactionReference(transactionReference)
                .build();

        return paymentRepository.save(payment);
    }

    @Transactional
    public PaymentResponse updatePaymentStatus(Long paymentId, PaymentStatus status) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new IllegalArgumentException("Payment not found with id: " + paymentId));
        payment.setPaymentStatus(status);
        Payment updated = paymentRepository.save(payment);
        return paymentMapper.toResponse(updated);
    }
}
