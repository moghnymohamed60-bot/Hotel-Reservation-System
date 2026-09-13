import { ApiService } from './apiService';
import {
  ExecutiveKpiResponse,
  ProfitLossResponse,
  CashFlowResponse,
  FinancialAnalyticsResponse,
  ExpenseRequest,
  ExpenseResponse,
  OperationsAnalyticsResponse,
  MarketingAnalyticsResponse,
  SystemHealthResponse,
  AiInsightResponse,
  AuditLogResponse,
  SystemAlertResponse,
} from '../types/enterpriseAnalytics';

export class EnterpriseAnalyticsService {
  // Executive Overview
  public static async getExecutiveKpis(startDate?: string, endDate?: string): Promise<ExecutiveKpiResponse> {
    return ApiService.get<ExecutiveKpiResponse>('/admin/executive/kpis', { startDate, endDate });
  }

  // Finance & Accounting
  public static async getProfitLoss(startDate?: string, endDate?: string): Promise<ProfitLossResponse> {
    return ApiService.get<ProfitLossResponse>('/admin/finance/profit-loss', { startDate, endDate });
  }

  public static async getCashFlow(startDate?: string, endDate?: string): Promise<CashFlowResponse> {
    return ApiService.get<CashFlowResponse>('/admin/finance/cash-flow', { startDate, endDate });
  }

  public static async getFinancialAnalytics(startDate?: string, endDate?: string): Promise<FinancialAnalyticsResponse> {
    return ApiService.get<FinancialAnalyticsResponse>('/admin/finance/analytics', { startDate, endDate });
  }

  // Expense Management
  public static async getAllExpenses(status?: string, category?: string): Promise<ExpenseResponse[]> {
    return ApiService.get<ExpenseResponse[]>('/admin/expenses', { status, category });
  }

  public static async getExpenseById(id: number): Promise<ExpenseResponse> {
    return ApiService.get<ExpenseResponse>(`/admin/expenses/${id}`);
  }

  public static async createExpense(expense: ExpenseRequest): Promise<ExpenseResponse> {
    return ApiService.post<ExpenseResponse>('/admin/expenses', expense);
  }

  public static async approveExpense(id: number): Promise<ExpenseResponse> {
    return ApiService.put<ExpenseResponse>(`/admin/expenses/${id}/approve`);
  }

  public static async rejectExpense(id: number, reason?: string): Promise<ExpenseResponse> {
    return ApiService.put<ExpenseResponse>(`/admin/expenses/${id}/reject`, { reason });
  }

  public static async markExpensePaid(id: number): Promise<ExpenseResponse> {
    return ApiService.put<ExpenseResponse>(`/admin/expenses/${id}/pay`);
  }

  public static async deleteExpense(id: number): Promise<void> {
    return ApiService.delete<void>(`/admin/expenses/${id}`);
  }

  // Operations
  public static async getOperationsAnalytics(): Promise<OperationsAnalyticsResponse> {
    return ApiService.get<OperationsAnalyticsResponse>('/admin/operations/analytics');
  }

  // Marketing
  public static async getMarketingAnalytics(): Promise<MarketingAnalyticsResponse> {
    return ApiService.get<MarketingAnalyticsResponse>('/admin/marketing/analytics');
  }

  // System Health
  public static async getSystemHealth(): Promise<SystemHealthResponse> {
    return ApiService.get<SystemHealthResponse>('/admin/system/health');
  }

  // AI Intelligence
  public static async getAiInsights(): Promise<AiInsightResponse[]> {
    return ApiService.get<AiInsightResponse[]>('/admin/ai/insights');
  }

  // Audit Logs
  public static async getAuditLogs(page: number = 0, size: number = 20): Promise<{ content: AuditLogResponse[]; totalElements: number; totalPages: number }> {
    return ApiService.get<{ content: AuditLogResponse[]; totalElements: number; totalPages: number }>('/admin/audit-logs', { page, size });
  }

  // Alerts
  public static async getAlerts(unacknowledgedOnly: boolean = false): Promise<SystemAlertResponse[]> {
    return ApiService.get<SystemAlertResponse[]>('/admin/alerts', { unacknowledgedOnly });
  }

  public static async acknowledgeAlert(id: number): Promise<SystemAlertResponse> {
    return ApiService.put<SystemAlertResponse>(`/admin/alerts/${id}/acknowledge`);
  }
}
