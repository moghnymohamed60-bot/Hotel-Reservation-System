package com.example.hotelreservation.controller;

import com.example.hotelreservation.dto.response.ApiResponse;
import com.example.hotelreservation.dto.response.ExecutiveKpiResponse;
import com.example.hotelreservation.service.ExecutiveAnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/admin/executive")
@Tag(name = "Executive Analytics", description = "CEO & Executive Strategic Analytics Endpoints")
@SecurityRequirement(name = "bearerAuth")
public class ExecutiveAnalyticsController {

    private final ExecutiveAnalyticsService executiveAnalyticsService;

    public ExecutiveAnalyticsController(ExecutiveAnalyticsService executiveAnalyticsService) {
        this.executiveAnalyticsService = executiveAnalyticsService;
    }

    @GetMapping({"/overview", "/kpis"})
    @Operation(summary = "Get high-level CEO executive KPIs with period comparisons")
    public ResponseEntity<ApiResponse<ExecutiveKpiResponse>> getExecutiveOverview(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        if (endDate == null) {
            endDate = LocalDate.now();
        }
        if (startDate == null) {
            startDate = endDate.minusDays(30);
        }

        ExecutiveKpiResponse kpis = executiveAnalyticsService.getExecutiveOverview(startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(kpis));
    }
}
