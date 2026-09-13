package com.example.hotelreservation.controller;

import com.example.hotelreservation.dto.request.HotelRequest;
import com.example.hotelreservation.dto.response.ApiResponse;
import com.example.hotelreservation.dto.response.HotelResponse;
import com.example.hotelreservation.service.HotelService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/hotels")
@Tag(name = "Hotels", description = "Endpoints for browsing, searching and managing hotels")
public class HotelController {

    private final HotelService hotelService;

    @Autowired
    public HotelController(HotelService hotelService) {
        this.hotelService = hotelService;
    }

    @GetMapping
    @Operation(summary = "Search and list hotels with pagination and filters")
    public ResponseEntity<ApiResponse<Page<HotelResponse>>> getAllHotels(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Integer starRating,
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

        Page<HotelResponse> hotels = hotelService.getAllHotels(city, name, starRating, minPrice, maxPrice, pageRequest);
        return ResponseEntity.ok(ApiResponse.ok(hotels));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get detailed hotel information by ID")
    public ResponseEntity<ApiResponse<HotelResponse>> getHotelById(@PathVariable Long id) {
        HotelResponse hotel = hotelService.getHotelById(id);
        return ResponseEntity.ok(ApiResponse.ok(hotel));
    }

    @GetMapping("/cities")
    @Operation(summary = "Get all distinct cities where hotels are located")
    public ResponseEntity<ApiResponse<List<String>>> getAvailableCities() {
        List<String> cities = hotelService.getAvailableCities();
        return ResponseEntity.ok(ApiResponse.ok(cities));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new hotel (Admin only)")
    public ResponseEntity<ApiResponse<HotelResponse>> createHotel(@Valid @RequestBody HotelRequest request) {
        HotelResponse created = hotelService.createHotel(request);
        return new ResponseEntity<>(ApiResponse.ok(created, "Hotel created successfully"), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update an existing hotel (Admin only)")
    public ResponseEntity<ApiResponse<HotelResponse>> updateHotel(
            @PathVariable Long id,
            @Valid @RequestBody HotelRequest request
    ) {
        HotelResponse updated = hotelService.updateHotel(id, request);
        return ResponseEntity.ok(ApiResponse.ok(updated, "Hotel updated successfully"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a hotel (Admin only)")
    public ResponseEntity<ApiResponse<Void>> deleteHotel(@PathVariable Long id) {
        hotelService.deleteHotel(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Hotel deleted successfully"));
    }
}
