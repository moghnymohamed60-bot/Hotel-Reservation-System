package com.example.hotelreservation.controller;

import com.example.hotelreservation.dto.response.ApiResponse;
import com.example.hotelreservation.dto.response.AuditLogResponse;
import com.example.hotelreservation.service.AuditLogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/audit-logs")
@Tag(name = "Audit Logs", description = "Immutable System & Financial Audit Trail")
@SecurityRequirement(name = "bearerAuth")
public class AuditLogController {

    private final AuditLogService auditLogService;

    public AuditLogController(AuditLogService auditLogService) {
        this.auditLogService = auditLogService;
    }

    @GetMapping
    @Operation(summary = "Get paginated audit logs")
    public ResponseEntity<ApiResponse<Page<AuditLogResponse>>> getAuditLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Page<AuditLogResponse> logs = auditLogService.getAuditLogs(page, size);
        return ResponseEntity.ok(ApiResponse.success(logs));
    }

    @GetMapping("/recent")
    @Operation(summary = "Get recent 20 audit log entries")
    public ResponseEntity<ApiResponse<List<AuditLogResponse>>> getRecentLogs() {
        List<AuditLogResponse> logs = auditLogService.getRecentAuditLogs();
        return ResponseEntity.ok(ApiResponse.success(logs));
    }
}
