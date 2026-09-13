package com.example.hotelreservation.dto.response;

import com.example.hotelreservation.enums.ExpenseCategory;
import com.example.hotelreservation.enums.ExpenseStatus;
import com.example.hotelreservation.enums.PaymentMethod;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class ExpenseResponse {

    private Long id;
    private ExpenseCategory category;
    private String department;
    private String description;
    private BigDecimal amount;
    private PaymentMethod paymentMethod;
    private String vendor;
    private ExpenseStatus status;
    private LocalDate expenseDate;
    private String createdBy;
    private String approvedBy;
    private String receiptUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ExpenseResponse() {}

    public ExpenseResponse(Long id, ExpenseCategory category, String department, String description, BigDecimal amount,
                           PaymentMethod paymentMethod, String vendor, ExpenseStatus status, LocalDate expenseDate,
                           String createdBy, String approvedBy, String receiptUrl, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.category = category;
        this.department = department;
        this.description = description;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.vendor = vendor;
        this.status = status;
        this.expenseDate = expenseDate;
        this.createdBy = createdBy;
        this.approvedBy = approvedBy;
        this.receiptUrl = receiptUrl;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private ExpenseCategory category;
        private String department;
        private String description;
        private BigDecimal amount;
        private PaymentMethod paymentMethod;
        private String vendor;
        private ExpenseStatus status;
        private LocalDate expenseDate;
        private String createdBy;
        private String approvedBy;
        private String receiptUrl;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder category(ExpenseCategory category) { this.category = category; return this; }
        public Builder department(String department) { this.department = department; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder amount(BigDecimal amount) { this.amount = amount; return this; }
        public Builder paymentMethod(PaymentMethod paymentMethod) { this.paymentMethod = paymentMethod; return this; }
        public Builder vendor(String vendor) { this.vendor = vendor; return this; }
        public Builder status(ExpenseStatus status) { this.status = status; return this; }
        public Builder expenseDate(LocalDate expenseDate) { this.expenseDate = expenseDate; return this; }
        public Builder createdBy(String createdBy) { this.createdBy = createdBy; return this; }
        public Builder approvedBy(String approvedBy) { this.approvedBy = approvedBy; return this; }
        public Builder receiptUrl(String receiptUrl) { this.receiptUrl = receiptUrl; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public Builder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public ExpenseResponse build() {
            return new ExpenseResponse(id, category, department, description, amount, paymentMethod, vendor, status,
                    expenseDate, createdBy, approvedBy, receiptUrl, createdAt, updatedAt);
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ExpenseCategory getCategory() { return category; }
    public void setCategory(ExpenseCategory category) { this.category = category; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public PaymentMethod getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(PaymentMethod paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getVendor() { return vendor; }
    public void setVendor(String vendor) { this.vendor = vendor; }

    public ExpenseStatus getStatus() { return status; }
    public void setStatus(ExpenseStatus status) { this.status = status; }

    public LocalDate getExpenseDate() { return expenseDate; }
    public void setExpenseDate(LocalDate expenseDate) { this.expenseDate = expenseDate; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

    public String getApprovedBy() { return approvedBy; }
    public void setApprovedBy(String approvedBy) { this.approvedBy = approvedBy; }

    public String getReceiptUrl() { return receiptUrl; }
    public void setReceiptUrl(String receiptUrl) { this.receiptUrl = receiptUrl; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
