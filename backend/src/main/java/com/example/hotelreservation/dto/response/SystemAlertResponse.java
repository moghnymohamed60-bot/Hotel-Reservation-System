package com.example.hotelreservation.dto.response;

import com.example.hotelreservation.enums.AlertCategory;
import com.example.hotelreservation.enums.AlertSeverity;

import java.time.LocalDateTime;

public class SystemAlertResponse {

    private Long id;
    private AlertSeverity severity;
    private AlertCategory category;
    private String title;
    private String description;
    private String relatedEntity;
    private String status;
    private LocalDateTime createdAt;

    public SystemAlertResponse() {}

    public SystemAlertResponse(Long id, AlertSeverity severity, AlertCategory category, String title,
                               String description, String relatedEntity, String status, LocalDateTime createdAt) {
        this.id = id;
        this.severity = severity;
        this.category = category;
        this.title = title;
        this.description = description;
        this.relatedEntity = relatedEntity;
        this.status = status;
        this.createdAt = createdAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private AlertSeverity severity;
        private AlertCategory category;
        private String title;
        private String description;
        private String relatedEntity;
        private String status;
        private LocalDateTime createdAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder severity(AlertSeverity severity) { this.severity = severity; return this; }
        public Builder category(AlertCategory category) { this.category = category; return this; }
        public Builder title(String title) { this.title = title; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder relatedEntity(String relatedEntity) { this.relatedEntity = relatedEntity; return this; }
        public Builder status(String status) { this.status = status; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public SystemAlertResponse build() {
            return new SystemAlertResponse(id, severity, category, title, description, relatedEntity, status, createdAt);
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public AlertSeverity getSeverity() { return severity; }
    public void setSeverity(AlertSeverity severity) { this.severity = severity; }

    public AlertCategory getCategory() { return category; }
    public void setCategory(AlertCategory category) { this.category = category; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getRelatedEntity() { return relatedEntity; }
    public void setRelatedEntity(String relatedEntity) { this.relatedEntity = relatedEntity; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
