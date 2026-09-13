package com.example.hotelreservation.dto.response;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class DashboardStatsResponse {

    private long totalHotels;
    private long totalRooms;
    private long totalAvailableRooms;
    private long totalUsers;
    private long totalCustomers;
    private long totalStaff;
    private long totalReservations;
    private long pendingReservations;
    private long confirmedReservations;
    private long cancelledReservations;
    private long completedReservations;
    private BigDecimal totalRevenue;
    private double occupancyRatePercentage;
    private List<ReservationResponse> recentReservations;
    private Map<String, Long> reservationsByStatus;
    private Map<String, Long> roomsByType;

    public DashboardStatsResponse() {}

    public DashboardStatsResponse(long totalHotels, long totalRooms, long totalAvailableRooms, long totalUsers, long totalCustomers, long totalStaff, long totalReservations, long pendingReservations, long confirmedReservations, long cancelledReservations, long completedReservations, BigDecimal totalRevenue, double occupancyRatePercentage, List<ReservationResponse> recentReservations, Map<String, Long> reservationsByStatus, Map<String, Long> roomsByType) {
        this.totalHotels = totalHotels;
        this.totalRooms = totalRooms;
        this.totalAvailableRooms = totalAvailableRooms;
        this.totalUsers = totalUsers;
        this.totalCustomers = totalCustomers;
        this.totalStaff = totalStaff;
        this.totalReservations = totalReservations;
        this.pendingReservations = pendingReservations;
        this.confirmedReservations = confirmedReservations;
        this.cancelledReservations = cancelledReservations;
        this.completedReservations = completedReservations;
        this.totalRevenue = totalRevenue;
        this.occupancyRatePercentage = occupancyRatePercentage;
        this.recentReservations = recentReservations;
        this.reservationsByStatus = reservationsByStatus;
        this.roomsByType = roomsByType;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private long totalHotels;
        private long totalRooms;
        private long totalAvailableRooms;
        private long totalUsers;
        private long totalCustomers;
        private long totalStaff;
        private long totalReservations;
        private long pendingReservations;
        private long confirmedReservations;
        private long cancelledReservations;
        private long completedReservations;
        private BigDecimal totalRevenue;
        private double occupancyRatePercentage;
        private List<ReservationResponse> recentReservations;
        private Map<String, Long> reservationsByStatus;
        private Map<String, Long> roomsByType;

        public Builder totalHotels(long totalHotels) { this.totalHotels = totalHotels; return this; }
        public Builder totalRooms(long totalRooms) { this.totalRooms = totalRooms; return this; }
        public Builder totalAvailableRooms(long totalAvailableRooms) { this.totalAvailableRooms = totalAvailableRooms; return this; }
        public Builder totalUsers(long totalUsers) { this.totalUsers = totalUsers; return this; }
        public Builder totalCustomers(long totalCustomers) { this.totalCustomers = totalCustomers; return this; }
        public Builder totalStaff(long totalStaff) { this.totalStaff = totalStaff; return this; }
        public Builder totalReservations(long totalReservations) { this.totalReservations = totalReservations; return this; }
        public Builder pendingReservations(long pendingReservations) { this.pendingReservations = pendingReservations; return this; }
        public Builder confirmedReservations(long confirmedReservations) { this.confirmedReservations = confirmedReservations; return this; }
        public Builder cancelledReservations(long cancelledReservations) { this.cancelledReservations = cancelledReservations; return this; }
        public Builder completedReservations(long completedReservations) { this.completedReservations = completedReservations; return this; }
        public Builder totalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; return this; }
        public Builder occupancyRatePercentage(double occupancyRatePercentage) { this.occupancyRatePercentage = occupancyRatePercentage; return this; }
        public Builder recentReservations(List<ReservationResponse> recentReservations) { this.recentReservations = recentReservations; return this; }
        public Builder reservationsByStatus(Map<String, Long> reservationsByStatus) { this.reservationsByStatus = reservationsByStatus; return this; }
        public Builder roomsByType(Map<String, Long> roomsByType) { this.roomsByType = roomsByType; return this; }

        public DashboardStatsResponse build() {
            return new DashboardStatsResponse(totalHotels, totalRooms, totalAvailableRooms, totalUsers, totalCustomers, totalStaff, totalReservations, pendingReservations, confirmedReservations, cancelledReservations, completedReservations, totalRevenue, occupancyRatePercentage, recentReservations, reservationsByStatus, roomsByType);
        }
    }

    // Getters and Setters
    public long getTotalHotels() { return totalHotels; }
    public void setTotalHotels(long totalHotels) { this.totalHotels = totalHotels; }

    public long getTotalRooms() { return totalRooms; }
    public void setTotalRooms(long totalRooms) { this.totalRooms = totalRooms; }

    public long getTotalAvailableRooms() { return totalAvailableRooms; }
    public void setTotalAvailableRooms(long totalAvailableRooms) { this.totalAvailableRooms = totalAvailableRooms; }

    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }

    public long getTotalCustomers() { return totalCustomers; }
    public void setTotalCustomers(long totalCustomers) { this.totalCustomers = totalCustomers; }

    public long getTotalStaff() { return totalStaff; }
    public void setTotalStaff(long totalStaff) { this.totalStaff = totalStaff; }

    public long getTotalReservations() { return totalReservations; }
    public void setTotalReservations(long totalReservations) { this.totalReservations = totalReservations; }

    public long getPendingReservations() { return pendingReservations; }
    public void setPendingReservations(long pendingReservations) { this.pendingReservations = pendingReservations; }

    public long getConfirmedReservations() { return confirmedReservations; }
    public void setConfirmedReservations(long confirmedReservations) { this.confirmedReservations = confirmedReservations; }

    public long getCancelledReservations() { return cancelledReservations; }
    public void setCancelledReservations(long cancelledReservations) { this.cancelledReservations = cancelledReservations; }

    public long getCompletedReservations() { return completedReservations; }
    public void setCompletedReservations(long completedReservations) { this.completedReservations = completedReservations; }

    public BigDecimal getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }

    public double getOccupancyRatePercentage() { return occupancyRatePercentage; }
    public void setOccupancyRatePercentage(double occupancyRatePercentage) { this.occupancyRatePercentage = occupancyRatePercentage; }

    public List<ReservationResponse> getRecentReservations() { return recentReservations; }
    public void setRecentReservations(List<ReservationResponse> recentReservations) { this.recentReservations = recentReservations; }

    public Map<String, Long> getReservationsByStatus() { return reservationsByStatus; }
    public void setReservationsByStatus(Map<String, Long> reservationsByStatus) { this.reservationsByStatus = reservationsByStatus; }

    public Map<String, Long> getRoomsByType() { return roomsByType; }
    public void setRoomsByType(Map<String, Long> roomsByType) { this.roomsByType = roomsByType; }
}
