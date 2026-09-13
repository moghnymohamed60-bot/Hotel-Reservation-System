package com.example.hotelreservation.dto.response;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class ExecutiveKpiResponse {

    // Primary Financial KPIs
    private BigDecimal grossRevenue;
    private BigDecimal netRevenue;
    private BigDecimal grossProfit;
    private BigDecimal netProfit;
    private Double profitMarginPercent;
    private Double revenueGrowthPercent;
    private Double profitGrowthPercent;

    // Operational KPIs
    private Long totalBookings;
    private Double occupancyRatePercent;
    private BigDecimal averageDailyRate; // ADR
    private BigDecimal revPar;           // Revenue Per Available Room
    private Double cancellationRatePercent;
    private BigDecimal refundAmount;
    private Double customerGrowthPercent;
    private BigDecimal averageBookingValue;

    // Period Context
    private String periodLabel;
    private String comparisonPeriodLabel;
    private String executiveSummaryNarrative;

    // Trend flags
    private Boolean isRevenuePositive;
    private Boolean isProfitPositive;
    private Boolean isOccupancyPositive;

    public ExecutiveKpiResponse() {}

    public ExecutiveKpiResponse(BigDecimal grossRevenue, BigDecimal netRevenue, BigDecimal grossProfit, BigDecimal netProfit,
                                Double profitMarginPercent, Double revenueGrowthPercent, Double profitGrowthPercent,
                                Long totalBookings, Double occupancyRatePercent, BigDecimal averageDailyRate, BigDecimal revPar,
                                Double cancellationRatePercent, BigDecimal refundAmount, Double customerGrowthPercent,
                                BigDecimal averageBookingValue, String periodLabel, String comparisonPeriodLabel,
                                String executiveSummaryNarrative, Boolean isRevenuePositive, Boolean isProfitPositive, Boolean isOccupancyPositive) {
        this.grossRevenue = grossRevenue;
        this.netRevenue = netRevenue;
        this.grossProfit = grossProfit;
        this.netProfit = netProfit;
        this.profitMarginPercent = profitMarginPercent;
        this.revenueGrowthPercent = revenueGrowthPercent;
        this.profitGrowthPercent = profitGrowthPercent;
        this.totalBookings = totalBookings;
        this.occupancyRatePercent = occupancyRatePercent;
        this.averageDailyRate = averageDailyRate;
        this.revPar = revPar;
        this.cancellationRatePercent = cancellationRatePercent;
        this.refundAmount = refundAmount;
        this.customerGrowthPercent = customerGrowthPercent;
        this.averageBookingValue = averageBookingValue;
        this.periodLabel = periodLabel;
        this.comparisonPeriodLabel = comparisonPeriodLabel;
        this.executiveSummaryNarrative = executiveSummaryNarrative;
        this.isRevenuePositive = isRevenuePositive;
        this.isProfitPositive = isProfitPositive;
        this.isOccupancyPositive = isOccupancyPositive;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private BigDecimal grossRevenue = BigDecimal.ZERO;
        private BigDecimal netRevenue = BigDecimal.ZERO;
        private BigDecimal grossProfit = BigDecimal.ZERO;
        private BigDecimal netProfit = BigDecimal.ZERO;
        private Double profitMarginPercent = 0.0;
        private Double revenueGrowthPercent = 0.0;
        private Double profitGrowthPercent = 0.0;
        private Long totalBookings = 0L;
        private Double occupancyRatePercent = 0.0;
        private BigDecimal averageDailyRate = BigDecimal.ZERO;
        private BigDecimal revPar = BigDecimal.ZERO;
        private Double cancellationRatePercent = 0.0;
        private BigDecimal refundAmount = BigDecimal.ZERO;
        private Double customerGrowthPercent = 0.0;
        private BigDecimal averageBookingValue = BigDecimal.ZERO;
        private String periodLabel;
        private String comparisonPeriodLabel;
        private String executiveSummaryNarrative;
        private Boolean isRevenuePositive = true;
        private Boolean isProfitPositive = true;
        private Boolean isOccupancyPositive = true;

        public Builder grossRevenue(BigDecimal val) { this.grossRevenue = val; return this; }
        public Builder netRevenue(BigDecimal val) { this.netRevenue = val; return this; }
        public Builder grossProfit(BigDecimal val) { this.grossProfit = val; return this; }
        public Builder netProfit(BigDecimal val) { this.netProfit = val; return this; }
        public Builder profitMarginPercent(Double val) { this.profitMarginPercent = val; return this; }
        public Builder revenueGrowthPercent(Double val) { this.revenueGrowthPercent = val; return this; }
        public Builder profitGrowthPercent(Double val) { this.profitGrowthPercent = val; return this; }
        public Builder totalBookings(Long val) { this.totalBookings = val; return this; }
        public Builder occupancyRatePercent(Double val) { this.occupancyRatePercent = val; return this; }
        public Builder averageDailyRate(BigDecimal val) { this.averageDailyRate = val; return this; }
        public Builder revPar(BigDecimal val) { this.revPar = val; return this; }
        public Builder cancellationRatePercent(Double val) { this.cancellationRatePercent = val; return this; }
        public Builder refundAmount(BigDecimal val) { this.refundAmount = val; return this; }
        public Builder customerGrowthPercent(Double val) { this.customerGrowthPercent = val; return this; }
        public Builder averageBookingValue(BigDecimal val) { this.averageBookingValue = val; return this; }
        public Builder periodLabel(String val) { this.periodLabel = val; return this; }
        public Builder comparisonPeriodLabel(String val) { this.comparisonPeriodLabel = val; return this; }
        public Builder executiveSummaryNarrative(String val) { this.executiveSummaryNarrative = val; return this; }
        public Builder isRevenuePositive(Boolean val) { this.isRevenuePositive = val; return this; }
        public Builder isProfitPositive(Boolean val) { this.isProfitPositive = val; return this; }
        public Builder isOccupancyPositive(Boolean val) { this.isOccupancyPositive = val; return this; }

        public ExecutiveKpiResponse build() {
            return new ExecutiveKpiResponse(grossRevenue, netRevenue, grossProfit, netProfit, profitMarginPercent,
                    revenueGrowthPercent, profitGrowthPercent, totalBookings, occupancyRatePercent, averageDailyRate,
                    revPar, cancellationRatePercent, refundAmount, customerGrowthPercent, averageBookingValue,
                    periodLabel, comparisonPeriodLabel, executiveSummaryNarrative, isRevenuePositive, isProfitPositive, isOccupancyPositive);
        }
    }

    // Getters and Setters
    public BigDecimal getGrossRevenue() { return grossRevenue; }
    public void setGrossRevenue(BigDecimal grossRevenue) { this.grossRevenue = grossRevenue; }

    public BigDecimal getNetRevenue() { return netRevenue; }
    public void setNetRevenue(BigDecimal netRevenue) { this.netRevenue = netRevenue; }

    public BigDecimal getGrossProfit() { return grossProfit; }
    public void setGrossProfit(BigDecimal grossProfit) { this.grossProfit = grossProfit; }

    public BigDecimal getNetProfit() { return netProfit; }
    public void setNetProfit(BigDecimal netProfit) { this.netProfit = netProfit; }

    public Double getProfitMarginPercent() { return profitMarginPercent; }
    public void setProfitMarginPercent(Double profitMarginPercent) { this.profitMarginPercent = profitMarginPercent; }

    public Double getRevenueGrowthPercent() { return revenueGrowthPercent; }
    public void setRevenueGrowthPercent(Double revenueGrowthPercent) { this.revenueGrowthPercent = revenueGrowthPercent; }

    public Double getProfitGrowthPercent() { return profitGrowthPercent; }
    public void setProfitGrowthPercent(Double profitGrowthPercent) { this.profitGrowthPercent = profitGrowthPercent; }

    public Long getTotalBookings() { return totalBookings; }
    public void setTotalBookings(Long totalBookings) { this.totalBookings = totalBookings; }

    public Double getOccupancyRatePercent() { return occupancyRatePercent; }
    public void setOccupancyRatePercent(Double occupancyRatePercent) { this.occupancyRatePercent = occupancyRatePercent; }

    public BigDecimal getAverageDailyRate() { return averageDailyRate; }
    public void setAverageDailyRate(BigDecimal averageDailyRate) { this.averageDailyRate = averageDailyRate; }

    public BigDecimal getRevPar() { return revPar; }
    public void setRevPar(BigDecimal revPar) { this.revPar = revPar; }

    public Double getCancellationRatePercent() { return cancellationRatePercent; }
    public void setCancellationRatePercent(Double cancellationRatePercent) { this.cancellationRatePercent = cancellationRatePercent; }

    public BigDecimal getRefundAmount() { return refundAmount; }
    public void setRefundAmount(BigDecimal refundAmount) { this.refundAmount = refundAmount; }

    public Double getCustomerGrowthPercent() { return customerGrowthPercent; }
    public void setCustomerGrowthPercent(Double customerGrowthPercent) { this.customerGrowthPercent = customerGrowthPercent; }

    public BigDecimal getAverageBookingValue() { return averageBookingValue; }
    public void setAverageBookingValue(BigDecimal averageBookingValue) { this.averageBookingValue = averageBookingValue; }

    public String getPeriodLabel() { return periodLabel; }
    public void setPeriodLabel(String periodLabel) { this.periodLabel = periodLabel; }

    public String getComparisonPeriodLabel() { return comparisonPeriodLabel; }
    public void setComparisonPeriodLabel(String comparisonPeriodLabel) { this.comparisonPeriodLabel = comparisonPeriodLabel; }

    public String getExecutiveSummaryNarrative() { return executiveSummaryNarrative; }
    public void setExecutiveSummaryNarrative(String executiveSummaryNarrative) { this.executiveSummaryNarrative = executiveSummaryNarrative; }

    public Boolean getIsRevenuePositive() { return isRevenuePositive; }
    public void setIsRevenuePositive(Boolean isRevenuePositive) { this.isRevenuePositive = isRevenuePositive; }

    public Boolean getIsProfitPositive() { return isProfitPositive; }
    public void setIsProfitPositive(Boolean isProfitPositive) { this.isProfitPositive = isProfitPositive; }

    public Boolean getIsOccupancyPositive() { return isOccupancyPositive; }
    public void setIsOccupancyPositive(Boolean isOccupancyPositive) { this.isOccupancyPositive = isOccupancyPositive; }
}
