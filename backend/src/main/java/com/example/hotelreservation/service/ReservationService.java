package com.example.hotelreservation.service;

import com.example.hotelreservation.dto.request.ReservationRequest;
import com.example.hotelreservation.dto.request.ReservationStatusUpdateRequest;
import com.example.hotelreservation.dto.response.ReservationResponse;
import com.example.hotelreservation.entity.Payment;
import com.example.hotelreservation.entity.Reservation;
import com.example.hotelreservation.entity.Room;
import com.example.hotelreservation.entity.User;
import com.example.hotelreservation.enums.PaymentStatus;
import com.example.hotelreservation.enums.ReservationStatus;
import com.example.hotelreservation.enums.Role;
import com.example.hotelreservation.enums.RoomStatus;
import com.example.hotelreservation.exception.InvalidReservationException;
import com.example.hotelreservation.exception.ResourceNotFoundException;
import com.example.hotelreservation.exception.RoomNotAvailableException;
import com.example.hotelreservation.exception.UnauthorizedActionException;
import com.example.hotelreservation.mapper.ReservationMapper;
import com.example.hotelreservation.repository.ReservationRepository;
import com.example.hotelreservation.repository.RoomRepository;
import com.example.hotelreservation.repository.UserRepository;
import com.example.hotelreservation.security.UserPrincipal;
import com.example.hotelreservation.specification.ReservationSpecification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final PaymentService paymentService;
    private final ReservationMapper reservationMapper;

    private static final List<ReservationStatus> EXCLUDED_OVERLAP_STATUSES = Arrays.asList(
            ReservationStatus.CANCELLED,
            ReservationStatus.REJECTED
    );

    @Autowired
    public ReservationService(
            ReservationRepository reservationRepository,
            RoomRepository roomRepository,
            UserRepository userRepository,
            PaymentService paymentService,
            ReservationMapper reservationMapper
    ) {
        this.reservationRepository = reservationRepository;
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
        this.paymentService = paymentService;
        this.reservationMapper = reservationMapper;
    }

    @Transactional(isolation = Isolation.SERIALIZABLE)
    public ReservationResponse createReservation(ReservationRequest request, UserPrincipal currentUser) {
        if (currentUser == null) {
            throw new UnauthorizedActionException("Authentication required to create a reservation");
        }

        // 1. Validate check-in & check-out dates
        LocalDate checkIn = request.getCheckInDate();
        LocalDate checkOut = request.getCheckOutDate();

        if (checkIn == null || checkOut == null) {
            throw new InvalidReservationException("Check-in and check-out dates must not be null");
        }

        if (checkIn.isBefore(LocalDate.now())) {
            throw new InvalidReservationException("Check-in date cannot be in the past");
        }

        if (!checkOut.isAfter(checkIn)) {
            throw new InvalidReservationException("Check-out date must be after check-in date");
        }

        // 2. Fetch User & Room
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", currentUser.getId()));

        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room", "id", request.getRoomId()));

        // 3. Verify Room Operational Status
        if (room.getStatus() == RoomStatus.MAINTENANCE || room.getStatus() == RoomStatus.INACTIVE) {
            throw new RoomNotAvailableException("Room " + room.getRoomNumber() + " is currently under maintenance or inactive");
        }

        // 4. Validate Guest Capacity
        if (request.getNumberOfGuests() > room.getCapacity()) {
            throw new InvalidReservationException(
                    String.format("Requested %d guests exceeds room capacity of %d", request.getNumberOfGuests(), room.getCapacity())
            );
        }

        // 5. Anti Double-Booking Check (Atomic within SERIALIZABLE transaction)
        List<Reservation> overlapping = reservationRepository.findOverlappingReservations(
                room.getId(),
                checkIn,
                checkOut,
                EXCLUDED_OVERLAP_STATUSES
        );

        if (!overlapping.isEmpty()) {
            throw new RoomNotAvailableException(
                    String.format("Room %s is already booked from %s to %s. Please select different dates or another room.",
                            room.getRoomNumber(), checkIn, checkOut)
            );
        }

        // 6. Calculate Pricing (Server-side authoritative calculation)
        long nights = ChronoUnit.DAYS.between(checkIn, checkOut);
        if (nights <= 0) nights = 1;
        BigDecimal totalPrice = room.getPricePerNight().multiply(BigDecimal.valueOf(nights));

        // 7. Generate Unique Reservation Code
        String reservationCode = generateUniqueReservationCode();

        // 8. Create Reservation entity
        Reservation reservation = Reservation.builder()
                .reservationCode(reservationCode)
                .user(user)
                .room(room)
                .checkInDate(checkIn)
                .checkOutDate(checkOut)
                .numberOfGuests(request.getNumberOfGuests())
                .totalPrice(totalPrice)
                .reservationStatus(ReservationStatus.CONFIRMED)
                .specialRequests(request.getSpecialRequests())
                .build();

        Reservation savedReservation = reservationRepository.save(reservation);

        // 9. Process and Attach Simulated Payment
        Payment payment = paymentService.processPayment(
                savedReservation,
                request.getPaymentMethod(),
                totalPrice
        );
        savedReservation.setPayment(payment);

        return reservationMapper.toResponse(savedReservation);
    }

    @Transactional(readOnly = true)
    public Page<ReservationResponse> getReservations(
            Long hotelId,
            Long roomId,
            ReservationStatus status,
            LocalDate startDate,
            LocalDate endDate,
            Pageable pageable,
            UserPrincipal currentUser
    ) {
        Long filterUserId = null;
        // If customer, only show own reservations
        if (currentUser.getRole() == Role.CUSTOMER) {
            filterUserId = currentUser.getId();
        }

        Specification<Reservation> spec = ReservationSpecification.filterReservations(
                filterUserId,
                hotelId,
                roomId,
                status,
                startDate,
                endDate
        );

        return reservationRepository.findAll(spec, pageable).map(reservationMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public List<ReservationResponse> getMyReservations(UserPrincipal currentUser) {
        if (currentUser == null) {
            throw new UnauthorizedActionException("Authentication required");
        }
        return reservationRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId())
                .stream()
                .map(reservationMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ReservationResponse getReservationById(Long id, UserPrincipal currentUser) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation", "id", id));

        validateAccessPermission(reservation, currentUser);

        return reservationMapper.toResponse(reservation);
    }

    @Transactional(readOnly = true)
    public ReservationResponse getReservationByCode(String code, UserPrincipal currentUser) {
        Reservation reservation = reservationRepository.findByReservationCode(code.trim().toUpperCase())
                .orElseThrow(() -> new ResourceNotFoundException("Reservation", "code", code));

        validateAccessPermission(reservation, currentUser);

        return reservationMapper.toResponse(reservation);
    }

    @Transactional
    public ReservationResponse cancelReservation(Long id, UserPrincipal currentUser) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation", "id", id));

        validateAccessPermission(reservation, currentUser);

        if (reservation.getReservationStatus() == ReservationStatus.CANCELLED) {
            throw new InvalidReservationException("Reservation is already cancelled");
        }

        if (reservation.getReservationStatus() == ReservationStatus.COMPLETED) {
            throw new InvalidReservationException("Cannot cancel a completed reservation");
        }

        reservation.setReservationStatus(ReservationStatus.CANCELLED);

        // Refund payment if already paid
        if (reservation.getPayment() != null && reservation.getPayment().getPaymentStatus() == PaymentStatus.PAID) {
            reservation.getPayment().setPaymentStatus(PaymentStatus.REFUNDED);
        }

        Reservation updated = reservationRepository.save(reservation);
        return reservationMapper.toResponse(updated);
    }

    @Transactional
    public ReservationResponse updateReservationStatus(Long id, ReservationStatusUpdateRequest request, UserPrincipal currentUser) {
        if (currentUser.getRole() != Role.ADMIN && currentUser.getRole() != Role.STAFF) {
            throw new UnauthorizedActionException("Only staff and administrators can modify reservation statuses");
        }

        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation", "id", id));

        reservation.setReservationStatus(request.getStatus());

        if (request.getStatus() == ReservationStatus.CANCELLED && reservation.getPayment() != null) {
            reservation.getPayment().setPaymentStatus(PaymentStatus.REFUNDED);
        }

        Reservation updated = reservationRepository.save(reservation);
        return reservationMapper.toResponse(updated);
    }

    private void validateAccessPermission(Reservation reservation, UserPrincipal currentUser) {
        if (currentUser.getRole() == Role.CUSTOMER && !reservation.getUser().getId().equals(currentUser.getId())) {
            throw new UnauthorizedActionException("You are not authorized to view or manage this reservation");
        }
    }

    private String generateUniqueReservationCode() {
        SecureRandom random = new SecureRandom();
        int year = LocalDate.now().getYear();
        String code;
        do {
            int randomNum = 100000 + random.nextInt(900000);
            code = String.format("HTL-%d-%06d", year, randomNum);
        } while (reservationRepository.findByReservationCode(code).isPresent());
        return code;
    }
}
