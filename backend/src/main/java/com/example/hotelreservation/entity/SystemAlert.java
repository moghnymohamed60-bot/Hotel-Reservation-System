package com.example.hotelreservation.entity;

import com.example.hotelreservation.enums.AlertCategory;
import com.example.hotelreservation.enums.AlertSeverity;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "system_alerts", indexes = {
    @Index(name = "idx_alerts_created_at", columnList = "created_at"),
    @Index(name = "idx_alerts_severity", columnList = "severity"),
    @Index(name = "idx_alerts_category", columnList = "category"),
    @Index(name = "idx_alerts_status", columnList = "status")
})
public class SystemAlert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AlertSeverity severity = AlertSeverity.INFO;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private AlertCategory category = AlertCategory.SYSTEM;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(name = "related_entity", length = 100)
    private String relatedEntity;

    @Column(nullable = false, length = 20)
    private String status = "ACTIVE"; // ACTIVE, ACKNOWLEDGED, RESOLVED

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public SystemAlert() {}

    public SystemAlert(Long id, AlertSeverity severity, AlertCategory category, String title, String description,
                       String relatedEntity, String status, LocalDateTime createdAt) {
        this.id = id;
        this.severity = severity != null ? severity : AlertSeverity.INFO;
        this.category = category != null ? category : AlertCategory.SYSTEM;
        this.title = title;
        this.description = description;
        this.relatedEntity = relatedEntity;
        this.status = status != null ? status : "ACTIVE";
        this.createdAt = createdAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private AlertSeverity severity = AlertSeverity.INFO;
        private AlertCategory category = AlertCategory.SYSTEM;
        private String title;
        private String description;
        private String relatedEntity;
        private String status = "ACTIVE";
        private LocalDateTime createdAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder severity(AlertSeverity severity) { this.severity = severity; return this; }
        public Builder category(AlertCategory category) { this.category = category; return this; }
        public Builder title(String title) { this.title = title; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder relatedEntity(String relatedEntity) { this.relatedEntity = relatedEntity; return this; }
        public Builder status(String status) { this.status = status; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public SystemAlert build() {
            return new SystemAlert(id, severity, category, title, description, relatedEntity, status, createdAt);
        }
    }

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
