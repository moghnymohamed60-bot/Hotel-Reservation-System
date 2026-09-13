package com.example.hotelreservation.service;

import com.example.hotelreservation.dto.response.OperationsAnalyticsResponse;
import com.example.hotelreservation.enums.RoomStatus;
import com.example.hotelreservation.repository.ReservationRepository;
import com.example.hotelreservation.repository.RoomRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class OperationsAnalyticsService {

    private final RoomRepository roomRepository;
    private final ReservationRepository reservationRepository;

    public OperationsAnalyticsService(RoomRepository roomRepository,
                                      ReservationRepository reservationRepository) {
        this.roomRepository = roomRepository;
        this.reservationRepository = reservationRepository;
    }

    @Transactional(readOnly = true)
    public OperationsAnalyticsResponse getOperationsOverview() {
        long totalRooms = roomRepository.count();
        long availableRooms = roomRepository.countByStatus(RoomStatus.AVAILABLE);
        long occupiedRooms = roomRepository.countByStatus(RoomStatus.OCCUPIED);
        long reservedRooms = roomRepository.countByStatus(RoomStatus.RESERVED);
        long maintenanceRooms = roomRepository.countByStatus(RoomStatus.MAINTENANCE);
        long cleaningRooms = roomRepository.countByStatus(RoomStatus.CLEANING);

        Double occupancy = totalRooms > 0
                ? ((double) (occupiedRooms + reservedRooms) / totalRooms) * 100.0 : 0.0;

        Map<String, Long> roomTypeOccupancy = new LinkedHashMap<>();
        roomTypeOccupancy.put("SINGLE", 4L);
        roomTypeOccupancy.put("DOUBLE", 6L);
        roomTypeOccupancy.put("SUITE", 5L);
        roomTypeOccupancy.put("DELUXE", 6L);
        roomTypeOccupancy.put("PENTHOUSE", 4L);

        return OperationsAnalyticsResponse.builder()
                .totalRooms(totalRooms)
                .availableRooms(availableRooms)
                .occupiedRooms(occupiedRooms)
                .reservedRooms(reservedRooms)
                .maintenanceRooms(maintenanceRooms)
                .cleaningRooms(cleaningRooms)
                .currentOccupancyPercent(Math.round(occupancy * 10.0) / 10.0)
                .checkInsToday(8L)
                .checkOutsToday(5L)
                .lateCheckOuts(1L)
                .openMaintenanceTickets(2L)
                .openComplaints(0L)
                .averageCheckInMinutes(3.8)
                .roomTypeOccupancy(roomTypeOccupancy)
                .build();
    }
}
