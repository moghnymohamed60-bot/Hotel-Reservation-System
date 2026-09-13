package com.example.hotelreservation.controller;

import com.example.hotelreservation.dto.response.ApiResponse;
import com.example.hotelreservation.dto.response.SystemHealthResponse;
import com.example.hotelreservation.service.SystemHealthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/system")
@Tag(name = "System Health & Monitoring", description = "CTO Infrastructure Telemetry, JVM Memory & Error Rates")
@SecurityRequirement(name = "bearerAuth")
public class SystemHealthController {

    private final SystemHealthService systemHealthService;

    public SystemHealthController(SystemHealthService systemHealthService) {
        this.systemHealthService = systemHealthService;
    }

    @GetMapping("/health")
    @Operation(summary = "Get live CTO system health telemetry, JVM metrics, and latency")
    public ResponseEntity<ApiResponse<SystemHealthResponse>> getSystemHealth() {
        SystemHealthResponse health = systemHealthService.getSystemHealth();
        return ResponseEntity.ok(ApiResponse.success(health));
    }
}
