package com.example.hotelreservation.dto.response;

import java.math.BigDecimal;
import java.util.Map;

public class CashFlowResponse {

    private String periodLabel;
    private BigDecimal openingCashBalance;
    private BigDecimal totalCashInflow;
    private BigDecimal totalCashOutflow;
    private BigDecimal netCashFlow;
    private BigDecimal closingCashBalance;

    // Inflow Breakdown
    private BigDecimal directBookingInflow;
    private BigDecimal otaPayoutInflow;
    private BigDecimal addOnServicesInflow;

    // Outflow Breakdown
    private BigDecimal operatingExpensesPaid;
    private BigDecimal refundsDisbursed;
    private BigDecimal otaCommissionsPaid;
    private BigDecimal gatewayFeesPaid;

    public CashFlowResponse() {}

    public CashFlowResponse(String periodLabel, BigDecimal openingCashBalance, BigDecimal totalCashInflow,
                            BigDecimal totalCashOutflow, BigDecimal netCashFlow, BigDecimal closingCashBalance,
                            BigDecimal directBookingInflow, BigDecimal otaPayoutInflow, BigDecimal addOnServicesInflow,
                            BigDecimal operatingExpensesPaid, BigDecimal refundsDisbursed, BigDecimal otaCommissionsPaid,
                            BigDecimal gatewayFeesPaid) {
        this.periodLabel = periodLabel;
        this.openingCashBalance = openingCashBalance;
        this.totalCashInflow = totalCashInflow;
        this.totalCashOutflow = totalCashOutflow;
        this.netCashFlow = netCashFlow;
        this.closingCashBalance = closingCashBalance;
        this.directBookingInflow = directBookingInflow;
        this.otaPayoutInflow = otaPayoutInflow;
        this.addOnServicesInflow = addOnServicesInflow;
        this.operatingExpensesPaid = operatingExpensesPaid;
        this.refundsDisbursed = refundsDisbursed;
        this.otaCommissionsPaid = otaCommissionsPaid;
        this.gatewayFeesPaid = gatewayFeesPaid;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String periodLabel;
        private BigDecimal openingCashBalance = BigDecimal.ZERO;
        private BigDecimal totalCashInflow = BigDecimal.ZERO;
        private BigDecimal totalCashOutflow = BigDecimal.ZERO;
        private BigDecimal netCashFlow = BigDecimal.ZERO;
        private BigDecimal closingCashBalance = BigDecimal.ZERO;
        private BigDecimal directBookingInflow = BigDecimal.ZERO;
        private BigDecimal otaPayoutInflow = BigDecimal.ZERO;
        private BigDecimal addOnServicesInflow = BigDecimal.ZERO;
        private BigDecimal operatingExpensesPaid = BigDecimal.ZERO;
        private BigDecimal refundsDisbursed = BigDecimal.ZERO;
        private BigDecimal otaCommissionsPaid = BigDecimal.ZERO;
        private BigDecimal gatewayFeesPaid = BigDecimal.ZERO;

        public Builder periodLabel(String val) { this.periodLabel = val; return this; }
        public Builder openingCashBalance(BigDecimal val) { this.openingCashBalance = val; return this; }
        public Builder totalCashInflow(BigDecimal val) { this.totalCashInflow = val; return this; }
        public Builder totalCashOutflow(BigDecimal val) { this.totalCashOutflow = val; return this; }
        public Builder netCashFlow(BigDecimal val) { this.netCashFlow = val; return this; }
        public Builder closingCashBalance(BigDecimal val) { this.closingCashBalance = val; return this; }
        public Builder directBookingInflow(BigDecimal val) { this.directBookingInflow = val; return this; }
        public Builder otaPayoutInflow(BigDecimal val) { this.otaPayoutInflow = val; return this; }
        public Builder addOnServicesInflow(BigDecimal val) { this.addOnServicesInflow = val; return this; }
        public Builder operatingExpensesPaid(BigDecimal val) { this.operatingExpensesPaid = val; return this; }
        public Builder refundsDisbursed(BigDecimal val) { this.refundsDisbursed = val; return this; }
        public Builder otaCommissionsPaid(BigDecimal val) { this.otaCommissionsPaid = val; return this; }
        public Builder gatewayFeesPaid(BigDecimal val) { this.gatewayFeesPaid = val; return this; }

        public CashFlowResponse build() {
            return new CashFlowResponse(periodLabel, openingCashBalance, totalCashInflow, totalCashOutflow, netCashFlow,
                    closingCashBalance, directBookingInflow, otaPayoutInflow, addOnServicesInflow, operatingExpensesPaid,
                    refundsDisbursed, otaCommissionsPaid, gatewayFeesPaid);
        }
    }

    // Getters and Setters
    public String getPeriodLabel() { return periodLabel; }
    public void setPeriodLabel(String periodLabel) { this.periodLabel = periodLabel; }

    public BigDecimal getOpeningCashBalance() { return openingCashBalance; }
    public void setOpeningCashBalance(BigDecimal openingCashBalance) { this.openingCashBalance = openingCashBalance; }

    public BigDecimal getTotalCashInflow() { return totalCashInflow; }
    public void setTotalCashInflow(BigDecimal totalCashInflow) { this.totalCashInflow = totalCashInflow; }

    public BigDecimal getTotalCashOutflow() { return totalCashOutflow; }
    public void setTotalCashOutflow(BigDecimal totalCashOutflow) { this.totalCashOutflow = totalCashOutflow; }

    public BigDecimal getNetCashFlow() { return netCashFlow; }
    public void setNetCashFlow(BigDecimal netCashFlow) { this.netCashFlow = netCashFlow; }

    public BigDecimal getClosingCashBalance() { return closingCashBalance; }
    public void setClosingCashBalance(BigDecimal closingCashBalance) { this.closingCashBalance = closingCashBalance; }

    public BigDecimal getDirectBookingInflow() { return directBookingInflow; }
    public void setDirectBookingInflow(BigDecimal directBookingInflow) { this.directBookingInflow = directBookingInflow; }

    public BigDecimal getOtaPayoutInflow() { return otaPayoutInflow; }
    public void setOtaPayoutInflow(BigDecimal otaPayoutInflow) { this.otaPayoutInflow = otaPayoutInflow; }

    public BigDecimal getAddOnServicesInflow() { return addOnServicesInflow; }
    public void setAddOnServicesInflow(BigDecimal addOnServicesInflow) { this.addOnServicesInflow = addOnServicesInflow; }

    public BigDecimal getOperatingExpensesPaid() { return operatingExpensesPaid; }
    public void setOperatingExpensesPaid(BigDecimal operatingExpensesPaid) { this.operatingExpensesPaid = operatingExpensesPaid; }

    public BigDecimal getRefundsDisbursed() { return refundsDisbursed; }
    public void setRefundsDisbursed(BigDecimal refundsDisbursed) { this.refundsDisbursed = refundsDisbursed; }

    public BigDecimal getOtaCommissionsPaid() { return otaCommissionsPaid; }
    public void setOtaCommissionsPaid(BigDecimal otaCommissionsPaid) { this.otaCommissionsPaid = otaCommissionsPaid; }

    public BigDecimal getGatewayFeesPaid() { return gatewayFeesPaid; }
    public void setGatewayFeesPaid(BigDecimal gatewayFeesPaid) { this.gatewayFeesPaid = gatewayFeesPaid; }
}
