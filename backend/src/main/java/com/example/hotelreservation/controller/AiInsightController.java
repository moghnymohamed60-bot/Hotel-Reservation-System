package com.example.hotelreservation.controller;

import com.example.hotelreservation.dto.response.AiInsightResponse;
import com.example.hotelreservation.dto.response.ApiResponse;
import com.example.hotelreservation.service.AiInsightService;
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
@RequestMapping("/api/admin/ai")
@Tag(name = "AI Insights", description = "AI-Powered Executive Insights, Anomaly Detection & Forecasts")
@SecurityRequirement(name = "bearerAuth")
public class AiInsightController {

    private final AiInsightService aiInsightService;

    public AiInsightController(AiInsightService aiInsightService) {
        this.aiInsightService = aiInsightService;
    }

    @GetMapping("/insights")
    @Operation(summary = "Get AI-generated executive narrative, anomaly detection, and recommendations")
    public ResponseEntity<ApiResponse<AiInsightResponse>> getInsights(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        if (endDate == null) endDate = LocalDate.now();
        if (startDate == null) startDate = endDate.minusDays(30);

        AiInsightResponse resp = aiInsightService.generateExecutiveInsights(startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(resp));
    }
}
