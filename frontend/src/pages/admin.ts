import { adminService } from '../services/adminService';
import { hotelService } from '../services/hotelService';
import { roomService } from '../services/roomService';
import { reservationService } from '../services/reservationService';
import { userService } from '../services/userService';
import { authService } from '../services/authService';
import { EnterpriseAnalyticsService } from '../services/enterpriseAnalyticsService';
import { requireRole, setupNavigation } from '../utils/authGuard';
import { formatCurrency, formatDate, formatDateTime, getStatusBadge } from '../utils/formatters';
import { NotificationManager } from '../utils/notifications';
import { DashboardStats, Hotel, Reservation, ReservationStatus, Role, Room, RoomStatus, RoomType, User } from '../types';
import {
  ExecutiveKpiResponse,
  ProfitLossResponse,
  CashFlowResponse,
  FinancialAnalyticsResponse,
  ExpenseResponse,
  OperationsAnalyticsResponse,
  MarketingAnalyticsResponse,
  SystemHealthResponse,
  AiInsightResponse,
  AuditLogResponse,
  SystemAlertResponse,
} from '../types/enterpriseAnalytics';

// Chart.js global declaration for TypeScript
declare const Chart: any;

let ceoRevenueChartInstance: any = null;
let ceoChannelChartInstance: any = null;
let cfoExpenseChartInstance: any = null;
let cooRoomStatusChartInstance: any = null;

let currentHotelList: Hotel[] = [];
let currentEditingHotelId: number | null = null;
let currentEditingRoomId: number | null = null;
let currentEditingResId: number | null = null;

let currentProfitLossData: ProfitLossResponse | null = null;
let currentCashFlowData: CashFlowResponse | null = null;

document.addEventListener('DOMContentLoaded', async () => {
  setupNavigation();
  if (!requireRole(['ADMIN', 'STAFF', 'CEO', 'CFO', 'ACCOUNTANT', 'COO', 'CMO', 'CTO', 'MANAGER', 'EMPLOYEE'])) {
    return;
  }

  setupExecutiveSidebar();
  setupPersonaSwitcher();
  setupDateFilters();
  setupGlobalActions();
  setupAdminModals();

  // Load initial data
  await refreshAllExecutiveData();
  await loadHotelsManagement();
  await loadRoomsManagement();
  await loadReservationsManagement();
  await loadUsersManagement();
});

// =========================================================================
// EXECUTIVE SUITE NAVIGATION & PERSONA SWITCHER
// =========================================================================

function setupExecutiveSidebar(): void {
  const navItems = document.querySelectorAll('.exec-nav-item');
  navItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const tabTarget = item.getAttribute('data-tab');
      if (tabTarget) {
        switchTab(tabTarget);
      }
    });
  });
}

function switchTab(tabId: string): void {
  // Update sidebar active states
  document.querySelectorAll('.exec-nav-item').forEach((item) => {
    if (item.getAttribute('data-tab') === tabId) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // Update tab pane visibility
  const panes = document.querySelectorAll('.tab-pane');
  panes.forEach((pane) => {
    pane.classList.remove('show', 'active');
  });

  const targetPane = document.getElementById(tabId);
  if (targetPane) {
    targetPane.classList.add('show', 'active');
  }

  // Update dynamic titles
  updateSectionHeader(tabId);
}
(window as any).switchTab = switchTab;

function updateSectionHeader(tabId: string): void {
  const titleEl = document.getElementById('section-title');
  const subtitleEl = document.getElementById('section-subtitle');
  if (!titleEl || !subtitleEl) return;

  const meta: Record<string, { title: string; subtitle: string }> = {
    'tab-ceo': {
      title: 'CEO Executive Overview',
      subtitle: 'Real-time enterprise metrics, bottom-line profitability, and strategic AI intelligence.',
    },
    'tab-cfo': {
      title: 'CFO & Financial Accounting (P&L)',
      subtitle: 'Audited Profit & Loss Statement, EBITDA, and cost-structure breakdown.',
    },
    'tab-cashflow': {
      title: 'Corporate Cash Flow Ledger',
      subtitle: 'Operating inflows, vendor disbursements, net cash runway, and liquidity reserve.',
    },
    'tab-expenses': {
      title: 'Corporate Expense Register',
      subtitle: 'Multi-stage approval workflow: submit, authorize, disburse, and categorize expenses.',
    },
    'tab-coo': {
      title: 'COO Operations & Fleet Command',
      subtitle: 'Live room inventory state, check-in turnover velocity, and housekeeping readiness.',
    },
    'tab-cmo': {
      title: 'CMO Marketing & Channel Distribution',
      subtitle: 'Direct vs. OTA acquisition mix, customer lifetime value (LTV), CAC, and ROAS.',
    },
    'tab-cto': {
      title: 'CTO System Health & Infrastructure',
      subtitle: 'JVM runtime telemetry, database latency, payment gateway uptime, and API health.',
    },
    'tab-ai-insights': {
      title: 'Aura AI Executive Intelligence Feed',
      subtitle: 'Autonomous anomaly detection, dynamic pricing levers, and revenue opportunities.',
    },
    'tab-audit-logs': {
      title: 'Immutable Security & Audit Trail',
      subtitle: 'Comprehensive cryptographically timestamped records of all administrative actions.',
    },
    'tab-alerts': {
      title: 'Executive Alert & Incident Center',
      subtitle: 'System warnings, security anomalies, and pending operational notifications.',
    },
    'tab-reservations': {
      title: 'Guest Reservations Management',
      subtitle: 'Search, filter, update statuses, and inspect guest bookings across properties.',
    },
    'tab-rooms': {
      title: 'Room Inventory & Pricing Rates',
      subtitle: 'Configure room types, pricing, capacity, and operational availability status.',
    },
    'tab-hotels': {
      title: 'Hotel Properties Portfolio',
      subtitle: 'Manage hotel listings, star ratings, geographic locations, and contact details.',
    },
    'tab-users': {
      title: 'User & Staff Accounts',
      subtitle: 'System directory of registered guests, administrative staff, and executive personas.',
    },
  };

  if (meta[tabId]) {
    titleEl.textContent = meta[tabId].title;
    subtitleEl.textContent = meta[tabId].subtitle;
  }
}

function setupPersonaSwitcher(): void {
  const select = document.getElementById('executive-persona-select') as HTMLSelectElement;
  if (!select) return;

  select.addEventListener('change', () => {
    const role = select.value;
    NotificationManager.info(`Switched active view to ${role} persona`);

    // Jump to persona's designated primary tab
    if (role === 'CEO') switchTab('tab-ceo');
    else if (role === 'CFO' || role === 'ACCOUNTANT') switchTab('tab-cfo');
    else if (role === 'COO') switchTab('tab-coo');
    else if (role === 'CMO') switchTab('tab-cmo');
    else if (role === 'CTO') switchTab('tab-cto');
    else if (role === 'STAFF') switchTab('tab-reservations');
    else switchTab('tab-ceo');
  });
}

function setupDateFilters(): void {
  const select = document.getElementById('global-date-range') as HTMLSelectElement;
  if (!select) return;

  select.addEventListener('change', async () => {
    await refreshAllExecutiveData();
    NotificationManager.success('Analytics updated for selected timeframe');
  });
}

function getDateRangeParams(): { startDate?: string; endDate?: string } {
  const select = document.getElementById('global-date-range') as HTMLSelectElement;
  const val = select ? select.value : 'MTD';
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  if (val === 'TODAY') {
    return { startDate: todayStr, endDate: todayStr };
  } else if (val === 'LAST_7') {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return { startDate: d.toISOString().split('T')[0], endDate: todayStr };
  } else if (val === 'LAST_30') {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return { startDate: d.toISOString().split('T')[0], endDate: todayStr };
  } else if (val === 'MTD') {
    const d = new Date(now.getFullYear(), now.getMonth(), 1);
    return { startDate: d.toISOString().split('T')[0], endDate: todayStr };
  } else if (val === 'YTD') {
    const d = new Date(now.getFullYear(), 0, 1);
    return { startDate: d.toISOString().split('T')[0], endDate: todayStr };
  }
  return {};
}

// =========================================================================
// EXECUTIVE DATA REFRESH ORCHESTRATOR
// =========================================================================

async function refreshAllExecutiveData(): Promise<void> {
  const { startDate, endDate } = getDateRangeParams();

  try {
    // Load CEO KPIs & Charts
    await loadCeoOverview(startDate, endDate);

    // Load CFO P&L & Cash Flow
    await loadCfoFinance(startDate, endDate);
    await loadCashFlow(startDate, endDate);

    // Load Expenses
    await loadExpenses();

    // Load COO Operations
    await loadCooOperations();

    // Load CMO Marketing
    await loadCmoMarketing();

    // Load CTO Telemetry
    await loadCtoSystemHealth();

    // Load AI Insights & Alerts
    await loadAiInsights();
    await loadAlerts();
    await loadAuditLogs();
  } catch (err: any) {
    console.error('Failed refreshing executive data:', err);
  }
}

// =========================================================================
// 1. CEO EXECUTIVE OVERVIEW
// =========================================================================

async function loadCeoOverview(startDate?: string, endDate?: string): Promise<void> {
  try {
    const kpi: ExecutiveKpiResponse = await EnterpriseAnalyticsService.getExecutiveKpis(startDate, endDate);
    const analytics: FinancialAnalyticsResponse = await EnterpriseAnalyticsService.getFinancialAnalytics(startDate, endDate);

    // Update KPI Card Numbers
    const netRevEl = document.getElementById('kpi-net-revenue');
    const grossRevEl = document.getElementById('kpi-gross-revenue');
    const netProfitEl = document.getElementById('kpi-net-profit');
    const grossProfitEl = document.getElementById('kpi-gross-profit');
    const netMarginBadge = document.getElementById('kpi-net-margin');
    const revparEl = document.getElementById('kpi-revpar');
    const adrEl = document.getElementById('kpi-adr');
    const occRateEl = document.getElementById('kpi-occupancy-rate');
    const occRoomsEl = document.getElementById('kpi-occupied-rooms');
    const totalBookingsEl = document.getElementById('kpi-total-bookings');
    const revGrowthBadge = document.getElementById('kpi-rev-growth');

    if (netRevEl) netRevEl.textContent = formatCurrency(kpi.netRevenue);
    if (grossRevEl) grossRevEl.textContent = formatCurrency(kpi.grossBookingValue);
    if (netProfitEl) netProfitEl.textContent = formatCurrency(kpi.netProfit);
    if (grossProfitEl) grossProfitEl.textContent = formatCurrency(kpi.grossProfit);
    if (netMarginBadge) netMarginBadge.textContent = `${kpi.netProfitMargin.toFixed(1)}% Margin`;
    if (revparEl) revparEl.textContent = formatCurrency(kpi.revPAR);
    if (adrEl) adrEl.textContent = formatCurrency(kpi.averageDailyRate);
    if (occRateEl) occRateEl.textContent = `${kpi.occupancyRate.toFixed(1)}%`;
    if (occRoomsEl) occRoomsEl.textContent = `${kpi.occupiedRooms} / ${kpi.totalRooms}`;
    if (totalBookingsEl) totalBookingsEl.textContent = kpi.confirmedBookings.toString();
    if (revGrowthBadge) {
      revGrowthBadge.textContent = `${kpi.momRevenueGrowth >= 0 ? '+' : ''}${kpi.momRevenueGrowth.toFixed(1)}% MoM`;
    }

    // AI Narrative Banner
    const narrativeEl = document.getElementById('ceo-ai-narrative');
    if (narrativeEl && kpi.executiveNarrative) {
      narrativeEl.textContent = kpi.executiveNarrative;
    }

    // Render CEO Charts
    renderCeoRevenueChart(analytics.monthlyTrends);
    renderCeoChannelChart(analytics.channelBreakdown);
  } catch (err: any) {
    console.error('Error loading CEO metrics:', err);
  }
}

function renderCeoRevenueChart(trends: any[]): void {
  const canvas = document.getElementById('ceoRevenueChart') as HTMLCanvasElement;
  if (!canvas) return;

  const labels = trends.map((t) => t.month);
  const revData = trends.map((t) => t.grossRevenue);
  const profitData = trends.map((t) => t.netProfit);

  if (ceoRevenueChartInstance) {
    ceoRevenueChartInstance.destroy();
  }

  ceoRevenueChartInstance = new Chart(canvas, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Gross Revenue ($)',
          data: revData,
          borderColor: '#d97706',
          backgroundColor: 'rgba(217, 119, 6, 0.1)',
          fill: true,
          tension: 0.35,
          pointRadius: 4,
          pointBackgroundColor: '#d97706',
        },
        {
          label: 'Net Profit ($)',
          data: profitData,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true,
          tension: 0.35,
          pointRadius: 4,
          pointBackgroundColor: '#10b981',
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top', labels: { boxWidth: 12, font: { family: 'Outfit' } } },
      },
      scales: {
        y: {
          ticks: {
            callback: (val: any) => '$' + val.toLocaleString(),
          },
          grid: { color: 'rgba(0,0,0,0.05)' },
        },
        x: { grid: { display: false } },
      },
    },
  });
}

function renderCeoChannelChart(channels: any[]): void {
  const canvas = document.getElementById('ceoChannelChart') as HTMLCanvasElement;
  if (!canvas) return;

  const labels = channels.map((c) => c.channel.replace('_', ' '));
  const data = channels.map((c) => c.revenue);

  if (ceoChannelChartInstance) {
    ceoChannelChartInstance.destroy();
  }

  ceoChannelChartInstance = new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: ['#d97706', '#3b82f6', '#10b981', '#8b5cf6', '#64748b'],
          borderWidth: 2,
          borderColor: '#ffffff',
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 11, family: 'Plus Jakarta Sans' } } },
      },
      cutout: '65%',
    },
  });
}

// =========================================================================
// 2. CFO PROFIT & LOSS STATEMENT
// =========================================================================

async function loadCfoFinance(startDate?: string, endDate?: string): Promise<void> {
  try {
    const pl: ProfitLossResponse = await EnterpriseAnalyticsService.getProfitLoss(startDate, endDate);
    currentProfitLossData = pl;

    // Fill P&L Table elements
    const setTxt = (id: string, val: number, isNegative: boolean = false) => {
      const el = document.getElementById(id);
      if (el) {
        if (isNegative && val > 0) {
          el.textContent = `(${formatCurrency(val)})`;
        } else {
          el.textContent = formatCurrency(val);
        }
      }
    };

    setTxt('pl-room-rev', pl.grossRoomRevenue);
    setTxt('pl-addon-rev', pl.addOnRevenue);
    setTxt('pl-total-rev', pl.totalRevenue);

    setTxt('pl-gateway-fees', pl.paymentGatewayFees, true);
    setTxt('pl-channel-comm', pl.channelCommissions, true);
    setTxt('pl-gross-profit', pl.grossProfit);

    setTxt('pl-fixed-costs', pl.fixedOperatingCosts, true);
    setTxt('pl-var-costs', pl.variableOperatingCosts, true);
    setTxt('pl-marketing-costs', pl.marketingExpenses, true);
    setTxt('pl-financial-costs', pl.financialExpenses, true);
    setTxt('pl-total-opex', pl.totalOperatingExpenses, true);

    setTxt('pl-ebitda', pl.operatingIncomeEbitda);
    setTxt('pl-tax-depr', pl.taxAndDepreciation, true);
    setTxt('pl-net-profit', pl.netProfit);

    const periodLabel = document.getElementById('pl-period-label');
    if (periodLabel) periodLabel.textContent = `Period: ${pl.period}`;

    // Render CFO Expense Mix Chart
    renderCfoExpenseChart(pl.categoryBreakdown);
  } catch (err: any) {
    console.error('Error loading CFO P&L:', err);
  }
}

function renderCfoExpenseChart(breakdown: any[]): void {
  const canvas = document.getElementById('cfoExpenseChart') as HTMLCanvasElement;
  if (!canvas) return;

  const labels = breakdown.map((b) => b.category.replace('_', ' '));
  const data = breakdown.map((b) => b.amount);

  if (cfoExpenseChartInstance) {
    cfoExpenseChartInstance.destroy();
  }

  cfoExpenseChartInstance = new Chart(canvas, {
    type: 'pie',
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: ['#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6', '#6b7280'],
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10 } } },
      },
    },
  });

  // Render detail breakdown items
  const listEl = document.getElementById('cfo-expense-breakdown-list');
  if (listEl) {
    listEl.innerHTML = breakdown
      .map(
        (b) => `
      <div class="d-flex justify-content-between align-items-center py-1 border-bottom small">
        <span>${b.category.replace('_', ' ')}</span>
        <span class="fw-bold">${formatCurrency(b.amount)} <span class="text-muted fw-normal">(${b.percentageOfTotal.toFixed(1)}%)</span></span>
      </div>
    `
      )
      .join('');
  }
}

// =========================================================================
// 3. CASH FLOW STATEMENT
// =========================================================================

async function loadCashFlow(startDate?: string, endDate?: string): Promise<void> {
  try {
    const cf: CashFlowResponse = await EnterpriseAnalyticsService.getCashFlow(startDate, endDate);
    currentCashFlowData = cf;

    const opBal = document.getElementById('cf-opening-balance');
    const inFlow = document.getElementById('cf-total-inflows');
    const outFlow = document.getElementById('cf-total-outflows');
    const closeBal = document.getElementById('cf-closing-balance');

    if (opBal) opBal.textContent = formatCurrency(cf.openingBalance);
    if (inFlow) inFlow.textContent = formatCurrency(cf.totalOperatingInflows);
    if (outFlow) outFlow.textContent = formatCurrency(cf.totalOperatingOutflows);
    if (closeBal) closeBal.textContent = formatCurrency(cf.closingCashBalance);

    const tbody = document.getElementById('cashflow-table-body');
    if (tbody) {
      if (!cf.cashFlowEntries || cf.cashFlowEntries.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-3">No cash transactions logged in period.</td></tr>`;
      } else {
        tbody.innerHTML = cf.cashFlowEntries
          .map(
            (e) => `
          <tr>
            <td>${formatDate(e.date)}</td>
            <td><strong>${e.description}</strong></td>
            <td><span class="badge bg-light text-dark border">${e.category}</span></td>
            <td class="text-end text-success">${e.inflow > 0 ? '+' + formatCurrency(e.inflow) : '-'}</td>
            <td class="text-end text-danger">${e.outflow > 0 ? '-' + formatCurrency(e.outflow) : '-'}</td>
            <td class="text-end fw-bold">${formatCurrency(e.runningBalance)}</td>
          </tr>
        `
          )
          .join('');
      }
    }
  } catch (err: any) {
    console.error('Error loading Cash Flow:', err);
  }
}

// =========================================================================
// 4. EXPENSES REGISTER & APPROVAL WORKFLOW
// =========================================================================

async function loadExpenses(): Promise<void> {
  const filterSelect = document.getElementById('expense-status-filter') as HTMLSelectElement;
  const status = filterSelect ? filterSelect.value : undefined;

  try {
    const expenses: ExpenseResponse[] = await EnterpriseAnalyticsService.getAllExpenses(status);
    const tbody = document.getElementById('expense-table-body');
    if (!tbody) return;

    if (expenses.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" class="text-center text-muted py-4">No expenses found matching filter.</td></tr>`;
      return;
    }

    tbody.innerHTML = expenses
      .map(
        (e) => `
      <tr>
        <td><strong>#${e.id}</strong></td>
        <td>
          <strong>${e.title}</strong>
          ${e.description ? `<br><span class="text-muted fs-xs">${e.description}</span>` : ''}
        </td>
        <td><span class="badge bg-secondary-subtle text-secondary">${e.category.replace('_', ' ')}</span></td>
        <td>${e.vendorName || 'N/A'} ${e.invoiceNumber ? `(${e.invoiceNumber})` : ''}</td>
        <td class="fw-bold text-navy">${formatCurrency(e.amount)}</td>
        <td>${formatDate(e.expenseDate)}</td>
        <td>${getExpenseStatusBadge(e.status)}</td>
        <td>${e.approvedBy ? `<span class="small">${e.approvedBy}</span>` : '<span class="text-muted">-</span>'}</td>
        <td class="text-end">
          <div class="dropdown d-inline-block">
            <button class="btn btn-sm btn-light rounded-pill px-2" type="button" data-bs-toggle="dropdown">
              <i class="fas fa-ellipsis-v"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-end shadow-sm border-0">
              ${
                e.status === 'PENDING'
                  ? `
                <li><button class="dropdown-item text-success" onclick="window.approveExpense(${e.id})"><i class="fas fa-check me-2"></i> Approve Expense</button></li>
                <li><button class="dropdown-item text-danger" onclick="window.rejectExpense(${e.id})"><i class="fas fa-ban me-2"></i> Reject Expense</button></li>
              `
                  : ''
              }
              ${
                e.status === 'APPROVED'
                  ? `
                <li><button class="dropdown-item text-primary" onclick="window.markExpensePaid(${e.id})"><i class="fas fa-dollar-sign me-2"></i> Mark Paid & Disburse</button></li>
              `
                  : ''
              }
              <li><button class="dropdown-item text-danger" onclick="window.deleteExpense(${e.id})"><i class="fas fa-trash me-2"></i> Delete Record</button></li>
            </ul>
          </div>
        </td>
      </tr>
    `
      )
      .join('');
  } catch (err: any) {
    console.error('Error loading expenses:', err);
  }
}

function getExpenseStatusBadge(status: string): string {
  switch (status) {
    case 'APPROVED':
      return `<span class="badge bg-primary-subtle text-primary">APPROVED</span>`;
    case 'PAID':
      return `<span class="badge bg-success-subtle text-success">PAID</span>`;
    case 'REJECTED':
      return `<span class="badge bg-danger-subtle text-danger">REJECTED</span>`;
    case 'PENDING':
    default:
      return `<span class="badge bg-warning-subtle text-warning">PENDING</span>`;
  }
}

(window as any).approveExpense = async (id: number) => {
  try {
    await EnterpriseAnalyticsService.approveExpense(id);
    NotificationManager.success(`Expense #${id} authorized by Executive`);
    await loadExpenses();
    await refreshAllExecutiveData();
  } catch (err: any) {
    NotificationManager.error('Failed approving expense: ' + err.message);
  }
};

(window as any).rejectExpense = async (id: number) => {
  const reason = prompt('Enter rejection justification:');
  if (reason === null) return;
  try {
    await EnterpriseAnalyticsService.rejectExpense(id, reason);
    NotificationManager.warning(`Expense #${id} rejected`);
    await loadExpenses();
    await refreshAllExecutiveData();
  } catch (err: any) {
    NotificationManager.error('Failed rejecting expense: ' + err.message);
  }
};

(window as any).markExpensePaid = async (id: number) => {
  try {
    await EnterpriseAnalyticsService.markExpensePaid(id);
    NotificationManager.success(`Expense #${id} disbursed and ledger updated`);
    await loadExpenses();
    await refreshAllExecutiveData();
  } catch (err: any) {
    NotificationManager.error('Failed paying expense: ' + err.message);
  }
};

(window as any).deleteExpense = async (id: number) => {
  if (!confirm(`Delete expense record #${id}?`)) return;
  try {
    await EnterpriseAnalyticsService.deleteExpense(id);
    NotificationManager.success(`Expense #${id} deleted`);
    await loadExpenses();
  } catch (err: any) {
    NotificationManager.error('Failed deleting expense: ' + err.message);
  }
};

// =========================================================================
// 5. COO OPERATIONS MANAGEMENT
// =========================================================================

async function loadCooOperations(): Promise<void> {
  try {
    const ops: OperationsAnalyticsResponse = await EnterpriseAnalyticsService.getOperationsAnalytics();

    const healthEl = document.getElementById('coo-health-score');
    const checkinsEl = document.getElementById('coo-checkins');
    const checkoutsEl = document.getElementById('coo-checkouts');
    const housekeepingEl = document.getElementById('coo-housekeeping');

    if (healthEl) healthEl.textContent = `${ops.operationalHealthScore}/100`;
    if (checkinsEl) checkinsEl.textContent = ops.todaysExpectedCheckIns.toString();
    if (checkoutsEl) checkoutsEl.textContent = ops.todaysExpectedCheckOuts.toString();
    if (housekeepingEl) housekeepingEl.textContent = ops.pendingHousekeepingTasks.toString();

    // Render COO Room Status Chart
    renderCooRoomStatusChart(ops);

    // Render Matrix List
    const list = document.getElementById('coo-room-matrix-list');
    if (list) {
      list.innerHTML = `
        <li class="list-group-item d-flex justify-content-between align-items-center">
          <span><i class="fas fa-circle-check text-success me-2"></i> Available for Immediate Check-in</span>
          <span class="badge bg-success rounded-pill">${ops.availableRooms}</span>
        </li>
        <li class="list-group-item d-flex justify-content-between align-items-center">
          <span><i class="fas fa-user-lock text-primary me-2"></i> Occupied / Guest In-Room</span>
          <span class="badge bg-primary rounded-pill">${ops.occupiedRooms}</span>
        </li>
        <li class="list-group-item d-flex justify-content-between align-items-center">
          <span><i class="fas fa-broom text-warning me-2"></i> Housekeeping / Cleaning</span>
          <span class="badge bg-warning text-dark rounded-pill">${ops.cleaningRooms}</span>
        </li>
        <li class="list-group-item d-flex justify-content-between align-items-center">
          <span><i class="fas fa-wrench text-danger me-2"></i> Under Maintenance / Repair</span>
          <span class="badge bg-danger rounded-pill">${ops.maintenanceRooms}</span>
        </li>
        <li class="list-group-item d-flex justify-content-between align-items-center">
          <span><i class="fas fa-calendar text-info me-2"></i> Reserved / Arriving Soon</span>
          <span class="badge bg-info rounded-pill">${ops.reservedRooms}</span>
        </li>
      `;
    }
  } catch (err: any) {
    console.error('Error loading COO metrics:', err);
  }
}

function renderCooRoomStatusChart(ops: OperationsAnalyticsResponse): void {
  const canvas = document.getElementById('cooRoomStatusChart') as HTMLCanvasElement;
  if (!canvas) return;

  if (cooRoomStatusChartInstance) {
    cooRoomStatusChartInstance.destroy();
  }

  cooRoomStatusChartInstance = new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: ['Available', 'Occupied', 'Cleaning', 'Maintenance', 'Reserved'],
      datasets: [
        {
          data: [ops.availableRooms, ops.occupiedRooms, ops.cleaningRooms, ops.maintenanceRooms, ops.reservedRooms],
          backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'],
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 11 } } },
      },
      cutout: '60%',
    },
  });
}

// =========================================================================
// 6. CMO MARKETING & CHANNELS
// =========================================================================

async function loadCmoMarketing(): Promise<void> {
  try {
    const mkt: MarketingAnalyticsResponse = await EnterpriseAnalyticsService.getMarketingAnalytics();

    const directRatioEl = document.getElementById('cmo-direct-ratio');
    const cacEl = document.getElementById('cmo-cac');
    const ltvEl = document.getElementById('cmo-ltv');
    const roasEl = document.getElementById('cmo-roas');

    if (directRatioEl) directRatioEl.textContent = `${mkt.directBookingRatio.toFixed(1)}%`;
    if (cacEl) cacEl.textContent = formatCurrency(mkt.customerAcquisitionCost);
    if (ltvEl) ltvEl.textContent = formatCurrency(mkt.estimatedCustomerLifetimeValue);
    if (roasEl) roasEl.textContent = `${mkt.returnOnAdSpend.toFixed(1)}x`;

    const tbody = document.getElementById('cmo-channel-table-body');
    if (tbody) {
      if (!mkt.topChannels || mkt.topChannels.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-3">No channel data available.</td></tr>`;
      } else {
        tbody.innerHTML = mkt.topChannels
          .map(
            (c) => `
          <tr>
            <td><strong>${c.channel.replace('_', ' ')}</strong></td>
            <td>${c.bookingCount} bookings</td>
            <td class="fw-bold text-navy">${formatCurrency(c.revenue)}</td>
            <td><span class="badge bg-light text-dark border">${c.sharePercentage.toFixed(1)}%</span></td>
            <td>${formatCurrency(c.averageBookingValue)}</td>
          </tr>
        `
          )
          .join('');
      }
    }
  } catch (err: any) {
    console.error('Error loading CMO metrics:', err);
  }
}

// =========================================================================
// 7. CTO SYSTEM HEALTH & TELEMETRY
// =========================================================================

async function loadCtoSystemHealth(): Promise<void> {
  try {
    const health: SystemHealthResponse = await EnterpriseAnalyticsService.getSystemHealth();

    const statusEl = document.getElementById('cto-sys-status');
    const profileEl = document.getElementById('cto-profile');
    const latencyEl = document.getElementById('cto-db-latency');
    const dbStatusEl = document.getElementById('cto-db-status');
    const gatewayEl = document.getElementById('cto-gateway-status');
    const apiSuccessEl = document.getElementById('cto-api-success');
    const apiReqsEl = document.getElementById('cto-api-reqs');
    const jvmTextEl = document.getElementById('cto-jvm-text');
    const jvmBarEl = document.getElementById('cto-jvm-bar');
    const procsEl = document.getElementById('cto-processors');
    const threadsEl = document.getElementById('cto-threads');
    const uptimeEl = document.getElementById('cto-uptime');

    if (statusEl) statusEl.innerHTML = `<i class="fas fa-circle-check text-success me-1"></i> ${health.systemStatus}`;
    if (profileEl) profileEl.textContent = health.activeProfile;
    if (latencyEl) latencyEl.textContent = `${health.databaseLatencyMs} ms`;
    if (dbStatusEl) dbStatusEl.textContent = health.databaseStatus;
    if (gatewayEl) gatewayEl.textContent = health.paymentGatewayStatus;
    if (apiSuccessEl) apiSuccessEl.textContent = `${health.apiSuccessRatePercent}%`;
    if (apiReqsEl) apiReqsEl.textContent = health.totalApiRequests24h.toLocaleString();

    if (jvmTextEl) {
      jvmTextEl.textContent = `${health.jvmMemoryUsedMb} MB / ${health.jvmMemoryMaxMb} MB (${health.jvmMemoryUsagePercent.toFixed(1)}%)`;
    }
    if (jvmBarEl) {
      jvmBarEl.style.width = `${Math.min(100, health.jvmMemoryUsagePercent)}%`;
    }

    if (procsEl) procsEl.textContent = `${health.availableProcessors} Cores`;
    if (threadsEl) threadsEl.textContent = `${health.totalLiveThreads} Live Threads`;

    if (uptimeEl) {
      const hours = Math.floor(health.systemUptimeSeconds / 3600);
      const mins = Math.floor((health.systemUptimeSeconds % 3600) / 60);
      uptimeEl.textContent = `${hours}h ${mins}m active without disruption`;
    }
  } catch (err: any) {
    console.error('Error loading CTO system health:', err);
  }
}

// =========================================================================
// 8. AI EXECUTIVE INTELLIGENCE FEED
// =========================================================================

async function loadAiInsights(): Promise<void> {
  try {
    const insights: AiInsightResponse[] = await EnterpriseAnalyticsService.getAiInsights();
    const feed = document.getElementById('ai-insights-feed');
    if (!feed) return;

    if (insights.length === 0) {
      feed.innerHTML = `<div class="card p-4 text-center text-muted">No active strategic anomaly alerts. Operating in optimal parameters.</div>`;
      return;
    }

    feed.innerHTML = insights
      .map(
        (i) => `
      <div class="insight-card urgency-${i.urgency.toLowerCase()}">
        <div class="d-flex justify-content-between align-items-start mb-2">
          <div>
            <span class="badge ${getInsightTypeBadgeClass(i.insightType)} me-2">${i.insightType}</span>
            <span class="badge bg-light text-dark border me-2">${i.category}</span>
            <h5 class="fw-bold d-inline align-middle mb-0">${i.title}</h5>
          </div>
          <span class="badge bg-dark-subtle text-dark fs-xs">Confidence: ${(i.confidenceScore * 100).toFixed(0)}%</span>
        </div>
        <p class="text-secondary mb-2">${i.summary}</p>
        <div class="p-3 bg-light rounded-3 mb-2 small">
          <strong>Strategic Analysis:</strong> ${i.detailedAnalysis}
          <div class="mt-2 text-success fw-bold">
            <i class="fas fa-coins me-1"></i> Financial Impact: ${i.estimatedFinancialImpact}
          </div>
        </div>
        <div class="d-flex justify-content-between align-items-center pt-2 border-top">
          <span class="small text-muted"><i class="fas fa-lightbulb text-warning me-1"></i> <strong>Recommended Action:</strong> ${i.actionItem}</span>
          <button class="btn btn-sm btn-gold rounded-pill px-3" onclick="alert('Strategy executed: ${i.actionItem.replace(/'/g, "\\'")}')">
            <i class="fas fa-bolt me-1"></i> Execute
          </button>
        </div>
      </div>
    `
      )
      .join('');
  } catch (err: any) {
    console.error('Error loading AI insights:', err);
  }
}

(window as any).refreshAiInsights = async () => {
  NotificationManager.info('Re-evaluating revenue optimization models...');
  await loadAiInsights();
  NotificationManager.success('Aura AI models updated');
};

function getInsightTypeBadgeClass(type: string): string {
  switch (type) {
    case 'OPPORTUNITY':
      return 'bg-success';
    case 'RISK':
      return 'bg-danger';
    case 'ANOMALY':
      return 'bg-warning text-dark';
    case 'RECOMMENDATION':
    default:
      return 'bg-primary';
  }
}

// =========================================================================
// 9. AUDIT LOGS & ALERTS
// =========================================================================

async function loadAuditLogs(): Promise<void> {
  try {
    const pageData = await EnterpriseAnalyticsService.getAuditLogs(0, 25);
    const tbody = document.getElementById('audit-logs-table-body');
    if (!tbody) return;

    if (!pageData.content || pageData.content.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-3">No audit logs recorded yet.</td></tr>`;
      return;
    }

    tbody.innerHTML = pageData.content
      .map(
        (log) => `
      <tr>
        <td class="small">${formatDateTime(log.timestamp)}</td>
        <td><strong>${log.userEmail}</strong></td>
        <td><span class="badge bg-secondary-subtle text-secondary">${log.action}</span></td>
        <td>${log.entityName} ${log.entityId ? `(#${log.entityId})` : ''}</td>
        <td class="small text-muted">${log.ipAddress || '127.0.0.1'}</td>
        <td class="small">${log.details || '-'}</td>
      </tr>
    `
      )
      .join('');
  } catch (err: any) {
    console.error('Error loading audit logs:', err);
  }
}

async function loadAlerts(unacknowledgedOnly: boolean = false): Promise<void> {
  try {
    const alerts: SystemAlertResponse[] = await EnterpriseAnalyticsService.getAlerts(unacknowledgedOnly);
    const tbody = document.getElementById('alerts-table-body');
    const badge = document.getElementById('unread-alerts-count');

    const unackCount = alerts.filter((a) => !a.acknowledged).length;
    if (badge) {
      if (unackCount > 0) {
        badge.style.display = 'inline-block';
        badge.textContent = unackCount.toString();
      } else {
        badge.style.display = 'none';
      }
    }

    if (!tbody) return;

    if (alerts.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-4">No active alerts. All systems running smooth.</td></tr>`;
      return;
    }

    tbody.innerHTML = alerts
      .map(
        (a) => `
      <tr>
        <td>${getAlertSeverityBadge(a.severity)}</td>
        <td><span class="badge bg-light text-dark border">${a.category}</span></td>
        <td>
          <strong>${a.title}</strong>
          <br><span class="text-secondary small">${a.message}</span>
        </td>
        <td class="small">${formatDateTime(a.createdAt)}</td>
        <td>${a.acknowledged ? '<span class="badge bg-success">RESOLVED</span>' : '<span class="badge bg-warning text-dark">ACTIVE</span>'}</td>
        <td class="text-end">
          ${
            !a.acknowledged
              ? `<button class="btn btn-sm btn-outline-success rounded-pill px-3" onclick="window.acknowledgeAlert(${a.id})"><i class="fas fa-check me-1"></i> Resolve</button>`
              : '<span class="text-muted small">Acknowledged</span>'
          }
        </td>
      </tr>
    `
      )
      .join('');
  } catch (err: any) {
    console.error('Error loading alerts:', err);
  }
}
(window as any).loadAlerts = loadAlerts;

(window as any).acknowledgeAlert = async (id: number) => {
  try {
    await EnterpriseAnalyticsService.acknowledgeAlert(id);
    NotificationManager.success(`Alert #${id} resolved`);
    await loadAlerts();
  } catch (err: any) {
    NotificationManager.error('Failed acknowledging alert: ' + err.message);
  }
};

function getAlertSeverityBadge(severity: string): string {
  switch (severity) {
    case 'CRITICAL':
      return `<span class="badge bg-danger">CRITICAL</span>`;
    case 'WARNING':
      return `<span class="badge bg-warning text-dark">WARNING</span>`;
    case 'INFO':
    default:
      return `<span class="badge bg-info">INFO</span>`;
  }
}

// =========================================================================
// 10. HOTELS, ROOMS, RESERVATIONS & USERS (MANAGEMENT TABS)
// =========================================================================

async function loadHotelsManagement(): Promise<void> {
  const tableBody = document.getElementById('admin-hotels-table-body');
  if (!tableBody) return;

  try {
    const pageData = await hotelService.getHotels({ size: 50 });
    currentHotelList = pageData.content || [];
    populateHotelSelects();

    if (currentHotelList.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-4">No hotels found.</td></tr>`;
      return;
    }

    tableBody.innerHTML = currentHotelList
      .map(
        (h) => `
      <tr>
        <td><strong>#${h.id}</strong></td>
        <td>
          <div class="d-flex align-items-center gap-2">
            <img src="${h.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=100&q=80'}" class="rounded-2" width="40" height="40" style="object-fit: cover;">
            <div>
              <strong>${h.name}</strong><br>
              <span class="text-warning small">${'★'.repeat(h.starRating || 5)}</span>
            </div>
          </div>
        </td>
        <td>${h.city}, ${h.country}</td>
        <td>${h.phoneNumber}</td>
        <td>${h.email}</td>
        <td><span class="badge bg-light text-dark">${h.checkInTime || '14:00'} / ${h.checkOutTime || '11:00'}</span></td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-primary rounded-pill me-1" onclick="window.editHotel(${h.id})">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-sm btn-outline-danger rounded-pill" onclick="window.deleteHotel(${h.id})">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      </tr>
    `
      )
      .join('');
  } catch (err: any) {
    NotificationManager.error('Failed to load hotels: ' + err.message);
  }
}

async function loadRoomsManagement(): Promise<void> {
  const tableBody = document.getElementById('admin-rooms-table-body');
  if (!tableBody) return;

  try {
    const filterSelect = document.getElementById('room-filter-hotel') as HTMLSelectElement;
    const hotelId = filterSelect && filterSelect.value ? Number(filterSelect.value) : undefined;

    const pageData = await roomService.getRooms({ hotelId, size: 50 });
    const rooms = pageData.content || [];

    if (rooms.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="8" class="text-center text-muted py-4">No rooms found.</td></tr>`;
      return;
    }

    tableBody.innerHTML = rooms
      .map(
        (r) => `
      <tr>
        <td><strong>#${r.id}</strong></td>
        <td><strong>${r.roomNumber}</strong></td>
        <td>${r.hotelName || 'Property #' + r.hotelId}</td>
        <td><span class="badge bg-light text-dark border">${r.roomType}</span></td>
        <td>${r.capacity} Guests / Fl ${r.floor || 1}</td>
        <td class="fw-bold text-navy">${formatCurrency(r.pricePerNight)}</td>
        <td>${getRoomStatusBadge(r.status)}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-primary rounded-pill me-1" onclick="window.editRoom(${r.id})">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-sm btn-outline-danger rounded-pill" onclick="window.deleteRoom(${r.id})">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      </tr>
    `
      )
      .join('');
  } catch (err: any) {
    NotificationManager.error('Failed to load rooms: ' + err.message);
  }
}

async function loadReservationsManagement(): Promise<void> {
  const tableBody = document.getElementById('admin-reservations-table-body');
  if (!tableBody) return;

  try {
    const statusSelect = document.getElementById('res-filter-status') as HTMLSelectElement;
    const status = statusSelect && statusSelect.value ? (statusSelect.value as ReservationStatus) : undefined;

    const pageData = await reservationService.getAllReservations({ status, size: 50 });
    const reservations = pageData.content || [];

    if (reservations.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="9" class="text-center text-muted py-4">No reservations matching filter.</td></tr>`;
      return;
    }

    tableBody.innerHTML = reservations
      .map(
        (r) => `
      <tr>
        <td><strong>${r.reservationCode}</strong></td>
        <td>
          <strong>${r.userFullName || 'Guest'}</strong><br>
          <span class="text-muted small">${r.userEmail || ''}</span>
        </td>
        <td>
          ${r.hotelName}<br>
          <span class="text-muted small">Rm ${r.roomNumber} (${r.roomType})</span>
        </td>
        <td><span class="badge bg-secondary-subtle text-secondary">${(r as any).bookingChannel || 'DIRECT_WEBSITE'}</span></td>
        <td>
          ${formatDate(r.checkInDate)} - ${formatDate(r.checkOutDate)}<br>
          <span class="text-muted small">${r.totalNights} Night(s), ${r.guestCount} Guest(s)</span>
        </td>
        <td class="fw-bold text-navy">${formatCurrency(r.totalPrice)}</td>
        <td>${getStatusBadge(r.reservationStatus)}</td>
        <td>${r.paymentStatus ? `<span class="badge bg-success-subtle text-success">${r.paymentStatus}</span>` : '<span class="badge bg-light text-dark">UNPAID</span>'}</td>
        <td class="text-end">
          <div class="dropdown d-inline-block">
            <button class="btn btn-sm btn-light rounded-pill px-2" type="button" data-bs-toggle="dropdown">
              <i class="fas fa-ellipsis-v"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-end shadow-sm border-0">
              <li><button class="dropdown-item" onclick="window.openStatusModal(${r.id}, '${r.reservationStatus}')"><i class="fas fa-rotate me-2 text-primary"></i> Change Status</button></li>
              ${
                r.reservationStatus !== 'CONFIRMED'
                  ? `<li><button class="dropdown-item text-success" onclick="window.quickUpdateStatus(${r.id}, 'CONFIRMED')"><i class="fas fa-check me-2"></i> Confirm Booking</button></li>`
                  : ''
              }
              ${
                r.reservationStatus !== 'CANCELLED'
                  ? `<li><button class="dropdown-item text-danger" onclick="window.quickUpdateStatus(${r.id}, 'CANCELLED')"><i class="fas fa-ban me-2"></i> Cancel Booking</button></li>`
                  : ''
              }
            </ul>
          </div>
        </td>
      </tr>
    `
      )
      .join('');
  } catch (err: any) {
    NotificationManager.error('Failed to load reservations: ' + err.message);
  }
}

async function loadUsersManagement(): Promise<void> {
  const tableBody = document.getElementById('admin-users-table-body');
  if (!tableBody) return;

  try {
    const pageData = await userService.getAllUsers({ size: 50 });
    const users = pageData.content || [];

    if (users.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-4">No users found.</td></tr>`;
      return;
    }

    tableBody.innerHTML = users
      .map(
        (u) => `
      <tr>
        <td><strong>#${u.id}</strong></td>
        <td><strong>${u.firstName} ${u.lastName}</strong></td>
        <td>${u.email}</td>
        <td>${u.phoneNumber || 'N/A'}</td>
        <td><span class="badge ${u.role === 'ADMIN' || u.role === 'CEO' || u.role === 'CFO' ? 'bg-navy' : 'bg-light text-dark border'}">${u.role}</span></td>
        <td><span class="badge ${u.enabled ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}">${u.enabled ? 'ACTIVE' : 'DISABLED'}</span></td>
        <td class="small text-muted">${formatDate(u.createdAt)}</td>
      </tr>
    `
      )
      .join('');
  } catch (err: any) {
    console.error('Failed to load user accounts:', err);
  }
}

function getRoomStatusBadge(status: RoomStatus | string): string {
  switch (status) {
    case 'AVAILABLE':
      return `<span class="badge bg-success-subtle text-success">AVAILABLE</span>`;
    case 'OCCUPIED':
      return `<span class="badge bg-primary-subtle text-primary">OCCUPIED</span>`;
    case 'CLEANING':
      return `<span class="badge bg-warning-subtle text-warning">CLEANING</span>`;
    case 'MAINTENANCE':
      return `<span class="badge bg-danger-subtle text-danger">MAINTENANCE</span>`;
    case 'RESERVED':
      return `<span class="badge bg-info-subtle text-info">RESERVED</span>`;
    default:
      return `<span class="badge bg-secondary-subtle text-secondary">${status}</span>`;
  }
}

// =========================================================================
// CSV EXPORT & PRINT HANDLERS
// =========================================================================

function setupGlobalActions(): void {
  (window as any).exportLedgerCsv = () => {
    if (!currentProfitLossData) {
      NotificationManager.error('No P&L data loaded to export.');
      return;
    }

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'AURA STAYS ENTERPRISE P&L STATEMENT\n';
    csvContent += `Period,${currentProfitLossData.period}\n\n`;
    csvContent += 'Category,Line Item,Amount (USD)\n';
    csvContent += `Revenue,Gross Room Revenue,${currentProfitLossData.grossRoomRevenue}\n`;
    csvContent += `Revenue,Add-On Ancillary Revenue,${currentProfitLossData.addOnRevenue}\n`;
    csvContent += `Revenue,Total Operating Revenue,${currentProfitLossData.totalRevenue}\n`;
    csvContent += `Direct Costs,Payment Gateway Fees,-${currentProfitLossData.paymentGatewayFees}\n`;
    csvContent += `Direct Costs,OTA Channel Commissions,-${currentProfitLossData.channelCommissions}\n`;
    csvContent += `Profitability,Gross Profit,${currentProfitLossData.grossProfit}\n`;
    csvContent += `Operating Expenses,Fixed Operating Costs,-${currentProfitLossData.fixedOperatingCosts}\n`;
    csvContent += `Operating Expenses,Variable Costs,-${currentProfitLossData.variableOperatingCosts}\n`;
    csvContent += `Operating Expenses,Sales & Marketing,-${currentProfitLossData.marketingExpenses}\n`;
    csvContent += `Operating Expenses,Financial Costs,-${currentProfitLossData.financialExpenses}\n`;
    csvContent += `Operating Expenses,Total OPEX,-${currentProfitLossData.totalOperatingExpenses}\n`;
    csvContent += `Profitability,EBITDA,${currentProfitLossData.operatingIncomeEbitda}\n`;
    csvContent += `Taxes,Tax and Depreciation,-${currentProfitLossData.taxAndDepreciation}\n`;
    csvContent += `Bottom Line,NET PROFIT,${currentProfitLossData.netProfit}\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Aura_Stays_PL_Statement_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    NotificationManager.success('Financial P&L CSV exported successfully');
  };

  (window as any).printReport = () => {
    window.print();
  };

  (window as any).toggleDarkMode = () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    const icon = document.getElementById('theme-icon');
    if (icon) {
      icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    }
  };
}

// =========================================================================
// MODALS SETUP (HOTELS, ROOMS, EXPENSES, RESERVATION STATUS)
// =========================================================================

function setupAdminModals(): void {
  // Expense Form
  const expenseForm = document.getElementById('expense-modal-form') as HTMLFormElement;
  if (expenseForm) {
    expenseForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        const payload = {
          title: (document.getElementById('expense-form-title') as HTMLInputElement).value,
          category: (document.getElementById('expense-form-category') as HTMLSelectElement).value,
          amount: parseFloat((document.getElementById('expense-form-amount') as HTMLInputElement).value),
          expenseDate: (document.getElementById('expense-form-date') as HTMLInputElement).value,
          vendorName: (document.getElementById('expense-form-vendor') as HTMLInputElement).value,
          invoiceNumber: (document.getElementById('expense-form-invoice') as HTMLInputElement).value,
          description: (document.getElementById('expense-form-desc') as HTMLTextAreaElement).value,
        };

        await EnterpriseAnalyticsService.createExpense(payload);
        NotificationManager.success('Expense recorded successfully');

        const modalEl = document.getElementById('expenseModal');
        if (modalEl && (window as any).bootstrap) {
          const modalInstance = (window as any).bootstrap.Modal.getInstance(modalEl);
          if (modalInstance) modalInstance.hide();
        }

        expenseForm.reset();
        await loadExpenses();
        await refreshAllExecutiveData();
      } catch (err: any) {
        NotificationManager.error('Failed to create expense: ' + err.message);
      }
    });
  }

  // Hotel Form
  const hotelForm = document.getElementById('hotel-modal-form') as HTMLFormElement;
  if (hotelForm) {
    hotelForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        const payload = {
          name: (document.getElementById('hotel-form-name') as HTMLInputElement).value,
          description: (document.getElementById('hotel-form-desc') as HTMLTextAreaElement).value,
          address: (document.getElementById('hotel-form-address') as HTMLInputElement).value,
          city: (document.getElementById('hotel-form-city') as HTMLInputElement).value,
          country: (document.getElementById('hotel-form-country') as HTMLInputElement).value,
          phoneNumber: (document.getElementById('hotel-form-phone') as HTMLInputElement).value,
          email: (document.getElementById('hotel-form-email') as HTMLInputElement).value,
          starRating: parseInt((document.getElementById('hotel-form-stars') as HTMLSelectElement).value, 10),
          checkInTime: (document.getElementById('hotel-form-checkin') as HTMLInputElement).value || '14:00',
          checkOutTime: (document.getElementById('hotel-form-checkout') as HTMLInputElement).value || '11:00',
          imageUrl: (document.getElementById('hotel-form-image') as HTMLInputElement).value,
          amenities: (document.getElementById('hotel-form-amenities') as HTMLInputElement).value
            .split(',')
            .map((s) => s.trim())
            .filter((s) => s.length > 0),
        };

        if (currentEditingHotelId) {
          await hotelService.updateHotel(currentEditingHotelId, payload);
          NotificationManager.success('Hotel property updated');
        } else {
          await hotelService.createHotel(payload);
          NotificationManager.success('Hotel property added');
        }

        const modalEl = document.getElementById('hotelModal');
        if (modalEl && (window as any).bootstrap) {
          const modalInstance = (window as any).bootstrap.Modal.getInstance(modalEl);
          if (modalInstance) modalInstance.hide();
        }

        await loadHotelsManagement();
      } catch (err: any) {
        NotificationManager.error('Failed to save hotel: ' + err.message);
      }
    });
  }

  // Room Form
  const roomForm = document.getElementById('room-modal-form') as HTMLFormElement;
  if (roomForm) {
    roomForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        const payload = {
          hotelId: parseInt((document.getElementById('room-form-hotel') as HTMLSelectElement).value, 10),
          roomNumber: (document.getElementById('room-form-number') as HTMLInputElement).value,
          roomType: (document.getElementById('room-form-type') as HTMLSelectElement).value as RoomType,
          pricePerNight: parseFloat((document.getElementById('room-form-price') as HTMLInputElement).value),
          capacity: parseInt((document.getElementById('room-form-capacity') as HTMLInputElement).value, 10),
          floor: parseInt((document.getElementById('room-form-floor') as HTMLInputElement).value, 10),
          status: (document.getElementById('room-form-status') as HTMLSelectElement).value as RoomStatus,
          imageUrl: (document.getElementById('room-form-image') as HTMLInputElement).value,
          description: (document.getElementById('room-form-desc') as HTMLTextAreaElement).value,
          amenities: (document.getElementById('room-form-amenities') as HTMLInputElement).value
            .split(',')
            .map((s) => s.trim())
            .filter((s) => s.length > 0),
        };

        if (currentEditingRoomId) {
          await roomService.updateRoom(currentEditingRoomId, payload);
          NotificationManager.success('Room inventory updated');
        } else {
          await roomService.createRoom(payload);
          NotificationManager.success('Room added to inventory');
        }

        const modalEl = document.getElementById('roomModal');
        if (modalEl && (window as any).bootstrap) {
          const modalInstance = (window as any).bootstrap.Modal.getInstance(modalEl);
          if (modalInstance) modalInstance.hide();
        }

        await loadRoomsManagement();
      } catch (err: any) {
        NotificationManager.error('Failed to save room: ' + err.message);
      }
    });
  }

  // Reservation Status Save
  const saveResBtn = document.getElementById('save-res-status-btn');
  if (saveResBtn) {
    saveResBtn.addEventListener('click', async () => {
      if (!currentEditingResId) return;
      const status = (document.getElementById('modal-res-status-select') as HTMLSelectElement).value as ReservationStatus;
      const reason = (document.getElementById('modal-res-status-reason') as HTMLInputElement).value;

      try {
        await reservationService.updateReservationStatus(currentEditingResId, { status, reason });
        NotificationManager.success(`Reservation status updated to ${status}`);

        const modalEl = document.getElementById('reservationStatusModal');
        if (modalEl && (window as any).bootstrap) {
          const modalInstance = (window as any).bootstrap.Modal.getInstance(modalEl);
          if (modalInstance) modalInstance.hide();
        }

        await loadReservationsManagement();
        await refreshAllExecutiveData();
      } catch (err: any) {
        NotificationManager.error('Failed to update status: ' + err.message);
      }
    });
  }

  // Filter Listeners
  const resFilter = document.getElementById('res-filter-status');
  if (resFilter) resFilter.addEventListener('change', () => loadReservationsManagement());

  const roomFilter = document.getElementById('room-filter-hotel');
  if (roomFilter) roomFilter.addEventListener('change', () => loadRoomsManagement());

  const expenseFilter = document.getElementById('expense-status-filter');
  if (expenseFilter) expenseFilter.addEventListener('change', () => loadExpenses());
}

function populateHotelSelects(): void {
  const roomFilter = document.getElementById('room-filter-hotel') as HTMLSelectElement;
  const roomModalHotel = document.getElementById('room-form-hotel') as HTMLSelectElement;

  if (roomFilter) {
    const currentVal = roomFilter.value;
    roomFilter.innerHTML = '<option value="">All Hotels</option>' + currentHotelList.map((h) => `<option value="${h.id}">${h.name} (${h.city})</option>`).join('');
    roomFilter.value = currentVal;
  }

  if (roomModalHotel) {
    roomModalHotel.innerHTML = currentHotelList.map((h) => `<option value="${h.id}">${h.name} (${h.city})</option>`).join('');
  }
}

// Window actions
(window as any).openExpenseModal = () => {
  const form = document.getElementById('expense-modal-form') as HTMLFormElement;
  if (form) {
    form.reset();
    (document.getElementById('expense-form-date') as HTMLInputElement).value = new Date().toISOString().split('T')[0];
  }
  const modalEl = document.getElementById('expenseModal');
  if (modalEl && (window as any).bootstrap) {
    new (window as any).bootstrap.Modal(modalEl).show();
  }
};

(window as any).openNewHotelModal = () => {
  currentEditingHotelId = null;
  const form = document.getElementById('hotel-modal-form') as HTMLFormElement;
  if (form) form.reset();
  const label = document.getElementById('hotelModalLabel');
  if (label) label.textContent = 'Add New Hotel Property';

  const modalEl = document.getElementById('hotelModal');
  if (modalEl && (window as any).bootstrap) {
    new (window as any).bootstrap.Modal(modalEl).show();
  }
};

(window as any).openNewRoomModal = () => {
  currentEditingRoomId = null;
  const form = document.getElementById('room-modal-form') as HTMLFormElement;
  if (form) form.reset();
  const label = document.getElementById('roomModalLabel');
  if (label) label.textContent = 'Add Room to Inventory';

  const modalEl = document.getElementById('roomModal');
  if (modalEl && (window as any).bootstrap) {
    new (window as any).bootstrap.Modal(modalEl).show();
  }
};

(window as any).editHotel = async (id: number) => {
  try {
    const hotel = await hotelService.getHotelById(id);
    currentEditingHotelId = hotel.id;

    (document.getElementById('hotel-form-name') as HTMLInputElement).value = hotel.name;
    (document.getElementById('hotel-form-desc') as HTMLTextAreaElement).value = hotel.description || '';
    (document.getElementById('hotel-form-address') as HTMLInputElement).value = hotel.address;
    (document.getElementById('hotel-form-city') as HTMLInputElement).value = hotel.city;
    (document.getElementById('hotel-form-country') as HTMLInputElement).value = hotel.country;
    (document.getElementById('hotel-form-phone') as HTMLInputElement).value = hotel.phoneNumber;
    (document.getElementById('hotel-form-email') as HTMLInputElement).value = hotel.email;
    (document.getElementById('hotel-form-stars') as HTMLSelectElement).value = (hotel.starRating || 5).toString();
    (document.getElementById('hotel-form-checkin') as HTMLInputElement).value = hotel.checkInTime || '14:00';
    (document.getElementById('hotel-form-checkout') as HTMLInputElement).value = hotel.checkOutTime || '11:00';
    (document.getElementById('hotel-form-image') as HTMLInputElement).value = hotel.imageUrl || '';
    (document.getElementById('hotel-form-amenities') as HTMLInputElement).value = (hotel.amenities || []).join(', ');

    const label = document.getElementById('hotelModalLabel');
    if (label) label.textContent = `Edit Hotel: ${hotel.name}`;

    const modalEl = document.getElementById('hotelModal');
    if (modalEl && (window as any).bootstrap) {
      new (window as any).bootstrap.Modal(modalEl).show();
    }
  } catch (err: any) {
    NotificationManager.error('Failed to load hotel details: ' + err.message);
  }
};

(window as any).deleteHotel = async (id: number) => {
  if (!confirm(`Are you sure you want to delete Hotel #${id}?`)) return;
  try {
    await hotelService.deleteHotel(id);
    NotificationManager.success('Hotel property removed');
    await loadHotelsManagement();
  } catch (err: any) {
    NotificationManager.error('Failed to delete hotel: ' + err.message);
  }
};

(window as any).editRoom = async (id: number) => {
  try {
    const room = await roomService.getRoomById(id);
    currentEditingRoomId = room.id;

    (document.getElementById('room-form-hotel') as HTMLSelectElement).value = room.hotelId.toString();
    (document.getElementById('room-form-number') as HTMLInputElement).value = room.roomNumber;
    (document.getElementById('room-form-type') as HTMLSelectElement).value = room.roomType;
    (document.getElementById('room-form-price') as HTMLInputElement).value = room.pricePerNight.toString();
    (document.getElementById('room-form-capacity') as HTMLInputElement).value = room.capacity.toString();
    (document.getElementById('room-form-floor') as HTMLInputElement).value = (room.floor || 1).toString();
    (document.getElementById('room-form-status') as HTMLSelectElement).value = room.status;
    (document.getElementById('room-form-image') as HTMLInputElement).value = room.imageUrl || '';
    (document.getElementById('room-form-desc') as HTMLTextAreaElement).value = room.description || '';
    (document.getElementById('room-form-amenities') as HTMLInputElement).value = (room.amenities || []).join(', ');

    const label = document.getElementById('roomModalLabel');
    if (label) label.textContent = `Edit Room: ${room.roomNumber}`;

    const modalEl = document.getElementById('roomModal');
    if (modalEl && (window as any).bootstrap) {
      new (window as any).bootstrap.Modal(modalEl).show();
    }
  } catch (err: any) {
    NotificationManager.error('Failed to load room: ' + err.message);
  }
};

(window as any).deleteRoom = async (id: number) => {
  if (!confirm(`Are you sure you want to delete Room #${id}?`)) return;
  try {
    await roomService.deleteRoom(id);
    NotificationManager.success('Room removed from inventory');
    await loadRoomsManagement();
  } catch (err: any) {
    NotificationManager.error('Failed to delete room: ' + err.message);
  }
};

(window as any).openStatusModal = (resId: number, currentStatus: string) => {
  currentEditingResId = resId;
  const select = document.getElementById('modal-res-status-select') as HTMLSelectElement;
  if (select) select.value = currentStatus;
  const modalEl = document.getElementById('reservationStatusModal');
  if (modalEl && (window as any).bootstrap) {
    new (window as any).bootstrap.Modal(modalEl).show();
  }
};

(window as any).quickUpdateStatus = async (resId: number, status: ReservationStatus) => {
  try {
    await reservationService.updateReservationStatus(resId, { status });
    NotificationManager.success(`Reservation #${resId} marked as ${status}`);
    await loadReservationsManagement();
    await refreshAllExecutiveData();
  } catch (err: any) {
    NotificationManager.error('Failed to update status: ' + err.message);
  }
};
