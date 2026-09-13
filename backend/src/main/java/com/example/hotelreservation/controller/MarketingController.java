package com.example.hotelreservation.controller;

import com.example.hotelreservation.dto.response.ApiResponse;
import com.example.hotelreservation.dto.response.MarketingAnalyticsResponse;
import com.example.hotelreservation.service.MarketingAnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/admin/marketing")
@Tag(name = "Marketing Analytics", description = "CMO Marketing Channel Analytics, CAC, LTV & ROAS")
@SecurityRequirement(name = "bearerAuth")
public class MarketingController {

    private final MarketingAnalyticsService marketingAnalyticsService;

    public MarketingController(MarketingAnalyticsService marketingAnalyticsService) {
        this.marketingAnalyticsService = marketingAnalyticsService;
    }

    @GetMapping("/analytics")
    @Operation(summary = "Get CMO marketing channel breakdown, CAC, and return on ad spend")
    public ResponseEntity<ApiResponse<MarketingAnalyticsResponse>> getMarketingOverview(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        if (endDate == null) endDate = LocalDate.now();
        if (startDate == null) startDate = endDate.minusDays(30);

        MarketingAnalyticsResponse resp = marketingAnalyticsService.getMarketingOverview(startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(resp));
    }
}
