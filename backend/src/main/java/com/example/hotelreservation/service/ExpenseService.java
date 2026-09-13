package com.example.hotelreservation.service;

import com.example.hotelreservation.dto.request.ExpenseRequest;
import com.example.hotelreservation.dto.response.ExpenseResponse;
import com.example.hotelreservation.entity.Expense;
import com.example.hotelreservation.enums.ExpenseCategory;
import com.example.hotelreservation.enums.ExpenseStatus;
import com.example.hotelreservation.exception.ResourceNotFoundException;
import com.example.hotelreservation.repository.ExpenseRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final AuditLogService auditLogService;

    public ExpenseService(ExpenseRepository expenseRepository, AuditLogService auditLogService) {
        this.expenseRepository = expenseRepository;
        this.auditLogService = auditLogService;
    }

    @Transactional
    public ExpenseResponse createExpense(ExpenseRequest req, String userEmail, String userRole) {
        Expense expense = Expense.builder()
                .category(req.getCategory())
                .department(req.getDepartment())
                .description(req.getDescription())
                .amount(req.getAmount())
                .paymentMethod(req.getPaymentMethod())
                .vendor(req.getVendor())
                .status(ExpenseStatus.PENDING)
                .expenseDate(req.getExpenseDate() != null ? req.getExpenseDate() : LocalDate.now())
                .createdBy(userEmail)
                .receiptUrl(req.getReceiptUrl())
                .build();

        Expense saved = expenseRepository.save(expense);
        auditLogService.logAction(null, userEmail, userRole, "CREATE", "Expense", String.valueOf(saved.getId()),
                "127.0.0.1", "Submitted new expense: " + req.getDescription() + " (" + req.getAmount() + ")");
        return mapToResponse(saved);
    }

    @Transactional
    public ExpenseResponse updateExpense(Long id, ExpenseRequest req, String userEmail, String userRole) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id: " + id));

        expense.setCategory(req.getCategory());
        expense.setDepartment(req.getDepartment());
        expense.setDescription(req.getDescription());
        expense.setAmount(req.getAmount());
        expense.setPaymentMethod(req.getPaymentMethod());
        expense.setVendor(req.getVendor());
        expense.setExpenseDate(req.getExpenseDate());
        expense.setReceiptUrl(req.getReceiptUrl());

        Expense updated = expenseRepository.save(expense);
        auditLogService.logAction(null, userEmail, userRole, "UPDATE", "Expense", String.valueOf(id),
                "127.0.0.1", "Updated expense details for id: " + id);
        return mapToResponse(updated);
    }

    @Transactional
    public ExpenseResponse updateExpenseStatus(Long id, ExpenseStatus newStatus, String approvedBy, String userRole) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id: " + id));

        expense.setStatus(newStatus);
        if (newStatus == ExpenseStatus.APPROVED || newStatus == ExpenseStatus.PAID) {
            expense.setApprovedBy(approvedBy);
        }

        Expense updated = expenseRepository.save(expense);
        auditLogService.logAction(null, approvedBy, userRole, "STATUS_CHANGE", "Expense", String.valueOf(id),
                "127.0.0.1", "Expense status changed to " + newStatus + " by " + approvedBy);
        return mapToResponse(updated);
    }

    @Transactional
    public void deleteExpense(Long id, String userEmail, String userRole) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id: " + id));
        expenseRepository.delete(expense);
        auditLogService.logAction(null, userEmail, userRole, "DELETE", "Expense", String.valueOf(id),
                "127.0.0.1", "Deleted expense with id: " + id);
    }

    @Transactional(readOnly = true)
    public Page<ExpenseResponse> getExpenses(int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return expenseRepository.findAll(pageable).map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public ExpenseResponse getExpenseById(Long id) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id: " + id));
        return mapToResponse(expense);
    }

    @Transactional(readOnly = true)
    public List<ExpenseResponse> getExpensesBetween(LocalDate start, LocalDate end) {
        return expenseRepository.findByExpenseDateBetween(start, end).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private ExpenseResponse mapToResponse(Expense e) {
        return ExpenseResponse.builder()
                .id(e.getId())
                .category(e.getCategory())
                .department(e.getDepartment())
                .description(e.getDescription())
                .amount(e.getAmount())
                .paymentMethod(e.getPaymentMethod())
                .vendor(e.getVendor())
                .status(e.getStatus())
                .expenseDate(e.getExpenseDate())
                .createdBy(e.getCreatedBy())
                .approvedBy(e.getApprovedBy())
                .receiptUrl(e.getReceiptUrl())
                .createdAt(e.getCreatedAt())
                .updatedAt(e.getUpdatedAt())
                .build();
    }
}
