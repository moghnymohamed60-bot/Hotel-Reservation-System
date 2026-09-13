package com.example.hotelreservation.dto.response;

import java.util.List;
import java.util.Map;

public class OperationsAnalyticsResponse {

    // Room Status Counts
    private Long totalRooms;
    private Long availableRooms;
    private Long occupiedRooms;
    private Long reservedRooms;
    private Long maintenanceRooms;
    private Long cleaningRooms;
    private Double currentOccupancyPercent;

    // Daily Operational Flow
    private Long checkInsToday;
    private Long checkOutsToday;
    private Long lateCheckOuts;
    private Long openMaintenanceTickets;
    private Long openComplaints;
    private Double averageCheckInMinutes;

    // Room Type Distribution
    private Map<String, Long> roomTypeOccupancy;

    public OperationsAnalyticsResponse() {}

    public OperationsAnalyticsResponse(Long totalRooms, Long availableRooms, Long occupiedRooms, Long reservedRooms,
                                       Long maintenanceRooms, Long cleaningRooms, Double currentOccupancyPercent,
                                       Long checkInsToday, Long checkOutsToday, Long lateCheckOuts, Long openMaintenanceTickets,
                                       Long openComplaints, Double averageCheckInMinutes, Map<String, Long> roomTypeOccupancy) {
        this.totalRooms = totalRooms;
        this.availableRooms = availableRooms;
        this.occupiedRooms = occupiedRooms;
        this.reservedRooms = reservedRooms;
        this.maintenanceRooms = maintenanceRooms;
        this.cleaningRooms = cleaningRooms;
        this.currentOccupancyPercent = currentOccupancyPercent;
        this.checkInsToday = checkInsToday;
        this.checkOutsToday = checkOutsToday;
        this.lateCheckOuts = lateCheckOuts;
        this.openMaintenanceTickets = openMaintenanceTickets;
        this.openComplaints = openComplaints;
        this.averageCheckInMinutes = averageCheckInMinutes;
        this.roomTypeOccupancy = roomTypeOccupancy;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long totalRooms = 0L;
        private Long availableRooms = 0L;
        private Long occupiedRooms = 0L;
        private Long reservedRooms = 0L;
        private Long maintenanceRooms = 0L;
        private Long cleaningRooms = 0L;
        private Double currentOccupancyPercent = 0.0;
        private Long checkInsToday = 0L;
        private Long checkOutsToday = 0L;
        private Long lateCheckOuts = 0L;
        private Long openMaintenanceTickets = 0L;
        private Long openComplaints = 0L;
        private Double averageCheckInMinutes = 0.0;
        private Map<String, Long> roomTypeOccupancy;

        public Builder totalRooms(Long val) { this.totalRooms = val; return this; }
        public Builder availableRooms(Long val) { this.availableRooms = val; return this; }
        public Builder occupiedRooms(Long val) { this.occupiedRooms = val; return this; }
        public Builder reservedRooms(Long val) { this.reservedRooms = val; return this; }
        public Builder maintenanceRooms(Long val) { this.maintenanceRooms = val; return this; }
        public Builder cleaningRooms(Long val) { this.cleaningRooms = val; return this; }
        public Builder currentOccupancyPercent(Double val) { this.currentOccupancyPercent = val; return this; }
        public Builder checkInsToday(Long val) { this.checkInsToday = val; return this; }
        public Builder checkOutsToday(Long val) { this.checkOutsToday = val; return this; }
        public Builder lateCheckOuts(Long val) { this.lateCheckOuts = val; return this; }
        public Builder openMaintenanceTickets(Long val) { this.openMaintenanceTickets = val; return this; }
        public Builder openComplaints(Long val) { this.openComplaints = val; return this; }
        public Builder averageCheckInMinutes(Double val) { this.averageCheckInMinutes = val; return this; }
        public Builder roomTypeOccupancy(Map<String, Long> val) { this.roomTypeOccupancy = val; return this; }

        public OperationsAnalyticsResponse build() {
            return new OperationsAnalyticsResponse(totalRooms, availableRooms, occupiedRooms, reservedRooms,
                    maintenanceRooms, cleaningRooms, currentOccupancyPercent, checkInsToday, checkOutsToday,
                    lateCheckOuts, openMaintenanceTickets, openComplaints, averageCheckInMinutes, roomTypeOccupancy);
        }
    }

    // Getters and Setters
    public Long getTotalRooms() { return totalRooms; }
    public void setTotalRooms(Long totalRooms) { this.totalRooms = totalRooms; }

    public Long getAvailableRooms() { return availableRooms; }
    public void setAvailableRooms(Long availableRooms) { this.availableRooms = availableRooms; }

    public Long getOccupiedRooms() { return occupiedRooms; }
    public void setOccupiedRooms(Long occupiedRooms) { this.occupiedRooms = occupiedRooms; }

    public Long getReservedRooms() { return reservedRooms; }
    public void setReservedRooms(Long reservedRooms) { this.reservedRooms = reservedRooms; }

    public Long getMaintenanceRooms() { return maintenanceRooms; }
    public void setMaintenanceRooms(Long maintenanceRooms) { this.maintenanceRooms = maintenanceRooms; }

    public Long getCleaningRooms() { return cleaningRooms; }
    public void setCleaningRooms(Long cleaningRooms) { this.cleaningRooms = cleaningRooms; }

    public Double getCurrentOccupancyPercent() { return currentOccupancyPercent; }
    public void setCurrentOccupancyPercent(Double currentOccupancyPercent) { this.currentOccupancyPercent = currentOccupancyPercent; }

    public Long getCheckInsToday() { return checkInsToday; }
    public void setCheckInsToday(Long checkInsToday) { this.checkInsToday = checkInsToday; }

    public Long getCheckOutsToday() { return checkOutsToday; }
    public void setCheckOutsToday(Long checkOutsToday) { this.checkOutsToday = checkOutsToday; }

    public Long getLateCheckOuts() { return lateCheckOuts; }
    public void setLateCheckOuts(Long lateCheckOuts) { this.lateCheckOuts = lateCheckOuts; }

    public Long getOpenMaintenanceTickets() { return openMaintenanceTickets; }
    public void setOpenMaintenanceTickets(Long openMaintenanceTickets) { this.openMaintenanceTickets = openMaintenanceTickets; }

    public Long getOpenComplaints() { return openComplaints; }
    public void setOpenComplaints(Long openComplaints) { this.openComplaints = openComplaints; }

    public Double getAverageCheckInMinutes() { return averageCheckInMinutes; }
    public void setAverageCheckInMinutes(Double averageCheckInMinutes) { this.averageCheckInMinutes = averageCheckInMinutes; }

    public Map<String, Long> getRoomTypeOccupancy() { return roomTypeOccupancy; }
    public void setRoomTypeOccupancy(Map<String, Long> roomTypeOccupancy) { this.roomTypeOccupancy = roomTypeOccupancy; }
}
