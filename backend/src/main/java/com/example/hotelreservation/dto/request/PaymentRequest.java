package com.example.hotelreservation.dto.request;

import com.example.hotelreservation.enums.PaymentMethod;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class PaymentRequest {

    @NotNull(message = "Reservation ID is required")
    private Long reservationId;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be positive")
    private BigDecimal amount;

    @NotNull(message = "Payment method is required")
    private PaymentMethod paymentMethod;

    public PaymentRequest() {}

    public PaymentRequest(Long reservationId, BigDecimal amount, PaymentMethod paymentMethod) {
        this.reservationId = reservationId;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long reservationId;
        private BigDecimal amount;
        private PaymentMethod paymentMethod;

        public Builder reservationId(Long reservationId) { this.reservationId = reservationId; return this; }
        public Builder amount(BigDecimal amount) { this.amount = amount; return this; }
        public Builder paymentMethod(PaymentMethod paymentMethod) { this.paymentMethod = paymentMethod; return this; }

        public PaymentRequest build() {
            return new PaymentRequest(reservationId, amount, paymentMethod);
        }
    }

    public Long getReservationId() { return reservationId; }
    public void setReservationId(Long reservationId) { this.reservationId = reservationId; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public PaymentMethod getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(PaymentMethod paymentMethod) { this.paymentMethod = paymentMethod; }
}
