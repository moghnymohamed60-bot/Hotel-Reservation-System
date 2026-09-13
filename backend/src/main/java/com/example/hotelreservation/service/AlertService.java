package com.example.hotelreservation.service;

import com.example.hotelreservation.dto.response.SystemAlertResponse;
import com.example.hotelreservation.entity.SystemAlert;
import com.example.hotelreservation.enums.AlertCategory;
import com.example.hotelreservation.enums.AlertSeverity;
import com.example.hotelreservation.repository.SystemAlertRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AlertService {

    private final SystemAlertRepository alertRepository;

    public AlertService(SystemAlertRepository alertRepository) {
        this.alertRepository = alertRepository;
    }

    @Transactional
    public SystemAlert createAlert(AlertSeverity severity, AlertCategory category, String title,
                                   String description, String relatedEntity) {
        SystemAlert alert = SystemAlert.builder()
                .severity(severity)
                .category(category)
                .title(title)
                .description(description)
                .relatedEntity(relatedEntity)
                .status("ACTIVE")
                .build();
        return alertRepository.save(alert);
    }

    @Transactional(readOnly = true)
    public List<SystemAlertResponse> getActiveAlerts() {
        return alertRepository.findByStatusOrderByCreatedAtDesc("ACTIVE").stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SystemAlertResponse> getRecentAlerts() {
        return alertRepository.findTop10ByOrderByCreatedAtDesc().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public SystemAlertResponse acknowledgeAlert(Long alertId) {
        SystemAlert alert = alertRepository.findById(alertId)
                .orElseThrow(() -> new RuntimeException("Alert not found with id: " + alertId));
        alert.setStatus("ACKNOWLEDGED");
        return mapToResponse(alertRepository.save(alert));
    }

    private SystemAlertResponse mapToResponse(SystemAlert a) {
        return SystemAlertResponse.builder()
                .id(a.getId())
                .severity(a.getSeverity())
                .category(a.getCategory())
                .title(a.getTitle())
                .description(a.getDescription())
                .relatedEntity(a.getRelatedEntity())
                .status(a.getStatus())
                .createdAt(a.getCreatedAt())
                .build();
    }
}
