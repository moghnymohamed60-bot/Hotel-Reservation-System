package com.example.hotelreservation.dto.response;

import java.util.Map;

public class SystemHealthResponse {

    private String serverStatus; // UP, DEGRADED, DOWN
    private String databaseStatus; // CONNECTED, LATENCY_SPIKE, DISCONNECTED
    private String paymentGatewayStatus; // ONLINE, SLOW, DOWN
    private String otaSyncStatus; // SYNCHRONIZED, PARTIAL, OUT_OF_SYNC
    private Double uptimeHours;
    private Long jvmUsedMemoryMb;
    private Long jvmMaxMemoryMb;
    private Double jvmMemoryUsagePercent;
    private Double apiResponseLatencyMs;
    private Long totalApiRequests;
    private Double errorRatePercent;
    private Long activeUserSessions;
    private Long failedLoginAttempts;

    public SystemHealthResponse() {}

    public SystemHealthResponse(String serverStatus, String databaseStatus, String paymentGatewayStatus, String otaSyncStatus,
                                Double uptimeHours, Long jvmUsedMemoryMb, Long jvmMaxMemoryMb, Double jvmMemoryUsagePercent,
                                Double apiResponseLatencyMs, Long totalApiRequests, Double errorRatePercent,
                                Long activeUserSessions, Long failedLoginAttempts) {
        this.serverStatus = serverStatus;
        this.databaseStatus = databaseStatus;
        this.paymentGatewayStatus = paymentGatewayStatus;
        this.otaSyncStatus = otaSyncStatus;
        this.uptimeHours = uptimeHours;
        this.jvmUsedMemoryMb = jvmUsedMemoryMb;
        this.jvmMaxMemoryMb = jvmMaxMemoryMb;
        this.jvmMemoryUsagePercent = jvmMemoryUsagePercent;
        this.apiResponseLatencyMs = apiResponseLatencyMs;
        this.totalApiRequests = totalApiRequests;
        this.errorRatePercent = errorRatePercent;
        this.activeUserSessions = activeUserSessions;
        this.failedLoginAttempts = failedLoginAttempts;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String serverStatus = "UP";
        private String databaseStatus = "CONNECTED";
        private String paymentGatewayStatus = "ONLINE";
        private String otaSyncStatus = "SYNCHRONIZED";
        private Double uptimeHours = 99.98;
        private Long jvmUsedMemoryMb = 256L;
        private Long jvmMaxMemoryMb = 1024L;
        private Double jvmMemoryUsagePercent = 25.0;
        private Double apiResponseLatencyMs = 18.5;
        private Long totalApiRequests = 12450L;
        private Double errorRatePercent = 0.04;
        private Long activeUserSessions = 84L;
        private Long failedLoginAttempts = 2L;

        public Builder serverStatus(String val) { this.serverStatus = val; return this; }
        public Builder databaseStatus(String val) { this.databaseStatus = val; return this; }
        public Builder paymentGatewayStatus(String val) { this.paymentGatewayStatus = val; return this; }
        public Builder otaSyncStatus(String val) { this.otaSyncStatus = val; return this; }
        public Builder uptimeHours(Double val) { this.uptimeHours = val; return this; }
        public Builder jvmUsedMemoryMb(Long val) { this.jvmUsedMemoryMb = val; return this; }
        public Builder jvmMaxMemoryMb(Long val) { this.jvmMaxMemoryMb = val; return this; }
        public Builder jvmMemoryUsagePercent(Double val) { this.jvmMemoryUsagePercent = val; return this; }
        public Builder apiResponseLatencyMs(Double val) { this.apiResponseLatencyMs = val; return this; }
        public Builder totalApiRequests(Long val) { this.totalApiRequests = val; return this; }
        public Builder errorRatePercent(Double val) { this.errorRatePercent = val; return this; }
        public Builder activeUserSessions(Long val) { this.activeUserSessions = val; return this; }
        public Builder failedLoginAttempts(Long val) { this.failedLoginAttempts = val; return this; }

        public SystemHealthResponse build() {
            return new SystemHealthResponse(serverStatus, databaseStatus, paymentGatewayStatus, otaSyncStatus,
                    uptimeHours, jvmUsedMemoryMb, jvmMaxMemoryMb, jvmMemoryUsagePercent, apiResponseLatencyMs,
                    totalApiRequests, errorRatePercent, activeUserSessions, failedLoginAttempts);
        }
    }

    // Getters and Setters
    public String getServerStatus() { return serverStatus; }
    public void setServerStatus(String serverStatus) { this.serverStatus = serverStatus; }

    public String getDatabaseStatus() { return databaseStatus; }
    public void setDatabaseStatus(String databaseStatus) { this.databaseStatus = databaseStatus; }

    public String getPaymentGatewayStatus() { return paymentGatewayStatus; }
    public void setPaymentGatewayStatus(String paymentGatewayStatus) { this.paymentGatewayStatus = paymentGatewayStatus; }

    public String getOtaSyncStatus() { return otaSyncStatus; }
    public void setOtaSyncStatus(String otaSyncStatus) { this.otaSyncStatus = otaSyncStatus; }

    public Double getUptimeHours() { return uptimeHours; }
    public void setUptimeHours(Double uptimeHours) { this.uptimeHours = uptimeHours; }

    public Long getJvmUsedMemoryMb() { return jvmUsedMemoryMb; }
    public void setJvmUsedMemoryMb(Long jvmUsedMemoryMb) { this.jvmUsedMemoryMb = jvmUsedMemoryMb; }

    public Long getJvmMaxMemoryMb() { return jvmMaxMemoryMb; }
    public void setJvmMaxMemoryMb(Long jvmMaxMemoryMb) { this.jvmMaxMemoryMb = jvmMaxMemoryMb; }

    public Double getJvmMemoryUsagePercent() { return jvmMemoryUsagePercent; }
    public void setJvmMemoryUsagePercent(Double jvmMemoryUsagePercent) { this.jvmMemoryUsagePercent = jvmMemoryUsagePercent; }

    public Double getApiResponseLatencyMs() { return apiResponseLatencyMs; }
    public void setApiResponseLatencyMs(Double apiResponseLatencyMs) { this.apiResponseLatencyMs = apiResponseLatencyMs; }

    public Long getTotalApiRequests() { return totalApiRequests; }
    public void setTotalApiRequests(Long totalApiRequests) { this.totalApiRequests = totalApiRequests; }

    public Double getErrorRatePercent() { return errorRatePercent; }
    public void setErrorRatePercent(Double errorRatePercent) { this.errorRatePercent = errorRatePercent; }

    public Long getActiveUserSessions() { return activeUserSessions; }
    public void setActiveUserSessions(Long activeUserSessions) { this.activeUserSessions = activeUserSessions; }

    public Long getFailedLoginAttempts() { return failedLoginAttempts; }
    public void setFailedLoginAttempts(Long failedLoginAttempts) { this.failedLoginAttempts = failedLoginAttempts; }
}
