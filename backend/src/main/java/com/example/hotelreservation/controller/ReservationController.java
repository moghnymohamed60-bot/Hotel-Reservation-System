package com.example.hotelreservation.controller;

import com.example.hotelreservation.dto.request.ReservationRequest;
import com.example.hotelreservation.dto.request.ReservationStatusUpdateRequest;
import com.example.hotelreservation.dto.response.ApiResponse;
import com.example.hotelreservation.dto.response.ReservationResponse;
import com.example.hotelreservation.enums.ReservationStatus;
import com.example.hotelreservation.security.UserPrincipal;
import com.example.hotelreservation.service.ReservationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@Tag(name = "Reservations", description = "Endpoints for booking rooms, managing lifecycle, and tracking history")
public class ReservationController {

    private final ReservationService reservationService;

    @Autowired
    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @PostMapping
    @Operation(summary = "Create a new reservation with anti-double-booking validation")
    public ResponseEntity<ApiResponse<ReservationResponse>> createReservation(
            @Valid @RequestBody ReservationRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        ReservationResponse created = reservationService.createReservation(request, currentUser);
        return new ResponseEntity<>(ApiResponse.ok(created, "Reservation created successfully"), HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get list of reservations with filtering (Role-scoped)")
    public ResponseEntity<ApiResponse<Page<ReservationResponse>>> getReservations(
            @RequestParam(required = false) Long hotelId,
            @RequestParam(required = false) Long roomId,
            @RequestParam(required = false) ReservationStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ?
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        PageRequest pageRequest = PageRequest.of(page, size, sort);

        Page<ReservationResponse> reservations = reservationService.getReservations(
                hotelId, roomId, status, startDate, endDate, pageRequest, currentUser
        );
        return ResponseEntity.ok(ApiResponse.ok(reservations));
    }

    @GetMapping("/my")
    @Operation(summary = "Get all reservations for current authenticated user")
    public ResponseEntity<ApiResponse<List<ReservationResponse>>> getMyReservations(
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        List<ReservationResponse> myReservations = reservationService.getMyReservations(currentUser);
        return ResponseEntity.ok(ApiResponse.ok(myReservations));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get reservation details by ID")
    public ResponseEntity<ApiResponse<ReservationResponse>> getReservationById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        ReservationResponse reservation = reservationService.getReservationById(id, currentUser);
        return ResponseEntity.ok(ApiResponse.ok(reservation));
    }

    @GetMapping("/code/{code}")
    @Operation(summary = "Get reservation details by unique reservation code")
    public ResponseEntity<ApiResponse<ReservationResponse>> getReservationByCode(
            @PathVariable String code,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        ReservationResponse reservation = reservationService.getReservationByCode(code, currentUser);
        return ResponseEntity.ok(ApiResponse.ok(reservation));
    }

    @PatchMapping("/{id}/cancel")
    @Operation(summary = "Cancel a reservation according to cancellation policy")
    public ResponseEntity<ApiResponse<ReservationResponse>> cancelReservation(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        ReservationResponse cancelled = reservationService.cancelReservation(id, currentUser);
        return ResponseEntity.ok(ApiResponse.ok(cancelled, "Reservation cancelled successfully"));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Update reservation status (Staff/Admin)")
    public ResponseEntity<ApiResponse<ReservationResponse>> updateReservationStatus(
            @PathVariable Long id,
            @Valid @RequestBody ReservationStatusUpdateRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        ReservationResponse updated = reservationService.updateReservationStatus(id, request, currentUser);
        return ResponseEntity.ok(ApiResponse.ok(updated, "Reservation status updated successfully"));
    }
}
