package com.example.hotelreservation.dto.request;

import com.example.hotelreservation.enums.ExpenseCategory;
import com.example.hotelreservation.enums.PaymentMethod;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

public class ExpenseRequest {

    @NotNull(message = "Expense category is required")
    private ExpenseCategory category;

    @NotBlank(message = "Department is required")
    @Size(max = 50, message = "Department cannot exceed 50 characters")
    private String department;

    @NotBlank(message = "Description is required")
    @Size(max = 255, message = "Description cannot exceed 255 characters")
    private String description;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than zero")
    private BigDecimal amount;

    private PaymentMethod paymentMethod = PaymentMethod.CARD;

    @Size(max = 100, message = "Vendor cannot exceed 100 characters")
    private String vendor;

    @NotNull(message = "Expense date is required")
    private LocalDate expenseDate;

    private String receiptUrl;

    public ExpenseRequest() {}

    public ExpenseRequest(ExpenseCategory category, String department, String description, BigDecimal amount,
                          PaymentMethod paymentMethod, String vendor, LocalDate expenseDate, String receiptUrl) {
        this.category = category;
        this.department = department;
        this.description = description;
        this.amount = amount;
        this.paymentMethod = paymentMethod != null ? paymentMethod : PaymentMethod.CARD;
        this.vendor = vendor;
        this.expenseDate = expenseDate != null ? expenseDate : LocalDate.now();
        this.receiptUrl = receiptUrl;
    }

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

    public LocalDate getExpenseDate() { return expenseDate; }
    public void setExpenseDate(LocalDate expenseDate) { this.expenseDate = expenseDate; }

    public String getReceiptUrl() { return receiptUrl; }
    public void setReceiptUrl(String receiptUrl) { this.receiptUrl = receiptUrl; }
}
