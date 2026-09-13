package com.example.hotelreservation.mapper;

import com.example.hotelreservation.dto.response.PaymentResponse;
import com.example.hotelreservation.entity.Payment;
import org.springframework.stereotype.Component;

@Component
public class PaymentMapper {

    public PaymentResponse toResponse(Payment payment) {
        if (payment == null) {
            return null;
        }
        return PaymentResponse.builder()
                .id(payment.getId())
                .reservationId(payment.getReservation() != null ? payment.getReservation().getId() : null)
                .amount(payment.getAmount())
                .paymentStatus(payment.getPaymentStatus())
                .paymentMethod(payment.getPaymentMethod())
                .transactionReference(payment.getTransactionReference())
                .createdAt(payment.getCreatedAt())
                .build();
    }
}
