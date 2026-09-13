package com.example.hotelreservation.controller;

import com.example.hotelreservation.dto.request.ExpenseRequest;
import com.example.hotelreservation.dto.response.ApiResponse;
import com.example.hotelreservation.dto.response.ExpenseResponse;
import com.example.hotelreservation.enums.ExpenseStatus;
import com.example.hotelreservation.security.UserPrincipal;
import com.example.hotelreservation.service.ExpenseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/expenses")
@Tag(name = "Expense Management", description = "Operational & Corporate Expense Tracking and Approvals")
@SecurityRequirement(name = "bearerAuth")
public class ExpenseController {

    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @GetMapping
    @Operation(summary = "List paginated expenses with sort and filtering")
    public ResponseEntity<ApiResponse<Page<ExpenseResponse>>> getExpenses(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size,
            @RequestParam(defaultValue = "expenseDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Page<ExpenseResponse> expenses = expenseService.getExpenses(page, size, sortBy, sortDir);
        return ResponseEntity.ok(ApiResponse.success(expenses));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get expense by ID")
    public ResponseEntity<ApiResponse<ExpenseResponse>> getExpenseById(@PathVariable Long id) {
        ExpenseResponse expense = expenseService.getExpenseById(id);
        return ResponseEntity.ok(ApiResponse.success(expense));
    }

    @PostMapping
    @Operation(summary = "Submit a new operational or corporate expense")
    public ResponseEntity<ApiResponse<ExpenseResponse>> createExpense(
            @Valid @RequestBody ExpenseRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        String userEmail = currentUser != null ? currentUser.getUsername() : "admin@grandhotel.com";
        String userRole = currentUser != null ? currentUser.getAuthorities().iterator().next().getAuthority() : "ROLE_ADMIN";
        ExpenseResponse created = expenseService.createExpense(request, userEmail, userRole);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Expense submitted successfully", created));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing expense")
    public ResponseEntity<ApiResponse<ExpenseResponse>> updateExpense(
            @PathVariable Long id,
            @Valid @RequestBody ExpenseRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        String userEmail = currentUser != null ? currentUser.getUsername() : "admin@grandhotel.com";
        String userRole = currentUser != null ? currentUser.getAuthorities().iterator().next().getAuthority() : "ROLE_ADMIN";
        ExpenseResponse updated = expenseService.updateExpense(id, request, userEmail, userRole);
        return ResponseEntity.ok(ApiResponse.success("Expense updated successfully", updated));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Approve, Reject, or Mark Paid an expense")
    public ResponseEntity<ApiResponse<ExpenseResponse>> updateExpenseStatus(
            @PathVariable Long id,
            @RequestParam ExpenseStatus status,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        String userEmail = currentUser != null ? currentUser.getUsername() : "cfo@grandhotel.com";
        String userRole = currentUser != null ? currentUser.getAuthorities().iterator().next().getAuthority() : "ROLE_CFO";
        ExpenseResponse updated = expenseService.updateExpenseStatus(id, status, userEmail, userRole);
        return ResponseEntity.ok(ApiResponse.success("Expense status updated to " + status, updated));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an expense")
    public ResponseEntity<ApiResponse<Void>> deleteExpense(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        String userEmail = currentUser != null ? currentUser.getUsername() : "admin@grandhotel.com";
        String userRole = currentUser != null ? currentUser.getAuthorities().iterator().next().getAuthority() : "ROLE_ADMIN";
        expenseService.deleteExpense(id, userEmail, userRole);
        return ResponseEntity.ok(ApiResponse.success("Expense deleted successfully", null));
    }
}
