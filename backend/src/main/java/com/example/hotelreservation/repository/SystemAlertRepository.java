package com.example.hotelreservation.repository;

import com.example.hotelreservation.entity.SystemAlert;
import com.example.hotelreservation.enums.AlertSeverity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SystemAlertRepository extends JpaRepository<SystemAlert, Long> {

    List<SystemAlert> findByStatusOrderByCreatedAtDesc(String status);

    List<SystemAlert> findTop10ByOrderByCreatedAtDesc();

    Page<SystemAlert> findBySeverityOrderByCreatedAtDesc(AlertSeverity severity, Pageable pageable);

    long countByStatus(String status);
}
