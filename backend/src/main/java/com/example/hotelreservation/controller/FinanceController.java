package com.example.hotelreservation.controller;

import com.example.hotelreservation.dto.response.*;
import com.example.hotelreservation.entity.Payment;
import com.example.hotelreservation.repository.PaymentRepository;
import com.example.hotelreservation.service.FinanceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/admin/finance")
@Tag(name = "Finance & Accounting", description = "CFO & Accounting Financial Analytics, P&L, Cash Flow, Ledgers")
@SecurityRequirement(name = "bearerAuth")
public class FinanceController {

    private final FinanceService financeService;
    private final PaymentRepository paymentRepository;

    public FinanceController(FinanceService financeService, PaymentRepository paymentRepository) {
        this.financeService = financeService;
        this.paymentRepository = paymentRepository;
    }

    @GetMapping("/profit-loss")
    @Operation(summary = "Calculate deterministic Profit & Loss statement for date range")
    public ResponseEntity<ApiResponse<ProfitLossResponse>> getProfitAndLoss(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        if (endDate == null) endDate = LocalDate.now();
        if (startDate == null) startDate = endDate.minusDays(30);

        ProfitLossResponse pl = financeService.calculateProfitAndLoss(startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(pl));
    }

    @GetMapping("/cash-flow")
    @Operation(summary = "Calculate Cash Flow statement (Inflow, Outflow, Balances) for date range")
    public ResponseEntity<ApiResponse<CashFlowResponse>> getCashFlow(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        if (endDate == null) endDate = LocalDate.now();
        if (startDate == null) startDate = endDate.minusDays(30);

        CashFlowResponse cf = financeService.calculateCashFlow(startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(cf));
    }

    @GetMapping("/analytics")
    @Operation(summary = "Get multi-series financial charts, channel breakdowns, and expense distributions")
    public ResponseEntity<ApiResponse<FinancialAnalyticsResponse>> getFinancialAnalytics(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        if (endDate == null) endDate = LocalDate.now();
        if (startDate == null) startDate = endDate.minusDays(180); // 6 months default for trends

        FinancialAnalyticsResponse fa = financeService.getFinancialAnalytics(startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(fa));
    }

    @GetMapping("/transactions")
    @Operation(summary = "Get paginated transaction ledger")
    public ResponseEntity<ApiResponse<Page<Payment>>> getTransactions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Payment> transactions = paymentRepository.findAllByOrderByCreatedAtDesc(pageable);
        return ResponseEntity.ok(ApiResponse.success(transactions));
    }
}
