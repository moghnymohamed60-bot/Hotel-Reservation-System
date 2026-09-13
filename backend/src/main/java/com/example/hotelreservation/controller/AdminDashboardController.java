package com.example.hotelreservation.controller;

import com.example.hotelreservation.dto.response.ApiResponse;
import com.example.hotelreservation.dto.response.DashboardStatsResponse;
import com.example.hotelreservation.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/dashboard")
@Tag(name = "Admin Dashboard", description = "Endpoints for executive analytics, revenue and system metrics")
public class AdminDashboardController {

    private final DashboardService dashboardService;

    @Autowired
    public AdminDashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/statistics")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get aggregated system statistics, revenue, and occupancy rates (Admin only)")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getDashboardStatistics() {
        DashboardStatsResponse stats = dashboardService.getDashboardStatistics();
        return ResponseEntity.ok(ApiResponse.ok(stats));
    }
}
