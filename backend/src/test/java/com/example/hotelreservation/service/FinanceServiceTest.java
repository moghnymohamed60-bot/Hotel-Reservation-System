package com.example.hotelreservation.service;

import com.example.hotelreservation.dto.response.CashFlowResponse;
import com.example.hotelreservation.dto.response.ProfitLossResponse;
import com.example.hotelreservation.enums.ExpenseCategory;
import com.example.hotelreservation.repository.ExpenseRepository;
import com.example.hotelreservation.repository.PaymentRepository;
import com.example.hotelreservation.repository.ReservationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class FinanceServiceTest {

    @Mock
    private ReservationRepository reservationRepository;

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private ExpenseRepository expenseRepository;

    @InjectMocks
    private FinanceService financeService;

    private LocalDate startDate;
    private LocalDate endDate;

    @BeforeEach
    void setUp() {
        startDate = LocalDate.of(2026, 9, 1);
        endDate = LocalDate.of(2026, 9, 30);
    }

    @Test
    @DisplayName("Should correctly calculate deterministic P&L line items")
    void testCalculateProfitAndLoss() {
        when(reservationRepository.calculateGrossRevenueBetween(any(LocalDateTime.class), any(LocalDateTime.class)))
                .thenReturn(BigDecimal.valueOf(50000.00));
        when(reservationRepository.calculateAddOnRevenueBetween(any(LocalDateTime.class), any(LocalDateTime.class)))
                .thenReturn(BigDecimal.valueOf(5000.00));
        when(paymentRepository.sumRefundAmountBetween(any(LocalDateTime.class), any(LocalDateTime.class)))
                .thenReturn(BigDecimal.valueOf(1000.00));
        when(reservationRepository.calculateCancelledLossBetween(any(LocalDateTime.class), any(LocalDateTime.class)))
                .thenReturn(BigDecimal.valueOf(500.00));
        when(paymentRepository.sumGatewayFeesBetween(any(LocalDateTime.class), any(LocalDateTime.class)))
                .thenReturn(BigDecimal.valueOf(1200.00));
        when(expenseRepository.sumByCategoryBetween(eq(ExpenseCategory.VARIABLE_COST), any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(BigDecimal.valueOf(8000.00));
        when(expenseRepository.sumByCategoryBetween(eq(ExpenseCategory.FIXED_COST), any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(BigDecimal.valueOf(15000.00));
        when(expenseRepository.sumByCategoryBetween(eq(ExpenseCategory.SALES_MARKETING), any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(BigDecimal.valueOf(4000.00));
        when(expenseRepository.sumByCategoryBetween(eq(ExpenseCategory.FINANCIAL_COST), any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(BigDecimal.valueOf(500.00));
        when(expenseRepository.sumByCategoryBetween(eq(ExpenseCategory.OTHER), any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(BigDecimal.valueOf(300.00));

        ProfitLossResponse pl = financeService.calculateProfitAndLoss(startDate, endDate);

        assertNotNull(pl);
        assertEquals(BigDecimal.valueOf(55000.00), pl.getGrossRevenue()); // 50000 + 5000
        assertEquals(BigDecimal.valueOf(53500.00), pl.getNetRevenue());   // 55000 - 1500
        assertTrue(pl.getGrossProfit().compareTo(BigDecimal.ZERO) > 0);
        assertTrue(pl.getOperatingProfit().compareTo(BigDecimal.ZERO) > 0);
        assertTrue(pl.getIsProfitable());
    }

    @Test
    @DisplayName("Should correctly calculate Cash Flow statement")
    void testCalculateCashFlow() {
        when(paymentRepository.sumPaidAmountBetween(any(LocalDateTime.class), any(LocalDateTime.class)))
                .thenReturn(BigDecimal.valueOf(40000.00));
        when(reservationRepository.calculateAddOnRevenueBetween(any(LocalDateTime.class), any(LocalDateTime.class)))
                .thenReturn(BigDecimal.valueOf(3000.00));
        when(expenseRepository.sumTotalExpensesBetween(any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(BigDecimal.valueOf(25000.00));
        when(paymentRepository.sumRefundAmountBetween(any(LocalDateTime.class), any(LocalDateTime.class)))
                .thenReturn(BigDecimal.valueOf(1000.00));
        when(paymentRepository.sumGatewayFeesBetween(any(LocalDateTime.class), any(LocalDateTime.class)))
                .thenReturn(BigDecimal.valueOf(800.00));

        CashFlowResponse cf = financeService.calculateCashFlow(startDate, endDate);

        assertNotNull(cf);
        assertEquals(BigDecimal.valueOf(43000.00), cf.getTotalCashInflow());
        assertTrue(cf.getTotalCashOutflow().compareTo(BigDecimal.valueOf(25000.00)) > 0);
        assertNotNull(cf.getNetCashFlow());
        assertNotNull(cf.getClosingCashBalance());
    }
}
