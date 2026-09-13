package com.example.hotelreservation.controller;

import com.example.hotelreservation.dto.request.RoomRequest;
import com.example.hotelreservation.dto.response.ApiResponse;
import com.example.hotelreservation.dto.response.RoomResponse;
import com.example.hotelreservation.enums.RoomStatus;
import com.example.hotelreservation.enums.RoomType;
import com.example.hotelreservation.service.RoomService;
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
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@Tag(name = "Rooms", description = "Endpoints for discovering, searching availability and managing rooms")
public class RoomController {

    private final RoomService roomService;

    @Autowired
    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @GetMapping
    @Operation(summary = "Search rooms with multi-criteria filters")
    public ResponseEntity<ApiResponse<Page<RoomResponse>>> getAllRooms(
            @RequestParam(required = false) Long hotelId,
            @RequestParam(required = false) RoomType roomType,
            @RequestParam(required = false) Integer capacity,
            @RequestParam(required = false) RoomStatus status,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ?
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        PageRequest pageRequest = PageRequest.of(page, size, sort);

        Page<RoomResponse> rooms = roomService.getAllRooms(hotelId, roomType, capacity, status, minPrice, maxPrice, pageRequest);
        return ResponseEntity.ok(ApiResponse.ok(rooms));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get room by ID")
    public ResponseEntity<ApiResponse<RoomResponse>> getRoomById(@PathVariable Long id) {
        RoomResponse room = roomService.getRoomById(id);
        return ResponseEntity.ok(ApiResponse.ok(room));
    }

    @GetMapping("/hotel/{hotelId}")
    @Operation(summary = "Get all rooms for a specific hotel")
    public ResponseEntity<ApiResponse<List<RoomResponse>>> getRoomsByHotelId(@PathVariable Long hotelId) {
        List<RoomResponse> rooms = roomService.getRoomsByHotelId(hotelId);
        return ResponseEntity.ok(ApiResponse.ok(rooms));
    }

    @GetMapping("/available")
    @Operation(summary = "Find rooms available between check-in and check-out dates")
    public ResponseEntity<ApiResponse<List<RoomResponse>>> findAvailableRooms(
            @RequestParam(required = false) Long hotelId,
            @RequestParam(required = false) String city,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkInDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOutDate,
            @RequestParam(required = false) Integer guests,
            @RequestParam(required = false) RoomType roomType
    ) {
        List<RoomResponse> availableRooms = roomService.findAvailableRooms(
                hotelId, city, checkInDate, checkOutDate, guests, roomType
        );
        return ResponseEntity.ok(ApiResponse.ok(availableRooms));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new room in a hotel (Admin only)")
    public ResponseEntity<ApiResponse<RoomResponse>> createRoom(@Valid @RequestBody RoomRequest request) {
        RoomResponse created = roomService.createRoom(request);
        return new ResponseEntity<>(ApiResponse.ok(created, "Room created successfully"), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Update room details (Admin/Staff)")
    public ResponseEntity<ApiResponse<RoomResponse>> updateRoom(
            @PathVariable Long id,
            @Valid @RequestBody RoomRequest request
    ) {
        RoomResponse updated = roomService.updateRoom(id, request);
        return ResponseEntity.ok(ApiResponse.ok(updated, "Room updated successfully"));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Update room operational status (Admin/Staff)")
    public ResponseEntity<ApiResponse<RoomResponse>> updateRoomStatus(
            @PathVariable Long id,
            @RequestParam RoomStatus status
    ) {
        RoomResponse updated = roomService.updateRoomStatus(id, status);
        return ResponseEntity.ok(ApiResponse.ok(updated, "Room status updated successfully"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a room (Admin only)")
    public ResponseEntity<ApiResponse<Void>> deleteRoom(@PathVariable Long id) {
        roomService.deleteRoom(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Room deleted successfully"));
    }
}
