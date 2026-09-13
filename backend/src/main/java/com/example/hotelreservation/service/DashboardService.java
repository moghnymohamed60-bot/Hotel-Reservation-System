package com.example.hotelreservation.service;

import com.example.hotelreservation.dto.response.DashboardStatsResponse;
import com.example.hotelreservation.dto.response.ReservationResponse;
import com.example.hotelreservation.enums.ReservationStatus;
import com.example.hotelreservation.enums.Role;
import com.example.hotelreservation.enums.RoomStatus;
import com.example.hotelreservation.enums.RoomType;
import com.example.hotelreservation.mapper.ReservationMapper;
import com.example.hotelreservation.repository.HotelRepository;
import com.example.hotelreservation.repository.ReservationRepository;
import com.example.hotelreservation.repository.RoomRepository;
import com.example.hotelreservation.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final HotelRepository hotelRepository;
    private final RoomRepository roomRepository;
    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final ReservationMapper reservationMapper;

    @Autowired
    public DashboardService(
            HotelRepository hotelRepository,
            RoomRepository roomRepository,
            ReservationRepository reservationRepository,
            UserRepository userRepository,
            ReservationMapper reservationMapper
    ) {
        this.hotelRepository = hotelRepository;
        this.roomRepository = roomRepository;
        this.reservationRepository = reservationRepository;
        this.userRepository = userRepository;
        this.reservationMapper = reservationMapper;
    }

    @Transactional(readOnly = true)
    public DashboardStatsResponse getDashboardStatistics() {
        long totalHotels = hotelRepository.count();
        long totalRooms = roomRepository.count();
        long availableRooms = roomRepository.countByStatus(RoomStatus.AVAILABLE);

        long totalUsers = userRepository.count();
        long totalCustomers = userRepository.countByRole(Role.CUSTOMER);
        long totalStaff = userRepository.countByRole(Role.STAFF);

        long totalReservations = reservationRepository.count();
        long pending = reservationRepository.countByReservationStatus(ReservationStatus.PENDING);
        long confirmed = reservationRepository.countByReservationStatus(ReservationStatus.CONFIRMED);
        long cancelled = reservationRepository.countByReservationStatus(ReservationStatus.CANCELLED);
        long completed = reservationRepository.countByReservationStatus(ReservationStatus.COMPLETED);

        BigDecimal totalRevenue = reservationRepository.calculateTotalRevenue();

        double occupancyRate = totalRooms > 0 ?
                ((double) (totalRooms - availableRooms) / totalRooms) * 100.0 : 0.0;

        List<ReservationResponse> recentReservations = reservationRepository
                .findRecentReservations(PageRequest.of(0, 5))
                .stream()
                .map(reservationMapper::toResponse)
                .collect(Collectors.toList());

        Map<String, Long> reservationsByStatus = new HashMap<>();
        for (ReservationStatus status : ReservationStatus.values()) {
            reservationsByStatus.put(status.name(), reservationRepository.countByReservationStatus(status));
        }

        Map<String, Long> roomsByType = new HashMap<>();
        for (RoomType type : RoomType.values()) {
            roomsByType.put(type.name(), (long) roomRepository.findAll((root, query, cb) -> cb.equal(root.get("roomType"), type)).size());
        }

        return DashboardStatsResponse.builder()
                .totalHotels(totalHotels)
                .totalRooms(totalRooms)
                .totalAvailableRooms(availableRooms)
                .totalUsers(totalUsers)
                .totalCustomers(totalCustomers)
                .totalStaff(totalStaff)
                .totalReservations(totalReservations)
                .pendingReservations(pending)
                .confirmedReservations(confirmed)
                .cancelledReservations(cancelled)
                .completedReservations(completed)
                .totalRevenue(totalRevenue != null ? totalRevenue : BigDecimal.ZERO)
                .occupancyRatePercentage(Math.round(occupancyRate * 10.0) / 10.0)
                .recentReservations(recentReservations)
                .reservationsByStatus(reservationsByStatus)
                .roomsByType(roomsByType)
                .build();
    }
}
