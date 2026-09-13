package com.example.hotelreservation.dto.response;

import java.util.List;

public class AiInsightResponse {

    private String executiveSummary;
    private List<String> revenueAndProfitInsights;
    private List<String> expenseWarnings;
    private List<String> anomalyDetections;
    private List<String> strategicRecommendations;
    private String occupancyForecast;

    public AiInsightResponse() {}

    public AiInsightResponse(String executiveSummary, List<String> revenueAndProfitInsights,
                             List<String> expenseWarnings, List<String> anomalyDetections,
                             List<String> strategicRecommendations, String occupancyForecast) {
        this.executiveSummary = executiveSummary;
        this.revenueAndProfitInsights = revenueAndProfitInsights;
        this.expenseWarnings = expenseWarnings;
        this.anomalyDetections = anomalyDetections;
        this.strategicRecommendations = strategicRecommendations;
        this.occupancyForecast = occupancyForecast;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String executiveSummary;
        private List<String> revenueAndProfitInsights;
        private List<String> expenseWarnings;
        private List<String> anomalyDetections;
        private List<String> strategicRecommendations;
        private String occupancyForecast;

        public Builder executiveSummary(String val) { this.executiveSummary = val; return this; }
        public Builder revenueAndProfitInsights(List<String> val) { this.revenueAndProfitInsights = val; return this; }
        public Builder expenseWarnings(List<String> val) { this.expenseWarnings = val; return this; }
        public Builder anomalyDetections(List<String> val) { this.anomalyDetections = val; return this; }
        public Builder strategicRecommendations(List<String> val) { this.strategicRecommendations = val; return this; }
        public Builder occupancyForecast(String val) { this.occupancyForecast = val; return this; }

        public AiInsightResponse build() {
            return new AiInsightResponse(executiveSummary, revenueAndProfitInsights, expenseWarnings,
                    anomalyDetections, strategicRecommendations, occupancyForecast);
        }
    }

    // Getters and Setters
    public String getExecutiveSummary() { return executiveSummary; }
    public void setExecutiveSummary(String executiveSummary) { this.executiveSummary = executiveSummary; }

    public List<String> getRevenueAndProfitInsights() { return revenueAndProfitInsights; }
    public void setRevenueAndProfitInsights(List<String> revenueAndProfitInsights) { this.revenueAndProfitInsights = revenueAndProfitInsights; }

    public List<String> getExpenseWarnings() { return expenseWarnings; }
    public void setExpenseWarnings(List<String> expenseWarnings) { this.expenseWarnings = expenseWarnings; }

    public List<String> getAnomalyDetections() { return anomalyDetections; }
    public void setAnomalyDetections(List<String> anomalyDetections) { this.anomalyDetections = anomalyDetections; }

    public List<String> getStrategicRecommendations() { return strategicRecommendations; }
    public void setStrategicRecommendations(List<String> strategicRecommendations) { this.strategicRecommendations = strategicRecommendations; }

    public String getOccupancyForecast() { return occupancyForecast; }
    public void setOccupancyForecast(String occupancyForecast) { this.occupancyForecast = occupancyForecast; }
}
