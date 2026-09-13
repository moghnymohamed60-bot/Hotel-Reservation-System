package com.example.hotelreservation.dto.response;

import java.math.BigDecimal;
import java.util.Map;

public class MarketingAnalyticsResponse {

    private Map<String, Long> bookingsByChannel;
    private Map<String, BigDecimal> revenueByChannel;
    private BigDecimal totalMarketingSpend;
    private BigDecimal customerAcquisitionCost; // CAC
    private BigDecimal customerLifetimeValue;    // LTV
    private Double returnOnAdSpendMultiplier;   // ROAS
    private Double conversionRatePercent;
    private Long repeatCustomersCount;
    private Double repeatCustomerRatePercent;

    public MarketingAnalyticsResponse() {}

    public MarketingAnalyticsResponse(Map<String, Long> bookingsByChannel, Map<String, BigDecimal> revenueByChannel,
                                      BigDecimal totalMarketingSpend, BigDecimal customerAcquisitionCost,
                                      BigDecimal customerLifetimeValue, Double returnOnAdSpendMultiplier,
                                      Double conversionRatePercent, Long repeatCustomersCount, Double repeatCustomerRatePercent) {
        this.bookingsByChannel = bookingsByChannel;
        this.revenueByChannel = revenueByChannel;
        this.totalMarketingSpend = totalMarketingSpend;
        this.customerAcquisitionCost = customerAcquisitionCost;
        this.customerLifetimeValue = customerLifetimeValue;
        this.returnOnAdSpendMultiplier = returnOnAdSpendMultiplier;
        this.conversionRatePercent = conversionRatePercent;
        this.repeatCustomersCount = repeatCustomersCount;
        this.repeatCustomerRatePercent = repeatCustomerRatePercent;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Map<String, Long> bookingsByChannel;
        private Map<String, BigDecimal> revenueByChannel;
        private BigDecimal totalMarketingSpend = BigDecimal.ZERO;
        private BigDecimal customerAcquisitionCost = BigDecimal.ZERO;
        private BigDecimal customerLifetimeValue = BigDecimal.ZERO;
        private Double returnOnAdSpendMultiplier = 0.0;
        private Double conversionRatePercent = 0.0;
        private Long repeatCustomersCount = 0L;
        private Double repeatCustomerRatePercent = 0.0;

        public Builder bookingsByChannel(Map<String, Long> val) { this.bookingsByChannel = val; return this; }
        public Builder revenueByChannel(Map<String, BigDecimal> val) { this.revenueByChannel = val; return this; }
        public Builder totalMarketingSpend(BigDecimal val) { this.totalMarketingSpend = val; return this; }
        public Builder customerAcquisitionCost(BigDecimal val) { this.customerAcquisitionCost = val; return this; }
        public Builder customerLifetimeValue(BigDecimal val) { this.customerLifetimeValue = val; return this; }
        public Builder returnOnAdSpendMultiplier(Double val) { this.returnOnAdSpendMultiplier = val; return this; }
        public Builder conversionRatePercent(Double val) { this.conversionRatePercent = val; return this; }
        public Builder repeatCustomersCount(Long val) { this.repeatCustomersCount = val; return this; }
        public Builder repeatCustomerRatePercent(Double val) { this.repeatCustomerRatePercent = val; return this; }

        public MarketingAnalyticsResponse build() {
            return new MarketingAnalyticsResponse(bookingsByChannel, revenueByChannel, totalMarketingSpend,
                    customerAcquisitionCost, customerLifetimeValue, returnOnAdSpendMultiplier, conversionRatePercent,
                    repeatCustomersCount, repeatCustomerRatePercent);
        }
    }

    // Getters and Setters
    public Map<String, Long> getBookingsByChannel() { return bookingsByChannel; }
    public void setBookingsByChannel(Map<String, Long> bookingsByChannel) { this.bookingsByChannel = bookingsByChannel; }

    public Map<String, BigDecimal> getRevenueByChannel() { return revenueByChannel; }
    public void setRevenueByChannel(Map<String, BigDecimal> revenueByChannel) { this.revenueByChannel = revenueByChannel; }

    public BigDecimal getTotalMarketingSpend() { return totalMarketingSpend; }
    public void setTotalMarketingSpend(BigDecimal totalMarketingSpend) { this.totalMarketingSpend = totalMarketingSpend; }

    public BigDecimal getCustomerAcquisitionCost() { return customerAcquisitionCost; }
    public void setCustomerAcquisitionCost(BigDecimal customerAcquisitionCost) { this.customerAcquisitionCost = customerAcquisitionCost; }

    public BigDecimal getCustomerLifetimeValue() { return customerLifetimeValue; }
    public void setCustomerLifetimeValue(BigDecimal customerLifetimeValue) { this.customerLifetimeValue = customerLifetimeValue; }

    public Double getReturnOnAdSpendMultiplier() { return returnOnAdSpendMultiplier; }
    public void setReturnOnAdSpendMultiplier(Double returnOnAdSpendMultiplier) { this.returnOnAdSpendMultiplier = returnOnAdSpendMultiplier; }

    public Double getConversionRatePercent() { return conversionRatePercent; }
    public void setConversionRatePercent(Double conversionRatePercent) { this.conversionRatePercent = conversionRatePercent; }

    public Long getRepeatCustomersCount() { return repeatCustomersCount; }
    public void setRepeatCustomersCount(Long repeatCustomersCount) { this.repeatCustomersCount = repeatCustomersCount; }

    public Double getRepeatCustomerRatePercent() { return repeatCustomerRatePercent; }
    public void setRepeatCustomerRatePercent(Double repeatCustomerRatePercent) { this.repeatCustomerRatePercent = repeatCustomerRatePercent; }
}
