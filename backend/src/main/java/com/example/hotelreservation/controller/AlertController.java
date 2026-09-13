package com.example.hotelreservation.controller;

import com.example.hotelreservation.dto.response.ApiResponse;
import com.example.hotelreservation.dto.response.SystemAlertResponse;
import com.example.hotelreservation.service.AlertService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/alerts")
@Tag(name = "Alerts Center", description = "Financial, Operational & System Alert Center")
@SecurityRequirement(name = "bearerAuth")
public class AlertController {

    private final AlertService alertService;

    public AlertController(AlertService alertService) {
        this.alertService = alertService;
    }

    @GetMapping
    @Operation(summary = "Get active unacknowledged system alerts")
    public ResponseEntity<ApiResponse<List<SystemAlertResponse>>> getActiveAlerts() {
        List<SystemAlertResponse> alerts = alertService.getActiveAlerts();
        return ResponseEntity.ok(ApiResponse.success(alerts));
    }

    @GetMapping("/recent")
    @Operation(summary = "Get recent system alerts")
    public ResponseEntity<ApiResponse<List<SystemAlertResponse>>> getRecentAlerts() {
        List<SystemAlertResponse> alerts = alertService.getRecentAlerts();
        return ResponseEntity.ok(ApiResponse.success(alerts));
    }

    @PatchMapping("/{id}/acknowledge")
    @Operation(summary = "Acknowledge an alert")
    public ResponseEntity<ApiResponse<SystemAlertResponse>> acknowledgeAlert(@PathVariable Long id) {
        SystemAlertResponse updated = alertService.acknowledgeAlert(id);
        return ResponseEntity.ok(ApiResponse.success("Alert acknowledged", updated));
    }
}
