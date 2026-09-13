package com.example.hotelreservation.dto.response;

import java.math.BigDecimal;
import java.util.Map;

public class ProfitLossResponse {

    private String periodLabel;

    // REVENUE SECTION
    private BigDecimal roomRevenue;
    private BigDecimal addOnRevenue;
    private BigDecimal grossRevenue;

    // LESS DEDUCTIONS
    private BigDecimal refunds;
    private BigDecimal cancellationsLoss;
    private BigDecimal discounts;
    private BigDecimal netRevenue;

    // DIRECT COSTS (Cost of Sales)
    private BigDecimal otaCommissions;
    private BigDecimal paymentGatewayFees;
    private BigDecimal directHousekeepingCosts;
    private BigDecimal totalDirectCosts;
    private BigDecimal grossProfit;
    private Double grossProfitMarginPercent;

    // OPERATING EXPENSES
    private BigDecimal fixedCosts;      // Salaries, Rent, Software, Insurance
    private BigDecimal variableCosts;   // Utilities, Cleaning Supplies, Food
    private BigDecimal salesMarketing;  // Ads, Campaigns, Social Media
    private BigDecimal financialCosts;  // Bank fees, interest
    private BigDecimal otherExpenses;   // Misc
    private BigDecimal totalOperatingExpenses;
    private BigDecimal operatingProfit;

    // TAXES & FINAL NET PROFIT/LOSS
    private BigDecimal estimatedTaxes;
    private BigDecimal netProfitOrLoss;
    private Double netProfitMarginPercent;
    private Boolean isProfitable;

    public ProfitLossResponse() {}

    public ProfitLossResponse(String periodLabel, BigDecimal roomRevenue, BigDecimal addOnRevenue, BigDecimal grossRevenue,
                              BigDecimal refunds, BigDecimal cancellationsLoss, BigDecimal discounts, BigDecimal netRevenue,
                              BigDecimal otaCommissions, BigDecimal paymentGatewayFees, BigDecimal directHousekeepingCosts,
                              BigDecimal totalDirectCosts, BigDecimal grossProfit, Double grossProfitMarginPercent,
                              BigDecimal fixedCosts, BigDecimal variableCosts, BigDecimal salesMarketing, BigDecimal financialCosts,
                              BigDecimal otherExpenses, BigDecimal totalOperatingExpenses, BigDecimal operatingProfit,
                              BigDecimal estimatedTaxes, BigDecimal netProfitOrLoss, Double netProfitMarginPercent, Boolean isProfitable) {
        this.periodLabel = periodLabel;
        this.roomRevenue = roomRevenue;
        this.addOnRevenue = addOnRevenue;
        this.grossRevenue = grossRevenue;
        this.refunds = refunds;
        this.cancellationsLoss = cancellationsLoss;
        this.discounts = discounts;
        this.netRevenue = netRevenue;
        this.otaCommissions = otaCommissions;
        this.paymentGatewayFees = paymentGatewayFees;
        this.directHousekeepingCosts = directHousekeepingCosts;
        this.totalDirectCosts = totalDirectCosts;
        this.grossProfit = grossProfit;
        this.grossProfitMarginPercent = grossProfitMarginPercent;
        this.fixedCosts = fixedCosts;
        this.variableCosts = variableCosts;
        this.salesMarketing = salesMarketing;
        this.financialCosts = financialCosts;
        this.otherExpenses = otherExpenses;
        this.totalOperatingExpenses = totalOperatingExpenses;
        this.operatingProfit = operatingProfit;
        this.estimatedTaxes = estimatedTaxes;
        this.netProfitOrLoss = netProfitOrLoss;
        this.netProfitMarginPercent = netProfitMarginPercent;
        this.isProfitable = isProfitable;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String periodLabel;
        private BigDecimal roomRevenue = BigDecimal.ZERO;
        private BigDecimal addOnRevenue = BigDecimal.ZERO;
        private BigDecimal grossRevenue = BigDecimal.ZERO;
        private BigDecimal refunds = BigDecimal.ZERO;
        private BigDecimal cancellationsLoss = BigDecimal.ZERO;
        private BigDecimal discounts = BigDecimal.ZERO;
        private BigDecimal netRevenue = BigDecimal.ZERO;
        private BigDecimal otaCommissions = BigDecimal.ZERO;
        private BigDecimal paymentGatewayFees = BigDecimal.ZERO;
        private BigDecimal directHousekeepingCosts = BigDecimal.ZERO;
        private BigDecimal totalDirectCosts = BigDecimal.ZERO;
        private BigDecimal grossProfit = BigDecimal.ZERO;
        private Double grossProfitMarginPercent = 0.0;
        private BigDecimal fixedCosts = BigDecimal.ZERO;
        private BigDecimal variableCosts = BigDecimal.ZERO;
        private BigDecimal salesMarketing = BigDecimal.ZERO;
        private BigDecimal financialCosts = BigDecimal.ZERO;
        private BigDecimal otherExpenses = BigDecimal.ZERO;
        private BigDecimal totalOperatingExpenses = BigDecimal.ZERO;
        private BigDecimal operatingProfit = BigDecimal.ZERO;
        private BigDecimal estimatedTaxes = BigDecimal.ZERO;
        private BigDecimal netProfitOrLoss = BigDecimal.ZERO;
        private Double netProfitMarginPercent = 0.0;
        private Boolean isProfitable = true;

        public Builder periodLabel(String val) { this.periodLabel = val; return this; }
        public Builder roomRevenue(BigDecimal val) { this.roomRevenue = val; return this; }
        public Builder addOnRevenue(BigDecimal val) { this.addOnRevenue = val; return this; }
        public Builder grossRevenue(BigDecimal val) { this.grossRevenue = val; return this; }
        public Builder refunds(BigDecimal val) { this.refunds = val; return this; }
        public Builder cancellationsLoss(BigDecimal val) { this.cancellationsLoss = val; return this; }
        public Builder discounts(BigDecimal val) { this.discounts = val; return this; }
        public Builder netRevenue(BigDecimal val) { this.netRevenue = val; return this; }
        public Builder otaCommissions(BigDecimal val) { this.otaCommissions = val; return this; }
        public Builder paymentGatewayFees(BigDecimal val) { this.paymentGatewayFees = val; return this; }
        public Builder directHousekeepingCosts(BigDecimal val) { this.directHousekeepingCosts = val; return this; }
        public Builder totalDirectCosts(BigDecimal val) { this.totalDirectCosts = val; return this; }
        public Builder grossProfit(BigDecimal val) { this.grossProfit = val; return this; }
        public Builder grossProfitMarginPercent(Double val) { this.grossProfitMarginPercent = val; return this; }
        public Builder fixedCosts(BigDecimal val) { this.fixedCosts = val; return this; }
        public Builder variableCosts(BigDecimal val) { this.variableCosts = val; return this; }
        public Builder salesMarketing(BigDecimal val) { this.salesMarketing = val; return this; }
        public Builder financialCosts(BigDecimal val) { this.financialCosts = val; return this; }
        public Builder otherExpenses(BigDecimal val) { this.otherExpenses = val; return this; }
        public Builder totalOperatingExpenses(BigDecimal val) { this.totalOperatingExpenses = val; return this; }
        public Builder operatingProfit(BigDecimal val) { this.operatingProfit = val; return this; }
        public Builder estimatedTaxes(BigDecimal val) { this.estimatedTaxes = val; return this; }
        public Builder netProfitOrLoss(BigDecimal val) { this.netProfitOrLoss = val; return this; }
        public Builder netProfitMarginPercent(Double val) { this.netProfitMarginPercent = val; return this; }
        public Builder isProfitable(Boolean val) { this.isProfitable = val; return this; }

        public ProfitLossResponse build() {
            return new ProfitLossResponse(periodLabel, roomRevenue, addOnRevenue, grossRevenue, refunds, cancellationsLoss,
                    discounts, netRevenue, otaCommissions, paymentGatewayFees, directHousekeepingCosts, totalDirectCosts,
                    grossProfit, grossProfitMarginPercent, fixedCosts, variableCosts, salesMarketing, financialCosts,
                    otherExpenses, totalOperatingExpenses, operatingProfit, estimatedTaxes, netProfitOrLoss,
                    netProfitMarginPercent, isProfitable);
        }
    }

    // Getters and Setters
    public String getPeriodLabel() { return periodLabel; }
    public void setPeriodLabel(String periodLabel) { this.periodLabel = periodLabel; }

    public BigDecimal getRoomRevenue() { return roomRevenue; }
    public void setRoomRevenue(BigDecimal roomRevenue) { this.roomRevenue = roomRevenue; }

    public BigDecimal getAddOnRevenue() { return addOnRevenue; }
    public void setAddOnRevenue(BigDecimal addOnRevenue) { this.addOnRevenue = addOnRevenue; }

    public BigDecimal getGrossRevenue() { return grossRevenue; }
    public void setGrossRevenue(BigDecimal grossRevenue) { this.grossRevenue = grossRevenue; }

    public BigDecimal getRefunds() { return refunds; }
    public void setRefunds(BigDecimal refunds) { this.refunds = refunds; }

    public BigDecimal getCancellationsLoss() { return cancellationsLoss; }
    public void setCancellationsLoss(BigDecimal cancellationsLoss) { this.cancellationsLoss = cancellationsLoss; }

    public BigDecimal getDiscounts() { return discounts; }
    public void setDiscounts(BigDecimal discounts) { this.discounts = discounts; }

    public BigDecimal getNetRevenue() { return netRevenue; }
    public void setNetRevenue(BigDecimal netRevenue) { this.netRevenue = netRevenue; }

    public BigDecimal getOtaCommissions() { return otaCommissions; }
    public void setOtaCommissions(BigDecimal otaCommissions) { this.otaCommissions = otaCommissions; }

    public BigDecimal getPaymentGatewayFees() { return paymentGatewayFees; }
    public void setPaymentGatewayFees(BigDecimal paymentGatewayFees) { this.paymentGatewayFees = paymentGatewayFees; }

    public BigDecimal getDirectHousekeepingCosts() { return directHousekeepingCosts; }
    public void setDirectHousekeepingCosts(BigDecimal directHousekeepingCosts) { this.directHousekeepingCosts = directHousekeepingCosts; }

    public BigDecimal getTotalDirectCosts() { return totalDirectCosts; }
    public void setTotalDirectCosts(BigDecimal totalDirectCosts) { this.totalDirectCosts = totalDirectCosts; }

    public BigDecimal getGrossProfit() { return grossProfit; }
    public void setGrossProfit(BigDecimal grossProfit) { this.grossProfit = grossProfit; }

    public Double getGrossProfitMarginPercent() { return grossProfitMarginPercent; }
    public void setGrossProfitMarginPercent(Double grossProfitMarginPercent) { this.grossProfitMarginPercent = grossProfitMarginPercent; }

    public BigDecimal getFixedCosts() { return fixedCosts; }
    public void setFixedCosts(BigDecimal fixedCosts) { this.fixedCosts = fixedCosts; }

    public BigDecimal getVariableCosts() { return variableCosts; }
    public void setVariableCosts(BigDecimal variableCosts) { this.variableCosts = variableCosts; }

    public BigDecimal getSalesMarketing() { return salesMarketing; }
    public void setSalesMarketing(BigDecimal salesMarketing) { this.salesMarketing = salesMarketing; }

    public BigDecimal getFinancialCosts() { return financialCosts; }
    public void setFinancialCosts(BigDecimal financialCosts) { this.financialCosts = financialCosts; }

    public BigDecimal getOtherExpenses() { return otherExpenses; }
    public void setOtherExpenses(BigDecimal otherExpenses) { this.otherExpenses = otherExpenses; }

    public BigDecimal getTotalOperatingExpenses() { return totalOperatingExpenses; }
    public void setTotalOperatingExpenses(BigDecimal totalOperatingExpenses) { this.totalOperatingExpenses = totalOperatingExpenses; }

    public BigDecimal getOperatingProfit() { return operatingProfit; }
    public void setOperatingProfit(BigDecimal operatingProfit) { this.operatingProfit = operatingProfit; }

    public BigDecimal getEstimatedTaxes() { return estimatedTaxes; }
    public void setEstimatedTaxes(BigDecimal estimatedTaxes) { this.estimatedTaxes = estimatedTaxes; }

    public BigDecimal getNetProfitOrLoss() { return netProfitOrLoss; }
    public void setNetProfitOrLoss(BigDecimal netProfitOrLoss) { this.netProfitOrLoss = netProfitOrLoss; }

    public Double getNetProfitMarginPercent() { return netProfitMarginPercent; }
    public void setNetProfitMarginPercent(Double netProfitMarginPercent) { this.netProfitMarginPercent = netProfitMarginPercent; }

    public Boolean getIsProfitable() { return isProfitable; }
    public void setIsProfitable(Boolean isProfitable) { this.isProfitable = isProfitable; }
}
