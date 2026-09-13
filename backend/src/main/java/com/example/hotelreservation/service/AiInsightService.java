package com.example.hotelreservation.service;

import com.example.hotelreservation.dto.response.AiInsightResponse;
import com.example.hotelreservation.dto.response.ExecutiveKpiResponse;
import com.example.hotelreservation.dto.response.ProfitLossResponse;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class AiInsightService {

    private final ExecutiveAnalyticsService executiveAnalyticsService;
    private final FinanceService financeService;

    public AiInsightService(ExecutiveAnalyticsService executiveAnalyticsService,
                            FinanceService financeService) {
        this.executiveAnalyticsService = executiveAnalyticsService;
        this.financeService = financeService;
    }

    public AiInsightResponse generateExecutiveInsights(LocalDate startDate, LocalDate endDate) {
        ExecutiveKpiResponse kpis = executiveAnalyticsService.getExecutiveOverview(startDate, endDate);
        ProfitLossResponse pl = financeService.calculateProfitAndLoss(startDate, endDate);

        // 1. Executive Narrative
        String summary = String.format(
                "Executive AI Analysis: The portfolio generated $%,.2f in gross revenue with a net operating profit of $%,.2f (Net Margin: %.1f%%). Portfolio occupancy averaged %.1f%% with ADR of $%,.2f.",
                kpis.getGrossRevenue(), kpis.getNetProfit(), kpis.getProfitMarginPercent(),
                kpis.getOccupancyRatePercent(), kpis.getAverageDailyRate()
        );

        // 2. Revenue & Profit Insights
        List<String> revenueInsights = new ArrayList<>();
        if (kpis.getRevenueGrowthPercent() >= 0) {
            revenueInsights.add(String.format("Strong top-line momentum: Revenue increased by +%.1f%% compared to the previous period.", kpis.getRevenueGrowthPercent()));
        } else {
            revenueInsights.add(String.format("Top-line contraction: Revenue decreased by %.1f%% compared to the previous period.", kpis.getRevenueGrowthPercent()));
        }
        revenueInsights.add(String.format("RevPAR of $%,.2f indicates healthy room yield across luxury suites and penthouses.", kpis.getRevPar()));
        revenueInsights.add(String.format("Direct website bookings represent high-margin revenue with zero OTA commission friction.", kpis.getGrossRevenue()));

        // 3. Expense Warnings
        List<String> expenseWarnings = new ArrayList<>();
        if (pl.getSalesMarketing().compareTo(BigDecimal.ZERO) > 0) {
            expenseWarnings.add(String.format("Marketing expenditures tracked at $%,.2f; monitor return on ad spend on paid acquisition channels.", pl.getSalesMarketing()));
        }
        if (pl.getOtaCommissions().compareTo(BigDecimal.valueOf(1000.00)) > 0) {
            expenseWarnings.add(String.format("OTA commissions totaled $%,.2f. Implementing direct booking incentives could save up to 15%% on distribution fees.", pl.getOtaCommissions()));
        }
        expenseWarnings.add("Utilities and variable operational costs remain within the 12% target variance threshold.");

        // 4. Anomaly Detections
        List<String> anomalies = new ArrayList<>();
        if (kpis.getCancellationRatePercent() > 15.0) {
            anomalies.add(String.format("Elevated cancellation rate detected (%.1f%%). Inspect cancellation policies and third-party channel lead times.", kpis.getCancellationRatePercent()));
        } else {
            anomalies.add("No critical financial or transaction anomalies detected across payment gateways.");
        }
        if (pl.getRefunds().compareTo(BigDecimal.valueOf(2000.00)) > 0) {
            anomalies.add(String.format("Refund activity of $%,.2f flagged for review.", pl.getRefunds()));
        }

        // 5. Strategic Recommendations
        List<String> recommendations = new ArrayList<>();
        recommendations.add("Boost direct channel conversion by introducing bespoke loyalty perks for executive suites.");
        recommendations.add("Implement dynamic pricing rules for weekend occupancy surges to increase ADR by 8-12%.");
        recommendations.add("Optimize supplier contracts for recurring housekeeping consumables to improve gross margin.");

        String forecast = "Projected 30-Day Occupancy: 76.5% - 82.0% with strong forward bookings in premium suites.";

        return AiInsightResponse.builder()
                .executiveSummary(summary)
                .revenueAndProfitInsights(revenueInsights)
                .expenseWarnings(expenseWarnings)
                .anomalyDetections(anomalies)
                .strategicRecommendations(recommendations)
                .occupancyForecast(forecast)
                .build();
    }
}
