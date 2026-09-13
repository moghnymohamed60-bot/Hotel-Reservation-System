// Enterprise Analytics and Executive Types

export interface ExecutiveKpiResponse {
  grossBookingValue: number;
  netRevenue: number;
  grossProfit: number;
  operatingExpenses: number;
  netProfit: number;
  netProfitMargin: number;
  occupancyRate: number;
  averageDailyRate: number;
  revPAR: number;
  totalBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  totalRooms: number;
  occupiedRooms: number;
  momRevenueGrowth: number;
  momBookingsGrowth: number;
  executiveNarrative: string;
}

export interface ExpenseBreakdownItem {
  category: string;
  amount: number;
  percentageOfTotal: number;
}

export interface ProfitLossResponse {
  period: string;
  grossRoomRevenue: number;
  addOnRevenue: number;
  totalRevenue: number;
  directCosts: number;
  paymentGatewayFees: number;
  channelCommissions: number;
  grossProfit: number;
  fixedOperatingCosts: number;
  variableOperatingCosts: number;
  marketingExpenses: number;
  financialExpenses: number;
  otherOperatingExpenses: number;
  totalOperatingExpenses: number;
  operatingIncomeEbitda: number;
  taxAndDepreciation: number;
  netProfit: number;
  netProfitMargin: number;
  categoryBreakdown: ExpenseBreakdownItem[];
}

export interface CashFlowItem {
  date: string;
  description: string;
  category: string;
  inflow: number;
  outflow: number;
  netChange: number;
  runningBalance: number;
}

export interface CashFlowResponse {
  period: string;
  openingBalance: number;
  totalOperatingInflows: number;
  totalOperatingOutflows: number;
  netOperatingCashFlow: number;
  closingCashBalance: number;
  cashBurnRate: number;
  cashRunwayMonths: number;
  cashFlowEntries: CashFlowItem[];
}

export interface MonthlyFinancialSummary {
  month: string;
  grossRevenue: number;
  operatingExpenses: number;
  netProfit: number;
  bookingsCount: number;
}

export interface ChannelRevenueBreakdown {
  channel: string;
  bookingCount: number;
  revenue: number;
  sharePercentage: number;
  averageBookingValue: number;
}

export interface FinancialAnalyticsResponse {
  currentPeriodKpi: ExecutiveKpiResponse;
  monthlyTrends: MonthlyFinancialSummary[];
  channelBreakdown: ChannelRevenueBreakdown[];
  recentCashFlows: CashFlowItem[];
  expenseCategoryBreakdown: ExpenseBreakdownItem[];
}

export interface ExpenseRequest {
  title: string;
  category: string;
  amount: number;
  expenseDate: string;
  vendorName?: string;
  invoiceNumber?: string;
  description?: string;
}

export interface ExpenseResponse {
  id: number;
  title: string;
  category: string;
  amount: number;
  expenseDate: string;
  vendorName: string;
  invoiceNumber: string;
  description: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAID';
  approvedBy: string;
  approvedAt: string;
  createdAt: string;
}

export interface OperationsAnalyticsResponse {
  totalRooms: number;
  availableRooms: number;
  occupiedRooms: number;
  maintenanceRooms: number;
  cleaningRooms: number;
  reservedRooms: number;
  outOfServiceRooms: number;
  currentOccupancyRate: number;
  todaysExpectedCheckIns: number;
  todaysExpectedCheckOuts: number;
  averageStayDurationNights: number;
  pendingHousekeepingTasks: number;
  urgentMaintenanceAlerts: number;
  operationalHealthScore: number;
}

export interface MarketingAnalyticsResponse {
  totalGrossBookings: number;
  totalDirectBookings: number;
  directBookingRatio: number;
  customerAcquisitionCost: number;
  estimatedCustomerLifetimeValue: number;
  ltvToCacRatio: number;
  returnOnAdSpend: number;
  totalAdSpend: number;
  topChannels: ChannelRevenueBreakdown[];
}

export interface SystemHealthResponse {
  systemStatus: string;
  activeProfile: string;
  jvmMemoryUsedMb: number;
  jvmMemoryMaxMb: number;
  jvmMemoryUsagePercent: number;
  availableProcessors: number;
  totalLiveThreads: number;
  systemUptimeSeconds: number;
  databaseStatus: string;
  databaseLatencyMs: number;
  paymentGatewayStatus: string;
  apiSuccessRatePercent: number;
  totalApiRequests24h: number;
  lastChecked: string;
}

export interface AiInsightResponse {
  id: string;
  title: string;
  category: 'REVENUE' | 'COST' | 'OPERATION' | 'MARKETING';
  insightType: 'OPPORTUNITY' | 'RISK' | 'ANOMALY' | 'RECOMMENDATION';
  summary: string;
  detailedAnalysis: string;
  confidenceScore: number;
  estimatedFinancialImpact: string;
  actionItem: string;
  urgency: 'HIGH' | 'MEDIUM' | 'LOW';
  createdAt: string;
}

export interface AuditLogResponse {
  id: number;
  userId: number;
  userEmail: string;
  action: string;
  entityName: string;
  entityId: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

export interface SystemAlertResponse {
  id: number;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  category: 'FINANCIAL' | 'OPERATIONAL' | 'SECURITY' | 'SYSTEM';
  title: string;
  message: string;
  acknowledged: boolean;
  acknowledgedBy: string;
  acknowledgedAt: string;
  createdAt: string;
}
