package com.example.hotelreservation.controller;

import com.example.hotelreservation.dto.response.ApiResponse;
import com.example.hotelreservation.dto.response.OperationsAnalyticsResponse;
import com.example.hotelreservation.service.OperationsAnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/operations")
@Tag(name = "Operations Analytics", description = "COO Operations & Real-time Room Status Board")
@SecurityRequirement(name = "bearerAuth")
public class OperationsController {

    private final OperationsAnalyticsService operationsAnalyticsService;

    public OperationsController(OperationsAnalyticsService operationsAnalyticsService) {
        this.operationsAnalyticsService = operationsAnalyticsService;
    }

    @GetMapping("/analytics")
    @Operation(summary = "Get live operations metrics, room status counts, and check-in KPIs")
    public ResponseEntity<ApiResponse<OperationsAnalyticsResponse>> getOperationsOverview() {
        OperationsAnalyticsResponse resp = operationsAnalyticsService.getOperationsOverview();
        return ResponseEntity.ok(ApiResponse.success(resp));
    }
}
