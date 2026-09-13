package com.example.hotelreservation.dto.request;

import com.example.hotelreservation.enums.ReservationStatus;
import jakarta.validation.constraints.NotNull;

public class ReservationStatusUpdateRequest {

    @NotNull(message = "Reservation status is required")
    private ReservationStatus status;

    private String reason;

    public ReservationStatusUpdateRequest() {}

    public ReservationStatusUpdateRequest(ReservationStatus status, String reason) {
        this.status = status;
        this.reason = reason;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private ReservationStatus status;
        private String reason;

        public Builder status(ReservationStatus status) { this.status = status; return this; }
        public Builder reason(String reason) { this.reason = reason; return this; }

        public ReservationStatusUpdateRequest build() {
            return new ReservationStatusUpdateRequest(status, reason);
        }
    }

    public ReservationStatus getStatus() { return status; }
    public void setStatus(ReservationStatus status) { this.status = status; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
