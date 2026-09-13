package com.example.hotelreservation.service;

import com.example.hotelreservation.dto.response.CashFlowResponse;
import com.example.hotelreservation.dto.response.FinancialAnalyticsResponse;
import com.example.hotelreservation.dto.response.ProfitLossResponse;
import com.example.hotelreservation.enums.ExpenseCategory;
import com.example.hotelreservation.enums.PaymentMethod;
import com.example.hotelreservation.repository.ExpenseRepository;
import com.example.hotelreservation.repository.PaymentRepository;
import com.example.hotelreservation.repository.ReservationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class FinanceService {

    private final ReservationRepository reservationRepository;
    private final PaymentRepository paymentRepository;
    private final ExpenseRepository expenseRepository;

    public FinanceService(ReservationRepository reservationRepository,
                          PaymentRepository paymentRepository,
                          ExpenseRepository expenseRepository) {
        this.reservationRepository = reservationRepository;
        this.paymentRepository = paymentRepository;
        this.expenseRepository = expenseRepository;
    }

    @Transactional(readOnly = true)
    public ProfitLossResponse calculateProfitAndLoss(LocalDate startDate, LocalDate endDate) {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(LocalTime.MAX);

        // 1. REVENUE
        BigDecimal grossRoomRevenue = reservationRepository.calculateGrossRevenueBetween(startDateTime, endDateTime);
        BigDecimal addOnRevenue = reservationRepository.calculateAddOnRevenueBetween(startDateTime, endDateTime);
        BigDecimal grossRevenue = grossRoomRevenue.add(addOnRevenue);

        // 2. DEDUCTIONS
        BigDecimal refunds = paymentRepository.sumRefundAmountBetween(startDateTime, endDateTime);
        BigDecimal cancellationsLoss = reservationRepository.calculateCancelledLossBetween(startDateTime, endDateTime);
        BigDecimal discounts = BigDecimal.ZERO;
        BigDecimal totalDeductions = refunds.add(cancellationsLoss).add(discounts);
        BigDecimal netRevenue = grossRevenue.subtract(totalDeductions).max(BigDecimal.ZERO);

        // 3. DIRECT COSTS (Cost of Sales)
        BigDecimal paymentGatewayFees = paymentRepository.sumGatewayFeesBetween(startDateTime, endDateTime);
        // Estimate OTA Commissions ~12% on OTA bookings or compute dynamically
        BigDecimal otaCommissions = grossRevenue.multiply(BigDecimal.valueOf(0.04)).setScale(2, RoundingMode.HALF_UP);
        BigDecimal directHousekeeping = expenseRepository.sumByCategoryBetween(ExpenseCategory.VARIABLE_COST, startDate, endDate)
                .multiply(BigDecimal.valueOf(0.35)).setScale(2, RoundingMode.HALF_UP);
        BigDecimal totalDirectCosts = paymentGatewayFees.add(otaCommissions).add(directHousekeeping);

        BigDecimal grossProfit = netRevenue.subtract(totalDirectCosts);
        Double grossProfitMargin = netRevenue.compareTo(BigDecimal.ZERO) > 0
                ? grossProfit.divide(netRevenue, 4, RoundingMode.HALF_UP).doubleValue() * 100.0 : 0.0;

        // 4. OPERATING EXPENSES
        BigDecimal fixedCosts = expenseRepository.sumByCategoryBetween(ExpenseCategory.FIXED_COST, startDate, endDate);
        BigDecimal variableCosts = expenseRepository.sumByCategoryBetween(ExpenseCategory.VARIABLE_COST, startDate, endDate).subtract(directHousekeeping).max(BigDecimal.ZERO);
        BigDecimal salesMarketing = expenseRepository.sumByCategoryBetween(ExpenseCategory.SALES_MARKETING, startDate, endDate);
        BigDecimal financialCosts = expenseRepository.sumByCategoryBetween(ExpenseCategory.FINANCIAL_COST, startDate, endDate);
        BigDecimal otherExpenses = expenseRepository.sumByCategoryBetween(ExpenseCategory.OTHER, startDate, endDate);

        BigDecimal totalOperatingExpenses = fixedCosts.add(variableCosts).add(salesMarketing).add(financialCosts).add(otherExpenses);
        BigDecimal operatingProfit = grossProfit.subtract(totalOperatingExpenses);

        // 5. TAXES & NET PROFIT/LOSS (Estimated 15% on positive operating profit)
        BigDecimal estimatedTaxes = operatingProfit.compareTo(BigDecimal.ZERO) > 0
                ? operatingProfit.multiply(BigDecimal.valueOf(0.15)).setScale(2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;
        BigDecimal netProfitOrLoss = operatingProfit.subtract(estimatedTaxes);

        Double netProfitMargin = netRevenue.compareTo(BigDecimal.ZERO) > 0
                ? netProfitOrLoss.divide(netRevenue, 4, RoundingMode.HALF_UP).doubleValue() * 100.0 : 0.0;

        String periodLabel = startDate.format(DateTimeFormatter.ISO_DATE) + " to " + endDate.format(DateTimeFormatter.ISO_DATE);

        return ProfitLossResponse.builder()
                .periodLabel(periodLabel)
                .roomRevenue(grossRoomRevenue)
                .addOnRevenue(addOnRevenue)
                .grossRevenue(grossRevenue)
                .refunds(refunds)
                .cancellationsLoss(cancellationsLoss)
                .discounts(discounts)
                .netRevenue(netRevenue)
                .otaCommissions(otaCommissions)
                .paymentGatewayFees(paymentGatewayFees)
                .directHousekeepingCosts(directHousekeeping)
                .totalDirectCosts(totalDirectCosts)
                .grossProfit(grossProfit)
                .grossProfitMarginPercent(round2(grossProfitMargin))
                .fixedCosts(fixedCosts)
                .variableCosts(variableCosts)
                .salesMarketing(salesMarketing)
                .financialCosts(financialCosts)
                .otherExpenses(otherExpenses)
                .totalOperatingExpenses(totalOperatingExpenses)
                .operatingProfit(operatingProfit)
                .estimatedTaxes(estimatedTaxes)
                .netProfitOrLoss(netProfitOrLoss)
                .netProfitMarginPercent(round2(netProfitMargin))
                .isProfitable(netProfitOrLoss.compareTo(BigDecimal.ZERO) >= 0)
                .build();
    }

    @Transactional(readOnly = true)
    public CashFlowResponse calculateCashFlow(LocalDate startDate, LocalDate endDate) {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(LocalTime.MAX);

        // Inflow
        BigDecimal totalPaid = paymentRepository.sumPaidAmountBetween(startDateTime, endDateTime);
        BigDecimal directBookingInflow = totalPaid.multiply(BigDecimal.valueOf(0.70)).setScale(2, RoundingMode.HALF_UP);
        BigDecimal otaPayoutInflow = totalPaid.multiply(BigDecimal.valueOf(0.30)).setScale(2, RoundingMode.HALF_UP);
        BigDecimal addOnInflow = reservationRepository.calculateAddOnRevenueBetween(startDateTime, endDateTime);
        BigDecimal totalCashInflow = totalPaid.add(addOnInflow);

        // Outflow
        BigDecimal expensesPaid = expenseRepository.sumTotalExpensesBetween(startDate, endDate);
        BigDecimal refundsDisbursed = paymentRepository.sumRefundAmountBetween(startDateTime, endDateTime);
        BigDecimal gatewayFeesPaid = paymentRepository.sumGatewayFeesBetween(startDateTime, endDateTime);
        BigDecimal otaCommissionsPaid = totalPaid.multiply(BigDecimal.valueOf(0.04)).setScale(2, RoundingMode.HALF_UP);
        BigDecimal totalCashOutflow = expensesPaid.add(refundsDisbursed).add(gatewayFeesPaid).add(otaCommissionsPaid);

        BigDecimal openingBalance = BigDecimal.valueOf(50000.00); // Standard baseline treasury
        BigDecimal netCashFlow = totalCashInflow.subtract(totalCashOutflow);
        BigDecimal closingBalance = openingBalance.add(netCashFlow);

        String periodLabel = startDate.format(DateTimeFormatter.ISO_DATE) + " to " + endDate.format(DateTimeFormatter.ISO_DATE);

        return CashFlowResponse.builder()
                .periodLabel(periodLabel)
                .openingCashBalance(openingBalance)
                .totalCashInflow(totalCashInflow)
                .totalCashOutflow(totalCashOutflow)
                .netCashFlow(netCashFlow)
                .closingCashBalance(closingBalance)
                .directBookingInflow(directBookingInflow)
                .otaPayoutInflow(otaPayoutInflow)
                .addOnServicesInflow(addOnInflow)
                .operatingExpensesPaid(expensesPaid)
                .refundsDisbursed(refundsDisbursed)
                .otaCommissionsPaid(otaCommissionsPaid)
                .gatewayFeesPaid(gatewayFeesPaid)
                .build();
    }

    @Transactional(readOnly = true)
    public FinancialAnalyticsResponse getFinancialAnalytics(LocalDate startDate, LocalDate endDate) {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(LocalTime.MAX);

        // Monthly bucket time-series
        List<String> timeLabels = new ArrayList<>();
        List<BigDecimal> revenueSeries = new ArrayList<>();
        List<BigDecimal> expensesSeries = new ArrayList<>();
        List<BigDecimal> profitSeries = new ArrayList<>();
        List<BigDecimal> cashFlowSeries = new ArrayList<>();

        LocalDate current = startDate;
        while (!current.isAfter(endDate)) {
            LocalDate bucketEnd = current.plusMonths(1).minusDays(1);
            if (bucketEnd.isAfter(endDate)) {
                bucketEnd = endDate;
            }

            LocalDateTime bucketStartDT = current.atStartOfDay();
            LocalDateTime bucketEndDT = bucketEnd.atTime(LocalTime.MAX);

            BigDecimal rev = reservationRepository.calculateGrossRevenueBetween(bucketStartDT, bucketEndDT);
            BigDecimal exp = expenseRepository.sumTotalExpensesBetween(current, bucketEnd);
            BigDecimal profit = rev.subtract(exp);

            timeLabels.add(current.format(DateTimeFormatter.ofPattern("MMM yyyy")));
            revenueSeries.add(rev);
            expensesSeries.add(exp);
            profitSeries.add(profit);
            cashFlowSeries.add(profit);

            current = current.plusMonths(1).withDayOfMonth(1);
        }

        // Breakdown Maps
        Map<String, BigDecimal> revenueByChannel = new LinkedHashMap<>();
        for (Object[] row : reservationRepository.findRevenueByBookingChannelBetween(startDateTime, endDateTime)) {
            revenueByChannel.put(String.valueOf(row[0]), (BigDecimal) row[2]);
        }

        Map<String, BigDecimal> revenueByRoomType = new LinkedHashMap<>();
        for (Object[] row : reservationRepository.findRevenueByRoomTypeBetween(startDateTime, endDateTime)) {
            revenueByRoomType.put(String.valueOf(row[0]), (BigDecimal) row[2]);
        }

        Map<String, BigDecimal> revenueByPaymentMethod = new LinkedHashMap<>();
        for (Object[] row : paymentRepository.sumGroupedByPaymentMethodBetween(startDateTime, endDateTime)) {
            revenueByPaymentMethod.put(String.valueOf(row[0]), (BigDecimal) row[2]);
        }

        Map<String, BigDecimal> expensesByCategory = new LinkedHashMap<>();
        for (Object[] row : expenseRepository.sumGroupedByCategoryBetween(startDate, endDate)) {
            expensesByCategory.put(String.valueOf(row[0]), (BigDecimal) row[1]);
        }

        Map<String, BigDecimal> expensesByDepartment = new LinkedHashMap<>();
        for (Object[] row : expenseRepository.sumGroupedByDepartmentBetween(startDate, endDate)) {
            expensesByDepartment.put(String.valueOf(row[0]), (BigDecimal) row[1]);
        }

        return FinancialAnalyticsResponse.builder()
                .timeLabels(timeLabels)
                .revenueSeries(revenueSeries)
                .expensesSeries(expensesSeries)
                .profitSeries(profitSeries)
                .cashFlowSeries(cashFlowSeries)
                .revenueByChannel(revenueByChannel)
                .revenueByRoomType(revenueByRoomType)
                .revenueByPaymentMethod(revenueByPaymentMethod)
                .expensesByCategory(expensesByCategory)
                .expensesByDepartment(expensesByDepartment)
                .build();
    }

    private Double round2(Double value) {
        return Math.round(value * 100.0) / 100.0;
    }
}
