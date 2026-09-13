package com.example.hotelreservation.dto.response;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class FinancialAnalyticsResponse {

    // Time-series chart (Revenue vs Expenses vs Net Profit over months/weeks)
    private List<String> timeLabels;
    private List<BigDecimal> revenueSeries;
    private List<BigDecimal> expensesSeries;
    private List<BigDecimal> profitSeries;
    private List<BigDecimal> cashFlowSeries;

    // Breakdown charts
    private Map<String, BigDecimal> revenueByChannel;
    private Map<String, BigDecimal> revenueByRoomType;
    private Map<String, BigDecimal> revenueByPaymentMethod;
    private Map<String, BigDecimal> expensesByCategory;
    private Map<String, BigDecimal> expensesByDepartment;

    public FinancialAnalyticsResponse() {}

    public FinancialAnalyticsResponse(List<String> timeLabels, List<BigDecimal> revenueSeries, List<BigDecimal> expensesSeries,
                                      List<BigDecimal> profitSeries, List<BigDecimal> cashFlowSeries,
                                      Map<String, BigDecimal> revenueByChannel, Map<String, BigDecimal> revenueByRoomType,
                                      Map<String, BigDecimal> revenueByPaymentMethod, Map<String, BigDecimal> expensesByCategory,
                                      Map<String, BigDecimal> expensesByDepartment) {
        this.timeLabels = timeLabels;
        this.revenueSeries = revenueSeries;
        this.expensesSeries = expensesSeries;
        this.profitSeries = profitSeries;
        this.cashFlowSeries = cashFlowSeries;
        this.revenueByChannel = revenueByChannel;
        this.revenueByRoomType = revenueByRoomType;
        this.revenueByPaymentMethod = revenueByPaymentMethod;
        this.expensesByCategory = expensesByCategory;
        this.expensesByDepartment = expensesByDepartment;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private List<String> timeLabels;
        private List<BigDecimal> revenueSeries;
        private List<BigDecimal> expensesSeries;
        private List<BigDecimal> profitSeries;
        private List<BigDecimal> cashFlowSeries;
        private Map<String, BigDecimal> revenueByChannel;
        private Map<String, BigDecimal> revenueByRoomType;
        private Map<String, BigDecimal> revenueByPaymentMethod;
        private Map<String, BigDecimal> expensesByCategory;
        private Map<String, BigDecimal> expensesByDepartment;

        public Builder timeLabels(List<String> val) { this.timeLabels = val; return this; }
        public Builder revenueSeries(List<BigDecimal> val) { this.revenueSeries = val; return this; }
        public Builder expensesSeries(List<BigDecimal> val) { this.expensesSeries = val; return this; }
        public Builder profitSeries(List<BigDecimal> val) { this.profitSeries = val; return this; }
        public Builder cashFlowSeries(List<BigDecimal> val) { this.cashFlowSeries = val; return this; }
        public Builder revenueByChannel(Map<String, BigDecimal> val) { this.revenueByChannel = val; return this; }
        public Builder revenueByRoomType(Map<String, BigDecimal> val) { this.revenueByRoomType = val; return this; }
        public Builder revenueByPaymentMethod(Map<String, BigDecimal> val) { this.revenueByPaymentMethod = val; return this; }
        public Builder expensesByCategory(Map<String, BigDecimal> val) { this.expensesByCategory = val; return this; }
        public Builder expensesByDepartment(Map<String, BigDecimal> val) { this.expensesByDepartment = val; return this; }

        public FinancialAnalyticsResponse build() {
            return new FinancialAnalyticsResponse(timeLabels, revenueSeries, expensesSeries, profitSeries, cashFlowSeries,
                    revenueByChannel, revenueByRoomType, revenueByPaymentMethod, expensesByCategory, expensesByDepartment);
        }
    }

    // Getters and Setters
    public List<String> getTimeLabels() { return timeLabels; }
    public void setTimeLabels(List<String> timeLabels) { this.timeLabels = timeLabels; }

    public List<BigDecimal> getRevenueSeries() { return revenueSeries; }
    public void setRevenueSeries(List<BigDecimal> revenueSeries) { this.revenueSeries = revenueSeries; }

    public List<BigDecimal> getExpensesSeries() { return expensesSeries; }
    public void setExpensesSeries(List<BigDecimal> expensesSeries) { this.expensesSeries = expensesSeries; }

    public List<BigDecimal> getProfitSeries() { return profitSeries; }
    public void setProfitSeries(List<BigDecimal> profitSeries) { this.profitSeries = profitSeries; }

    public List<BigDecimal> getCashFlowSeries() { return cashFlowSeries; }
    public void setCashFlowSeries(List<BigDecimal> cashFlowSeries) { this.cashFlowSeries = cashFlowSeries; }

    public Map<String, BigDecimal> getRevenueByChannel() { return revenueByChannel; }
    public void setRevenueByChannel(Map<String, BigDecimal> revenueByChannel) { this.revenueByChannel = revenueByChannel; }

    public Map<String, BigDecimal> getRevenueByRoomType() { return revenueByRoomType; }
    public void setRevenueByRoomType(Map<String, BigDecimal> revenueByRoomType) { this.revenueByRoomType = revenueByRoomType; }

    public Map<String, BigDecimal> getRevenueByPaymentMethod() { return revenueByPaymentMethod; }
    public void setRevenueByPaymentMethod(Map<String, BigDecimal> revenueByPaymentMethod) { this.revenueByPaymentMethod = revenueByPaymentMethod; }

    public Map<String, BigDecimal> getExpensesByCategory() { return expensesByCategory; }
    public void setExpensesByCategory(Map<String, BigDecimal> expensesByCategory) { this.expensesByCategory = expensesByCategory; }

    public Map<String, BigDecimal> getExpensesByDepartment() { return expensesByDepartment; }
    public void setExpensesByDepartment(Map<String, BigDecimal> expensesByDepartment) { this.expensesByDepartment = expensesByDepartment; }
}
