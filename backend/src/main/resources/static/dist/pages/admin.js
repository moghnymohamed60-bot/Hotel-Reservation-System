// src/services/apiService.ts
var ApiService = class {
  static BASE_URL = "/api";
  static TOKEN_KEY = "hotel_app_jwt";
  static USER_KEY = "hotel_app_user";
  static getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  }
  static setToken(token) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }
  static getUser() {
    const raw = localStorage.getItem(this.USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }
  static setUser(user) {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }
  static clearSession() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }
  static isAuthenticated() {
    return !!this.getToken();
  }
  static async request(endpoint, options = {}) {
    const url = `${this.BASE_URL}${endpoint.startsWith("/") ? endpoint : "/" + endpoint}`;
    const token = this.getToken();
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers || {}
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    try {
      const response = await fetch(url, {
        ...options,
        headers
      });
      if (response.status === 401) {
        const currentPath = window.location.pathname;
        if (!currentPath.includes("login.html") && !currentPath.includes("register.html")) {
          this.clearSession();
          window.location.href = "login.html?expired=true";
        }
      }
      const json = await response.json();
      if (!response.ok) {
        let errorMessage = json.message || "An error occurred during request";
        if (json.validationErrors) {
          const details = Object.entries(json.validationErrors).map(([k, v]) => `${k}: ${v}`).join("\n");
          errorMessage += `
${details}`;
        }
        throw new Error(errorMessage);
      }
      if (json && typeof json === "object" && "data" in json && "success" in json) {
        return json.data;
      }
      return json;
    } catch (error) {
      console.error(`API Request Error [${endpoint}]:`, error);
      throw error;
    }
  }
  static get(endpoint, params) {
    let url = endpoint;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== void 0 && value !== null && value !== "") {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += (url.includes("?") ? "&" : "?") + queryString;
      }
    }
    return this.request(url, { method: "GET" });
  }
  static post(endpoint, body) {
    return this.request(endpoint, {
      method: "POST",
      body: body ? JSON.stringify(body) : void 0
    });
  }
  static put(endpoint, body) {
    return this.request(endpoint, {
      method: "PUT",
      body: body ? JSON.stringify(body) : void 0
    });
  }
  static patch(endpoint, body, params) {
    let url = endpoint;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== void 0 && value !== null && value !== "") {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += (url.includes("?") ? "&" : "?") + queryString;
      }
    }
    return this.request(url, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : void 0
    });
  }
  static delete(endpoint) {
    return this.request(endpoint, { method: "DELETE" });
  }
};

// src/services/hotelService.ts
var hotelService = {
  async getHotels(params) {
    return ApiService.get("/hotels", params);
  },
  async getHotelById(id) {
    return ApiService.get(`/hotels/${id}`);
  },
  async getCities() {
    return ApiService.get("/hotels/cities");
  },
  async createHotel(hotel) {
    return ApiService.post("/hotels", hotel);
  },
  async updateHotel(id, hotel) {
    return ApiService.put(`/hotels/${id}`, hotel);
  },
  async deleteHotel(id) {
    return ApiService.delete(`/hotels/${id}`);
  }
};

// src/services/roomService.ts
var roomService = {
  async getRooms(params) {
    return ApiService.get("/rooms", params);
  },
  async getRoomById(id) {
    return ApiService.get(`/rooms/${id}`);
  },
  async getRoomsByHotelId(hotelId) {
    return ApiService.get(`/rooms/hotel/${hotelId}`);
  },
  async findAvailableRooms(params) {
    return ApiService.get("/rooms/available", params);
  },
  async createRoom(room) {
    return ApiService.post("/rooms", room);
  },
  async updateRoom(id, room) {
    return ApiService.put(`/rooms/${id}`, room);
  },
  async updateRoomStatus(id, status) {
    return ApiService.patch(`/rooms/${id}/status`, void 0, { status });
  },
  async deleteRoom(id) {
    return ApiService.delete(`/rooms/${id}`);
  }
};

// src/services/reservationService.ts
var reservationService = {
  async createReservation(data) {
    return ApiService.post("/reservations", data);
  },
  async getMyReservations() {
    return ApiService.get("/reservations/my");
  },
  async getReservations(params) {
    return ApiService.get("/reservations", params);
  },
  async getReservationById(id) {
    return ApiService.get(`/reservations/${id}`);
  },
  async getReservationByCode(code) {
    return ApiService.get(`/reservations/code/${code}`);
  },
  async cancelReservation(id) {
    return ApiService.patch(`/reservations/${id}/cancel`);
  },
  async updateReservationStatus(id, status, reason) {
    return ApiService.patch(`/reservations/${id}/status`, { status, reason });
  }
};

// src/services/userService.ts
var userService = {
  async getUsers(params) {
    return ApiService.get("/users", params);
  },
  async getUserById(id) {
    return ApiService.get(`/users/${id}`);
  },
  async updateUser(id, data) {
    return ApiService.put(`/users/${id}`, data);
  },
  async changePassword(id, data) {
    return ApiService.post(`/users/${id}/change-password`, data);
  },
  async deleteUser(id) {
    return ApiService.delete(`/users/${id}`);
  }
};

// src/services/enterpriseAnalyticsService.ts
var EnterpriseAnalyticsService = class {
  // Executive Overview
  static async getExecutiveKpis(startDate, endDate) {
    return ApiService.get("/admin/executive/kpis", { startDate, endDate });
  }
  // Finance & Accounting
  static async getProfitLoss(startDate, endDate) {
    return ApiService.get("/admin/finance/profit-loss", { startDate, endDate });
  }
  static async getCashFlow(startDate, endDate) {
    return ApiService.get("/admin/finance/cash-flow", { startDate, endDate });
  }
  static async getFinancialAnalytics(startDate, endDate) {
    return ApiService.get("/admin/finance/analytics", { startDate, endDate });
  }
  // Expense Management
  static async getAllExpenses(status, category) {
    return ApiService.get("/admin/expenses", { status, category });
  }
  static async getExpenseById(id) {
    return ApiService.get(`/admin/expenses/${id}`);
  }
  static async createExpense(expense) {
    return ApiService.post("/admin/expenses", expense);
  }
  static async approveExpense(id) {
    return ApiService.put(`/admin/expenses/${id}/approve`);
  }
  static async rejectExpense(id, reason) {
    return ApiService.put(`/admin/expenses/${id}/reject`, { reason });
  }
  static async markExpensePaid(id) {
    return ApiService.put(`/admin/expenses/${id}/pay`);
  }
  static async deleteExpense(id) {
    return ApiService.delete(`/admin/expenses/${id}`);
  }
  // Operations
  static async getOperationsAnalytics() {
    return ApiService.get("/admin/operations/analytics");
  }
  // Marketing
  static async getMarketingAnalytics() {
    return ApiService.get("/admin/marketing/analytics");
  }
  // System Health
  static async getSystemHealth() {
    return ApiService.get("/admin/system/health");
  }
  // AI Intelligence
  static async getAiInsights() {
    return ApiService.get("/admin/ai/insights");
  }
  // Audit Logs
  static async getAuditLogs(page = 0, size = 20) {
    return ApiService.get("/admin/audit-logs", { page, size });
  }
  // Alerts
  static async getAlerts(unacknowledgedOnly = false) {
    return ApiService.get("/admin/alerts", { unacknowledgedOnly });
  }
  static async acknowledgeAlert(id) {
    return ApiService.put(`/admin/alerts/${id}/acknowledge`);
  }
};

// src/services/authService.ts
var authService = {
  async register(data) {
    const res = await ApiService.post("/auth/register", data);
    ApiService.setToken(res.token);
    ApiService.setUser(res.user);
    return res;
  },
  async login(data) {
    const res = await ApiService.post("/auth/login", data);
    ApiService.setToken(res.token);
    ApiService.setUser(res.user);
    return res;
  },
  async getCurrentUser() {
    const user = await ApiService.get("/auth/me");
    ApiService.setUser(user);
    return user;
  },
  logout() {
    ApiService.clearSession();
    window.location.href = "login.html";
  },
  getCurrentStoredUser() {
    return ApiService.getUser();
  },
  isLoggedIn() {
    return ApiService.isAuthenticated();
  },
  isAdmin() {
    const user = this.getCurrentStoredUser();
    return user?.role === "ADMIN";
  },
  isStaffOrAdmin() {
    const user = this.getCurrentStoredUser();
    return user?.role === "ADMIN" || user?.role === "STAFF";
  }
};

// src/utils/authGuard.ts
function setupNavigation() {
  const user = authService.getCurrentStoredUser();
  const navContainer = document.getElementById("auth-nav-items");
  if (!navContainer) return;
  if (user) {
    let dashboardLink = "";
    if (user.role === "ADMIN" || user.role === "STAFF") {
      dashboardLink = `
        <li class="nav-item">
          <a class="nav-link text-warning fw-semibold" href="admin.html">
            <i class="fas fa-shield-alt me-1"></i> Management Console
          </a>
        </li>
      `;
    }
    navContainer.innerHTML = `
      <li class="nav-item">
        <a class="nav-link" href="my-reservations.html"><i class="fas fa-calendar-check me-1"></i> My Bookings</a>
      </li>
      ${dashboardLink}
      <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle d-flex align-items-center gap-2" href="#" role="button" data-bs-toggle="dropdown">
          <span class="user-avatar-badge">${user.firstName.charAt(0)}</span>
          <span>${user.firstName}</span>
        </a>
        <ul class="dropdown-menu dropdown-menu-end shadow-sm">
          <li><h6 class="dropdown-header">${user.fullName} (${user.role})</h6></li>
          <li><a class="dropdown-item" href="profile.html"><i class="fas fa-user-circle me-2"></i>Profile Settings</a></li>
          <li><a class="dropdown-item" href="my-reservations.html"><i class="fas fa-receipt me-2"></i>My Bookings</a></li>
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item text-danger" href="javascript:void(0)" id="nav-logout-btn"><i class="fas fa-sign-out-alt me-2"></i>Logout</a></li>
        </ul>
      </li>
    `;
    document.getElementById("nav-logout-btn")?.addEventListener("click", () => {
      authService.logout();
    });
  } else {
    navContainer.innerHTML = `
      <li class="nav-item">
        <a class="nav-link" href="login.html"><i class="fas fa-sign-in-alt me-1"></i> Sign In</a>
      </li>
      <li class="nav-item ms-lg-2">
        <a class="btn btn-gold btn-sm px-3 rounded-pill" href="register.html">Sign Up</a>
      </li>
    `;
  }
}
function requireAuth() {
  if (!authService.isLoggedIn()) {
    window.location.href = `login.html?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`;
    return false;
  }
  return true;
}
function requireRole(allowedRoles) {
  if (!requireAuth()) return false;
  const user = authService.getCurrentStoredUser();
  if (!user || !allowedRoles.includes(user.role)) {
    window.location.href = "index.html?error=unauthorized";
    return false;
  }
  return true;
}

// src/utils/formatters.ts
function formatCurrency(amount) {
  if (amount === void 0 || amount === null) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(amount);
}
function formatDate(dateString) {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    }).format(date);
  } catch {
    return dateString;
  }
}
function formatDateTime(dateTimeString) {
  if (!dateTimeString) return "-";
  try {
    const date = new Date(dateTimeString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(date);
  } catch {
    return dateTimeString;
  }
}
function getStatusBadge(status) {
  switch (status) {
    case "CONFIRMED":
    case "PAID":
    case "ACTIVE":
    case "AVAILABLE":
      return `<span class="badge bg-success-subtle text-success border border-success-subtle px-2 py-1"><i class="fas fa-check-circle me-1"></i>${status}</span>`;
    case "PENDING":
      return `<span class="badge bg-warning-subtle text-warning border border-warning-subtle px-2 py-1"><i class="fas fa-clock me-1"></i>${status}</span>`;
    case "CANCELLED":
    case "FAILED":
    case "SUSPENDED":
    case "INACTIVE":
      return `<span class="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1"><i class="fas fa-times-circle me-1"></i>${status}</span>`;
    case "COMPLETED":
      return `<span class="badge bg-info-subtle text-info border border-info-subtle px-2 py-1"><i class="fas fa-flag-checkered me-1"></i>${status}</span>`;
    case "OCCUPIED":
      return `<span class="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1"><i class="fas fa-user-lock me-1"></i>${status}</span>`;
    case "MAINTENANCE":
      return `<span class="badge bg-secondary-subtle text-secondary border border-secondary-subtle px-2 py-1"><i class="fas fa-tools me-1"></i>${status}</span>`;
    default:
      return `<span class="badge bg-light text-dark px-2 py-1">${status}</span>`;
  }
}

// src/utils/notifications.ts
var NotificationManager = class {
  static container = null;
  static getContainer() {
    if (!this.container) {
      this.container = document.createElement("div");
      this.container.className = "toast-container position-fixed bottom-0 end-0 p-3";
      this.container.style.zIndex = "9999";
      document.body.appendChild(this.container);
    }
    return this.container;
  }
  static showToast(message, type = "info", title) {
    const container = this.getContainer();
    const id = "toast_" + Date.now();
    const iconMap = {
      success: "fa-check-circle",
      danger: "fa-exclamation-circle",
      warning: "fa-exclamation-triangle",
      info: "fa-info-circle"
    };
    const headerTitle = title || type.charAt(0).toUpperCase() + type.slice(1);
    const toastHtml = `
      <div id="${id}" class="toast align-items-center text-bg-${type} border-0 shadow-lg mb-2" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body d-flex align-items-center">
            <i class="fas ${iconMap[type]} me-2 fs-5"></i>
            <div>
              <strong>${headerTitle}</strong><br>
              <span>${message}</span>
            </div>
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>
    `;
    container.insertAdjacentHTML("beforeend", toastHtml);
    const element = document.getElementById(id);
    if (element && window.bootstrap) {
      const toast = new window.bootstrap.Toast(element, { delay: 4500 });
      toast.show();
      element.addEventListener("hidden.bs.toast", () => element.remove());
    } else {
      setTimeout(() => element?.remove(), 4500);
    }
  }
  static success(message, title = "Success") {
    this.showToast(message, "success", title);
  }
  static error(message, title = "Error") {
    this.showToast(message, "danger", title);
  }
  static warning(message, title = "Warning") {
    this.showToast(message, "warning", title);
  }
  static info(message, title = "Information") {
    this.showToast(message, "info", title);
  }
};

// src/pages/admin.ts
var ceoRevenueChartInstance = null;
var ceoChannelChartInstance = null;
var cfoExpenseChartInstance = null;
var cooRoomStatusChartInstance = null;
var currentHotelList = [];
var currentEditingHotelId = null;
var currentEditingRoomId = null;
var currentEditingResId = null;
var currentProfitLossData = null;
var currentCashFlowData = null;
document.addEventListener("DOMContentLoaded", async () => {
  setupNavigation();
  if (!requireRole(["ADMIN", "STAFF", "CEO", "CFO", "ACCOUNTANT", "COO", "CMO", "CTO", "MANAGER", "EMPLOYEE"])) {
    return;
  }
  setupExecutiveSidebar();
  setupPersonaSwitcher();
  setupDateFilters();
  setupGlobalActions();
  setupAdminModals();
  await refreshAllExecutiveData();
  await loadHotelsManagement();
  await loadRoomsManagement();
  await loadReservationsManagement();
  await loadUsersManagement();
});
function setupExecutiveSidebar() {
  const navItems = document.querySelectorAll(".exec-nav-item");
  navItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const tabTarget = item.getAttribute("data-tab");
      if (tabTarget) {
        switchTab(tabTarget);
      }
    });
  });
}
function switchTab(tabId) {
  document.querySelectorAll(".exec-nav-item").forEach((item) => {
    if (item.getAttribute("data-tab") === tabId) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
  const panes = document.querySelectorAll(".tab-pane");
  panes.forEach((pane) => {
    pane.classList.remove("show", "active");
  });
  const targetPane = document.getElementById(tabId);
  if (targetPane) {
    targetPane.classList.add("show", "active");
  }
  updateSectionHeader(tabId);
}
window.switchTab = switchTab;
function updateSectionHeader(tabId) {
  const titleEl = document.getElementById("section-title");
  const subtitleEl = document.getElementById("section-subtitle");
  if (!titleEl || !subtitleEl) return;
  const meta = {
    "tab-ceo": {
      title: "CEO Executive Overview",
      subtitle: "Real-time enterprise metrics, bottom-line profitability, and strategic AI intelligence."
    },
    "tab-cfo": {
      title: "CFO & Financial Accounting (P&L)",
      subtitle: "Audited Profit & Loss Statement, EBITDA, and cost-structure breakdown."
    },
    "tab-cashflow": {
      title: "Corporate Cash Flow Ledger",
      subtitle: "Operating inflows, vendor disbursements, net cash runway, and liquidity reserve."
    },
    "tab-expenses": {
      title: "Corporate Expense Register",
      subtitle: "Multi-stage approval workflow: submit, authorize, disburse, and categorize expenses."
    },
    "tab-coo": {
      title: "COO Operations & Fleet Command",
      subtitle: "Live room inventory state, check-in turnover velocity, and housekeeping readiness."
    },
    "tab-cmo": {
      title: "CMO Marketing & Channel Distribution",
      subtitle: "Direct vs. OTA acquisition mix, customer lifetime value (LTV), CAC, and ROAS."
    },
    "tab-cto": {
      title: "CTO System Health & Infrastructure",
      subtitle: "JVM runtime telemetry, database latency, payment gateway uptime, and API health."
    },
    "tab-ai-insights": {
      title: "Aura AI Executive Intelligence Feed",
      subtitle: "Autonomous anomaly detection, dynamic pricing levers, and revenue opportunities."
    },
    "tab-audit-logs": {
      title: "Immutable Security & Audit Trail",
      subtitle: "Comprehensive cryptographically timestamped records of all administrative actions."
    },
    "tab-alerts": {
      title: "Executive Alert & Incident Center",
      subtitle: "System warnings, security anomalies, and pending operational notifications."
    },
    "tab-reservations": {
      title: "Guest Reservations Management",
      subtitle: "Search, filter, update statuses, and inspect guest bookings across properties."
    },
    "tab-rooms": {
      title: "Room Inventory & Pricing Rates",
      subtitle: "Configure room types, pricing, capacity, and operational availability status."
    },
    "tab-hotels": {
      title: "Hotel Properties Portfolio",
      subtitle: "Manage hotel listings, star ratings, geographic locations, and contact details."
    },
    "tab-users": {
      title: "User & Staff Accounts",
      subtitle: "System directory of registered guests, administrative staff, and executive personas."
    }
  };
  if (meta[tabId]) {
    titleEl.textContent = meta[tabId].title;
    subtitleEl.textContent = meta[tabId].subtitle;
  }
}
function setupPersonaSwitcher() {
  const select = document.getElementById("executive-persona-select");
  if (!select) return;
  select.addEventListener("change", () => {
    const role = select.value;
    NotificationManager.info(`Switched active view to ${role} persona`);
    if (role === "CEO") switchTab("tab-ceo");
    else if (role === "CFO" || role === "ACCOUNTANT") switchTab("tab-cfo");
    else if (role === "COO") switchTab("tab-coo");
    else if (role === "CMO") switchTab("tab-cmo");
    else if (role === "CTO") switchTab("tab-cto");
    else if (role === "STAFF") switchTab("tab-reservations");
    else switchTab("tab-ceo");
  });
}
function setupDateFilters() {
  const select = document.getElementById("global-date-range");
  if (!select) return;
  select.addEventListener("change", async () => {
    await refreshAllExecutiveData();
    NotificationManager.success("Analytics updated for selected timeframe");
  });
}
function getDateRangeParams() {
  const select = document.getElementById("global-date-range");
  const val = select ? select.value : "MTD";
  const now = /* @__PURE__ */ new Date();
  const todayStr = now.toISOString().split("T")[0];
  if (val === "TODAY") {
    return { startDate: todayStr, endDate: todayStr };
  } else if (val === "LAST_7") {
    const d = /* @__PURE__ */ new Date();
    d.setDate(d.getDate() - 7);
    return { startDate: d.toISOString().split("T")[0], endDate: todayStr };
  } else if (val === "LAST_30") {
    const d = /* @__PURE__ */ new Date();
    d.setDate(d.getDate() - 30);
    return { startDate: d.toISOString().split("T")[0], endDate: todayStr };
  } else if (val === "MTD") {
    const d = new Date(now.getFullYear(), now.getMonth(), 1);
    return { startDate: d.toISOString().split("T")[0], endDate: todayStr };
  } else if (val === "YTD") {
    const d = new Date(now.getFullYear(), 0, 1);
    return { startDate: d.toISOString().split("T")[0], endDate: todayStr };
  }
  return {};
}
async function refreshAllExecutiveData() {
  const { startDate, endDate } = getDateRangeParams();
  try {
    await loadCeoOverview(startDate, endDate);
    await loadCfoFinance(startDate, endDate);
    await loadCashFlow(startDate, endDate);
    await loadExpenses();
    await loadCooOperations();
    await loadCmoMarketing();
    await loadCtoSystemHealth();
    await loadAiInsights();
    await loadAlerts();
    await loadAuditLogs();
  } catch (err) {
    console.error("Failed refreshing executive data:", err);
  }
}
async function loadCeoOverview(startDate, endDate) {
  try {
    const kpi = await EnterpriseAnalyticsService.getExecutiveKpis(startDate, endDate);
    const analytics = await EnterpriseAnalyticsService.getFinancialAnalytics(startDate, endDate);
    const netRevEl = document.getElementById("kpi-net-revenue");
    const grossRevEl = document.getElementById("kpi-gross-revenue");
    const netProfitEl = document.getElementById("kpi-net-profit");
    const grossProfitEl = document.getElementById("kpi-gross-profit");
    const netMarginBadge = document.getElementById("kpi-net-margin");
    const revparEl = document.getElementById("kpi-revpar");
    const adrEl = document.getElementById("kpi-adr");
    const occRateEl = document.getElementById("kpi-occupancy-rate");
    const occRoomsEl = document.getElementById("kpi-occupied-rooms");
    const totalBookingsEl = document.getElementById("kpi-total-bookings");
    const revGrowthBadge = document.getElementById("kpi-rev-growth");
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
      revGrowthBadge.textContent = `${kpi.momRevenueGrowth >= 0 ? "+" : ""}${kpi.momRevenueGrowth.toFixed(1)}% MoM`;
    }
    const narrativeEl = document.getElementById("ceo-ai-narrative");
    if (narrativeEl && kpi.executiveNarrative) {
      narrativeEl.textContent = kpi.executiveNarrative;
    }
    renderCeoRevenueChart(analytics.monthlyTrends);
    renderCeoChannelChart(analytics.channelBreakdown);
  } catch (err) {
    console.error("Error loading CEO metrics:", err);
  }
}
function renderCeoRevenueChart(trends) {
  const canvas = document.getElementById("ceoRevenueChart");
  if (!canvas) return;
  const labels = trends.map((t) => t.month);
  const revData = trends.map((t) => t.grossRevenue);
  const profitData = trends.map((t) => t.netProfit);
  if (ceoRevenueChartInstance) {
    ceoRevenueChartInstance.destroy();
  }
  ceoRevenueChartInstance = new Chart(canvas, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Gross Revenue ($)",
          data: revData,
          borderColor: "#d97706",
          backgroundColor: "rgba(217, 119, 6, 0.1)",
          fill: true,
          tension: 0.35,
          pointRadius: 4,
          pointBackgroundColor: "#d97706"
        },
        {
          label: "Net Profit ($)",
          data: profitData,
          borderColor: "#10b981",
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          fill: true,
          tension: 0.35,
          pointRadius: 4,
          pointBackgroundColor: "#10b981"
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "top", labels: { boxWidth: 12, font: { family: "Outfit" } } }
      },
      scales: {
        y: {
          ticks: {
            callback: (val) => "$" + val.toLocaleString()
          },
          grid: { color: "rgba(0,0,0,0.05)" }
        },
        x: { grid: { display: false } }
      }
    }
  });
}
function renderCeoChannelChart(channels) {
  const canvas = document.getElementById("ceoChannelChart");
  if (!canvas) return;
  const labels = channels.map((c) => c.channel.replace("_", " "));
  const data = channels.map((c) => c.revenue);
  if (ceoChannelChartInstance) {
    ceoChannelChartInstance.destroy();
  }
  ceoChannelChartInstance = new Chart(canvas, {
    type: "doughnut",
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: ["#d97706", "#3b82f6", "#10b981", "#8b5cf6", "#64748b"],
          borderWidth: 2,
          borderColor: "#ffffff"
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom", labels: { boxWidth: 10, font: { size: 11, family: "Plus Jakarta Sans" } } }
      },
      cutout: "65%"
    }
  });
}
async function loadCfoFinance(startDate, endDate) {
  try {
    const pl = await EnterpriseAnalyticsService.getProfitLoss(startDate, endDate);
    currentProfitLossData = pl;
    const setTxt = (id, val, isNegative = false) => {
      const el = document.getElementById(id);
      if (el) {
        if (isNegative && val > 0) {
          el.textContent = `(${formatCurrency(val)})`;
        } else {
          el.textContent = formatCurrency(val);
        }
      }
    };
    setTxt("pl-room-rev", pl.grossRoomRevenue);
    setTxt("pl-addon-rev", pl.addOnRevenue);
    setTxt("pl-total-rev", pl.totalRevenue);
    setTxt("pl-gateway-fees", pl.paymentGatewayFees, true);
    setTxt("pl-channel-comm", pl.channelCommissions, true);
    setTxt("pl-gross-profit", pl.grossProfit);
    setTxt("pl-fixed-costs", pl.fixedOperatingCosts, true);
    setTxt("pl-var-costs", pl.variableOperatingCosts, true);
    setTxt("pl-marketing-costs", pl.marketingExpenses, true);
    setTxt("pl-financial-costs", pl.financialExpenses, true);
    setTxt("pl-total-opex", pl.totalOperatingExpenses, true);
    setTxt("pl-ebitda", pl.operatingIncomeEbitda);
    setTxt("pl-tax-depr", pl.taxAndDepreciation, true);
    setTxt("pl-net-profit", pl.netProfit);
    const periodLabel = document.getElementById("pl-period-label");
    if (periodLabel) periodLabel.textContent = `Period: ${pl.period}`;
    renderCfoExpenseChart(pl.categoryBreakdown);
  } catch (err) {
    console.error("Error loading CFO P&L:", err);
  }
}
function renderCfoExpenseChart(breakdown) {
  const canvas = document.getElementById("cfoExpenseChart");
  if (!canvas) return;
  const labels = breakdown.map((b) => b.category.replace("_", " "));
  const data = breakdown.map((b) => b.amount);
  if (cfoExpenseChartInstance) {
    cfoExpenseChartInstance.destroy();
  }
  cfoExpenseChartInstance = new Chart(canvas, {
    type: "pie",
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: ["#ef4444", "#f59e0b", "#3b82f6", "#8b5cf6", "#6b7280"],
          borderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom", labels: { boxWidth: 10, font: { size: 10 } } }
      }
    }
  });
  const listEl = document.getElementById("cfo-expense-breakdown-list");
  if (listEl) {
    listEl.innerHTML = breakdown.map(
      (b) => `
      <div class="d-flex justify-content-between align-items-center py-1 border-bottom small">
        <span>${b.category.replace("_", " ")}</span>
        <span class="fw-bold">${formatCurrency(b.amount)} <span class="text-muted fw-normal">(${b.percentageOfTotal.toFixed(1)}%)</span></span>
      </div>
    `
    ).join("");
  }
}
async function loadCashFlow(startDate, endDate) {
  try {
    const cf = await EnterpriseAnalyticsService.getCashFlow(startDate, endDate);
    currentCashFlowData = cf;
    const opBal = document.getElementById("cf-opening-balance");
    const inFlow = document.getElementById("cf-total-inflows");
    const outFlow = document.getElementById("cf-total-outflows");
    const closeBal = document.getElementById("cf-closing-balance");
    if (opBal) opBal.textContent = formatCurrency(cf.openingBalance);
    if (inFlow) inFlow.textContent = formatCurrency(cf.totalOperatingInflows);
    if (outFlow) outFlow.textContent = formatCurrency(cf.totalOperatingOutflows);
    if (closeBal) closeBal.textContent = formatCurrency(cf.closingCashBalance);
    const tbody = document.getElementById("cashflow-table-body");
    if (tbody) {
      if (!cf.cashFlowEntries || cf.cashFlowEntries.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-3">No cash transactions logged in period.</td></tr>`;
      } else {
        tbody.innerHTML = cf.cashFlowEntries.map(
          (e) => `
          <tr>
            <td>${formatDate(e.date)}</td>
            <td><strong>${e.description}</strong></td>
            <td><span class="badge bg-light text-dark border">${e.category}</span></td>
            <td class="text-end text-success">${e.inflow > 0 ? "+" + formatCurrency(e.inflow) : "-"}</td>
            <td class="text-end text-danger">${e.outflow > 0 ? "-" + formatCurrency(e.outflow) : "-"}</td>
            <td class="text-end fw-bold">${formatCurrency(e.runningBalance)}</td>
          </tr>
        `
        ).join("");
      }
    }
  } catch (err) {
    console.error("Error loading Cash Flow:", err);
  }
}
async function loadExpenses() {
  const filterSelect = document.getElementById("expense-status-filter");
  const status = filterSelect ? filterSelect.value : void 0;
  try {
    const expenses = await EnterpriseAnalyticsService.getAllExpenses(status);
    const tbody = document.getElementById("expense-table-body");
    if (!tbody) return;
    if (expenses.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" class="text-center text-muted py-4">No expenses found matching filter.</td></tr>`;
      return;
    }
    tbody.innerHTML = expenses.map(
      (e) => `
      <tr>
        <td><strong>#${e.id}</strong></td>
        <td>
          <strong>${e.title}</strong>
          ${e.description ? `<br><span class="text-muted fs-xs">${e.description}</span>` : ""}
        </td>
        <td><span class="badge bg-secondary-subtle text-secondary">${e.category.replace("_", " ")}</span></td>
        <td>${e.vendorName || "N/A"} ${e.invoiceNumber ? `(${e.invoiceNumber})` : ""}</td>
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
              ${e.status === "PENDING" ? `
                <li><button class="dropdown-item text-success" onclick="window.approveExpense(${e.id})"><i class="fas fa-check me-2"></i> Approve Expense</button></li>
                <li><button class="dropdown-item text-danger" onclick="window.rejectExpense(${e.id})"><i class="fas fa-ban me-2"></i> Reject Expense</button></li>
              ` : ""}
              ${e.status === "APPROVED" ? `
                <li><button class="dropdown-item text-primary" onclick="window.markExpensePaid(${e.id})"><i class="fas fa-dollar-sign me-2"></i> Mark Paid & Disburse</button></li>
              ` : ""}
              <li><button class="dropdown-item text-danger" onclick="window.deleteExpense(${e.id})"><i class="fas fa-trash me-2"></i> Delete Record</button></li>
            </ul>
          </div>
        </td>
      </tr>
    `
    ).join("");
  } catch (err) {
    console.error("Error loading expenses:", err);
  }
}
function getExpenseStatusBadge(status) {
  switch (status) {
    case "APPROVED":
      return `<span class="badge bg-primary-subtle text-primary">APPROVED</span>`;
    case "PAID":
      return `<span class="badge bg-success-subtle text-success">PAID</span>`;
    case "REJECTED":
      return `<span class="badge bg-danger-subtle text-danger">REJECTED</span>`;
    case "PENDING":
    default:
      return `<span class="badge bg-warning-subtle text-warning">PENDING</span>`;
  }
}
window.approveExpense = async (id) => {
  try {
    await EnterpriseAnalyticsService.approveExpense(id);
    NotificationManager.success(`Expense #${id} authorized by Executive`);
    await loadExpenses();
    await refreshAllExecutiveData();
  } catch (err) {
    NotificationManager.error("Failed approving expense: " + err.message);
  }
};
window.rejectExpense = async (id) => {
  const reason = prompt("Enter rejection justification:");
  if (reason === null) return;
  try {
    await EnterpriseAnalyticsService.rejectExpense(id, reason);
    NotificationManager.warning(`Expense #${id} rejected`);
    await loadExpenses();
    await refreshAllExecutiveData();
  } catch (err) {
    NotificationManager.error("Failed rejecting expense: " + err.message);
  }
};
window.markExpensePaid = async (id) => {
  try {
    await EnterpriseAnalyticsService.markExpensePaid(id);
    NotificationManager.success(`Expense #${id} disbursed and ledger updated`);
    await loadExpenses();
    await refreshAllExecutiveData();
  } catch (err) {
    NotificationManager.error("Failed paying expense: " + err.message);
  }
};
window.deleteExpense = async (id) => {
  if (!confirm(`Delete expense record #${id}?`)) return;
  try {
    await EnterpriseAnalyticsService.deleteExpense(id);
    NotificationManager.success(`Expense #${id} deleted`);
    await loadExpenses();
  } catch (err) {
    NotificationManager.error("Failed deleting expense: " + err.message);
  }
};
async function loadCooOperations() {
  try {
    const ops = await EnterpriseAnalyticsService.getOperationsAnalytics();
    const healthEl = document.getElementById("coo-health-score");
    const checkinsEl = document.getElementById("coo-checkins");
    const checkoutsEl = document.getElementById("coo-checkouts");
    const housekeepingEl = document.getElementById("coo-housekeeping");
    if (healthEl) healthEl.textContent = `${ops.operationalHealthScore}/100`;
    if (checkinsEl) checkinsEl.textContent = ops.todaysExpectedCheckIns.toString();
    if (checkoutsEl) checkoutsEl.textContent = ops.todaysExpectedCheckOuts.toString();
    if (housekeepingEl) housekeepingEl.textContent = ops.pendingHousekeepingTasks.toString();
    renderCooRoomStatusChart(ops);
    const list = document.getElementById("coo-room-matrix-list");
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
  } catch (err) {
    console.error("Error loading COO metrics:", err);
  }
}
function renderCooRoomStatusChart(ops) {
  const canvas = document.getElementById("cooRoomStatusChart");
  if (!canvas) return;
  if (cooRoomStatusChartInstance) {
    cooRoomStatusChartInstance.destroy();
  }
  cooRoomStatusChartInstance = new Chart(canvas, {
    type: "doughnut",
    data: {
      labels: ["Available", "Occupied", "Cleaning", "Maintenance", "Reserved"],
      datasets: [
        {
          data: [ops.availableRooms, ops.occupiedRooms, ops.cleaningRooms, ops.maintenanceRooms, ops.reservedRooms],
          backgroundColor: ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"],
          borderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom", labels: { boxWidth: 10, font: { size: 11 } } }
      },
      cutout: "60%"
    }
  });
}
async function loadCmoMarketing() {
  try {
    const mkt = await EnterpriseAnalyticsService.getMarketingAnalytics();
    const directRatioEl = document.getElementById("cmo-direct-ratio");
    const cacEl = document.getElementById("cmo-cac");
    const ltvEl = document.getElementById("cmo-ltv");
    const roasEl = document.getElementById("cmo-roas");
    if (directRatioEl) directRatioEl.textContent = `${mkt.directBookingRatio.toFixed(1)}%`;
    if (cacEl) cacEl.textContent = formatCurrency(mkt.customerAcquisitionCost);
    if (ltvEl) ltvEl.textContent = formatCurrency(mkt.estimatedCustomerLifetimeValue);
    if (roasEl) roasEl.textContent = `${mkt.returnOnAdSpend.toFixed(1)}x`;
    const tbody = document.getElementById("cmo-channel-table-body");
    if (tbody) {
      if (!mkt.topChannels || mkt.topChannels.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-3">No channel data available.</td></tr>`;
      } else {
        tbody.innerHTML = mkt.topChannels.map(
          (c) => `
          <tr>
            <td><strong>${c.channel.replace("_", " ")}</strong></td>
            <td>${c.bookingCount} bookings</td>
            <td class="fw-bold text-navy">${formatCurrency(c.revenue)}</td>
            <td><span class="badge bg-light text-dark border">${c.sharePercentage.toFixed(1)}%</span></td>
            <td>${formatCurrency(c.averageBookingValue)}</td>
          </tr>
        `
        ).join("");
      }
    }
  } catch (err) {
    console.error("Error loading CMO metrics:", err);
  }
}
async function loadCtoSystemHealth() {
  try {
    const health = await EnterpriseAnalyticsService.getSystemHealth();
    const statusEl = document.getElementById("cto-sys-status");
    const profileEl = document.getElementById("cto-profile");
    const latencyEl = document.getElementById("cto-db-latency");
    const dbStatusEl = document.getElementById("cto-db-status");
    const gatewayEl = document.getElementById("cto-gateway-status");
    const apiSuccessEl = document.getElementById("cto-api-success");
    const apiReqsEl = document.getElementById("cto-api-reqs");
    const jvmTextEl = document.getElementById("cto-jvm-text");
    const jvmBarEl = document.getElementById("cto-jvm-bar");
    const procsEl = document.getElementById("cto-processors");
    const threadsEl = document.getElementById("cto-threads");
    const uptimeEl = document.getElementById("cto-uptime");
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
      const mins = Math.floor(health.systemUptimeSeconds % 3600 / 60);
      uptimeEl.textContent = `${hours}h ${mins}m active without disruption`;
    }
  } catch (err) {
    console.error("Error loading CTO system health:", err);
  }
}
async function loadAiInsights() {
  try {
    const insights = await EnterpriseAnalyticsService.getAiInsights();
    const feed = document.getElementById("ai-insights-feed");
    if (!feed) return;
    if (insights.length === 0) {
      feed.innerHTML = `<div class="card p-4 text-center text-muted">No active strategic anomaly alerts. Operating in optimal parameters.</div>`;
      return;
    }
    feed.innerHTML = insights.map(
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
    ).join("");
  } catch (err) {
    console.error("Error loading AI insights:", err);
  }
}
window.refreshAiInsights = async () => {
  NotificationManager.info("Re-evaluating revenue optimization models...");
  await loadAiInsights();
  NotificationManager.success("Aura AI models updated");
};
function getInsightTypeBadgeClass(type) {
  switch (type) {
    case "OPPORTUNITY":
      return "bg-success";
    case "RISK":
      return "bg-danger";
    case "ANOMALY":
      return "bg-warning text-dark";
    case "RECOMMENDATION":
    default:
      return "bg-primary";
  }
}
async function loadAuditLogs() {
  try {
    const pageData = await EnterpriseAnalyticsService.getAuditLogs(0, 25);
    const tbody = document.getElementById("audit-logs-table-body");
    if (!tbody) return;
    if (!pageData.content || pageData.content.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-3">No audit logs recorded yet.</td></tr>`;
      return;
    }
    tbody.innerHTML = pageData.content.map(
      (log) => `
      <tr>
        <td class="small">${formatDateTime(log.timestamp)}</td>
        <td><strong>${log.userEmail}</strong></td>
        <td><span class="badge bg-secondary-subtle text-secondary">${log.action}</span></td>
        <td>${log.entityName} ${log.entityId ? `(#${log.entityId})` : ""}</td>
        <td class="small text-muted">${log.ipAddress || "127.0.0.1"}</td>
        <td class="small">${log.details || "-"}</td>
      </tr>
    `
    ).join("");
  } catch (err) {
    console.error("Error loading audit logs:", err);
  }
}
async function loadAlerts(unacknowledgedOnly = false) {
  try {
    const alerts = await EnterpriseAnalyticsService.getAlerts(unacknowledgedOnly);
    const tbody = document.getElementById("alerts-table-body");
    const badge = document.getElementById("unread-alerts-count");
    const unackCount = alerts.filter((a) => !a.acknowledged).length;
    if (badge) {
      if (unackCount > 0) {
        badge.style.display = "inline-block";
        badge.textContent = unackCount.toString();
      } else {
        badge.style.display = "none";
      }
    }
    if (!tbody) return;
    if (alerts.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-4">No active alerts. All systems running smooth.</td></tr>`;
      return;
    }
    tbody.innerHTML = alerts.map(
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
          ${!a.acknowledged ? `<button class="btn btn-sm btn-outline-success rounded-pill px-3" onclick="window.acknowledgeAlert(${a.id})"><i class="fas fa-check me-1"></i> Resolve</button>` : '<span class="text-muted small">Acknowledged</span>'}
        </td>
      </tr>
    `
    ).join("");
  } catch (err) {
    console.error("Error loading alerts:", err);
  }
}
window.loadAlerts = loadAlerts;
window.acknowledgeAlert = async (id) => {
  try {
    await EnterpriseAnalyticsService.acknowledgeAlert(id);
    NotificationManager.success(`Alert #${id} resolved`);
    await loadAlerts();
  } catch (err) {
    NotificationManager.error("Failed acknowledging alert: " + err.message);
  }
};
function getAlertSeverityBadge(severity) {
  switch (severity) {
    case "CRITICAL":
      return `<span class="badge bg-danger">CRITICAL</span>`;
    case "WARNING":
      return `<span class="badge bg-warning text-dark">WARNING</span>`;
    case "INFO":
    default:
      return `<span class="badge bg-info">INFO</span>`;
  }
}
async function loadHotelsManagement() {
  const tableBody = document.getElementById("admin-hotels-table-body");
  if (!tableBody) return;
  try {
    const pageData = await hotelService.getHotels({ size: 50 });
    currentHotelList = pageData.content || [];
    populateHotelSelects();
    if (currentHotelList.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-4">No hotels found.</td></tr>`;
      return;
    }
    tableBody.innerHTML = currentHotelList.map(
      (h) => `
      <tr>
        <td><strong>#${h.id}</strong></td>
        <td>
          <div class="d-flex align-items-center gap-2">
            <img src="${h.imageUrl || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=100&q=80"}" class="rounded-2" width="40" height="40" style="object-fit: cover;">
            <div>
              <strong>${h.name}</strong><br>
              <span class="text-warning small">${"\u2605".repeat(h.starRating || 5)}</span>
            </div>
          </div>
        </td>
        <td>${h.city}, ${h.country}</td>
        <td>${h.phoneNumber}</td>
        <td>${h.email}</td>
        <td><span class="badge bg-light text-dark">${h.checkInTime || "14:00"} / ${h.checkOutTime || "11:00"}</span></td>
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
    ).join("");
  } catch (err) {
    NotificationManager.error("Failed to load hotels: " + err.message);
  }
}
async function loadRoomsManagement() {
  const tableBody = document.getElementById("admin-rooms-table-body");
  if (!tableBody) return;
  try {
    const filterSelect = document.getElementById("room-filter-hotel");
    const hotelId = filterSelect && filterSelect.value ? Number(filterSelect.value) : void 0;
    const pageData = await roomService.getRooms({ hotelId, size: 50 });
    const rooms = pageData.content || [];
    if (rooms.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="8" class="text-center text-muted py-4">No rooms found.</td></tr>`;
      return;
    }
    tableBody.innerHTML = rooms.map(
      (r) => `
      <tr>
        <td><strong>#${r.id}</strong></td>
        <td><strong>${r.roomNumber}</strong></td>
        <td>${r.hotelName || "Property #" + r.hotelId}</td>
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
    ).join("");
  } catch (err) {
    NotificationManager.error("Failed to load rooms: " + err.message);
  }
}
async function loadReservationsManagement() {
  const tableBody = document.getElementById("admin-reservations-table-body");
  if (!tableBody) return;
  try {
    const statusSelect = document.getElementById("res-filter-status");
    const status = statusSelect && statusSelect.value ? statusSelect.value : void 0;
    const pageData = await reservationService.getAllReservations({ status, size: 50 });
    const reservations = pageData.content || [];
    if (reservations.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="9" class="text-center text-muted py-4">No reservations matching filter.</td></tr>`;
      return;
    }
    tableBody.innerHTML = reservations.map(
      (r) => `
      <tr>
        <td><strong>${r.reservationCode}</strong></td>
        <td>
          <strong>${r.userFullName || "Guest"}</strong><br>
          <span class="text-muted small">${r.userEmail || ""}</span>
        </td>
        <td>
          ${r.hotelName}<br>
          <span class="text-muted small">Rm ${r.roomNumber} (${r.roomType})</span>
        </td>
        <td><span class="badge bg-secondary-subtle text-secondary">${r.bookingChannel || "DIRECT_WEBSITE"}</span></td>
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
              ${r.reservationStatus !== "CONFIRMED" ? `<li><button class="dropdown-item text-success" onclick="window.quickUpdateStatus(${r.id}, 'CONFIRMED')"><i class="fas fa-check me-2"></i> Confirm Booking</button></li>` : ""}
              ${r.reservationStatus !== "CANCELLED" ? `<li><button class="dropdown-item text-danger" onclick="window.quickUpdateStatus(${r.id}, 'CANCELLED')"><i class="fas fa-ban me-2"></i> Cancel Booking</button></li>` : ""}
            </ul>
          </div>
        </td>
      </tr>
    `
    ).join("");
  } catch (err) {
    NotificationManager.error("Failed to load reservations: " + err.message);
  }
}
async function loadUsersManagement() {
  const tableBody = document.getElementById("admin-users-table-body");
  if (!tableBody) return;
  try {
    const pageData = await userService.getAllUsers({ size: 50 });
    const users = pageData.content || [];
    if (users.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-4">No users found.</td></tr>`;
      return;
    }
    tableBody.innerHTML = users.map(
      (u) => `
      <tr>
        <td><strong>#${u.id}</strong></td>
        <td><strong>${u.firstName} ${u.lastName}</strong></td>
        <td>${u.email}</td>
        <td>${u.phoneNumber || "N/A"}</td>
        <td><span class="badge ${u.role === "ADMIN" || u.role === "CEO" || u.role === "CFO" ? "bg-navy" : "bg-light text-dark border"}">${u.role}</span></td>
        <td><span class="badge ${u.enabled ? "bg-success-subtle text-success" : "bg-danger-subtle text-danger"}">${u.enabled ? "ACTIVE" : "DISABLED"}</span></td>
        <td class="small text-muted">${formatDate(u.createdAt)}</td>
      </tr>
    `
    ).join("");
  } catch (err) {
    console.error("Failed to load user accounts:", err);
  }
}
function getRoomStatusBadge(status) {
  switch (status) {
    case "AVAILABLE":
      return `<span class="badge bg-success-subtle text-success">AVAILABLE</span>`;
    case "OCCUPIED":
      return `<span class="badge bg-primary-subtle text-primary">OCCUPIED</span>`;
    case "CLEANING":
      return `<span class="badge bg-warning-subtle text-warning">CLEANING</span>`;
    case "MAINTENANCE":
      return `<span class="badge bg-danger-subtle text-danger">MAINTENANCE</span>`;
    case "RESERVED":
      return `<span class="badge bg-info-subtle text-info">RESERVED</span>`;
    default:
      return `<span class="badge bg-secondary-subtle text-secondary">${status}</span>`;
  }
}
function setupGlobalActions() {
  window.exportLedgerCsv = () => {
    if (!currentProfitLossData) {
      NotificationManager.error("No P&L data loaded to export.");
      return;
    }
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "AURA STAYS ENTERPRISE P&L STATEMENT\n";
    csvContent += `Period,${currentProfitLossData.period}

`;
    csvContent += "Category,Line Item,Amount (USD)\n";
    csvContent += `Revenue,Gross Room Revenue,${currentProfitLossData.grossRoomRevenue}
`;
    csvContent += `Revenue,Add-On Ancillary Revenue,${currentProfitLossData.addOnRevenue}
`;
    csvContent += `Revenue,Total Operating Revenue,${currentProfitLossData.totalRevenue}
`;
    csvContent += `Direct Costs,Payment Gateway Fees,-${currentProfitLossData.paymentGatewayFees}
`;
    csvContent += `Direct Costs,OTA Channel Commissions,-${currentProfitLossData.channelCommissions}
`;
    csvContent += `Profitability,Gross Profit,${currentProfitLossData.grossProfit}
`;
    csvContent += `Operating Expenses,Fixed Operating Costs,-${currentProfitLossData.fixedOperatingCosts}
`;
    csvContent += `Operating Expenses,Variable Costs,-${currentProfitLossData.variableOperatingCosts}
`;
    csvContent += `Operating Expenses,Sales & Marketing,-${currentProfitLossData.marketingExpenses}
`;
    csvContent += `Operating Expenses,Financial Costs,-${currentProfitLossData.financialExpenses}
`;
    csvContent += `Operating Expenses,Total OPEX,-${currentProfitLossData.totalOperatingExpenses}
`;
    csvContent += `Profitability,EBITDA,${currentProfitLossData.operatingIncomeEbitda}
`;
    csvContent += `Taxes,Tax and Depreciation,-${currentProfitLossData.taxAndDepreciation}
`;
    csvContent += `Bottom Line,NET PROFIT,${currentProfitLossData.netProfit}
`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Aura_Stays_PL_Statement_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    NotificationManager.success("Financial P&L CSV exported successfully");
  };
  window.printReport = () => {
    window.print();
  };
  window.toggleDarkMode = () => {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    const icon = document.getElementById("theme-icon");
    if (icon) {
      icon.className = isDark ? "fas fa-sun" : "fas fa-moon";
    }
  };
}
function setupAdminModals() {
  const expenseForm = document.getElementById("expense-modal-form");
  if (expenseForm) {
    expenseForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      try {
        const payload = {
          title: document.getElementById("expense-form-title").value,
          category: document.getElementById("expense-form-category").value,
          amount: parseFloat(document.getElementById("expense-form-amount").value),
          expenseDate: document.getElementById("expense-form-date").value,
          vendorName: document.getElementById("expense-form-vendor").value,
          invoiceNumber: document.getElementById("expense-form-invoice").value,
          description: document.getElementById("expense-form-desc").value
        };
        await EnterpriseAnalyticsService.createExpense(payload);
        NotificationManager.success("Expense recorded successfully");
        const modalEl = document.getElementById("expenseModal");
        if (modalEl && window.bootstrap) {
          const modalInstance = window.bootstrap.Modal.getInstance(modalEl);
          if (modalInstance) modalInstance.hide();
        }
        expenseForm.reset();
        await loadExpenses();
        await refreshAllExecutiveData();
      } catch (err) {
        NotificationManager.error("Failed to create expense: " + err.message);
      }
    });
  }
  const hotelForm = document.getElementById("hotel-modal-form");
  if (hotelForm) {
    hotelForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      try {
        const payload = {
          name: document.getElementById("hotel-form-name").value,
          description: document.getElementById("hotel-form-desc").value,
          address: document.getElementById("hotel-form-address").value,
          city: document.getElementById("hotel-form-city").value,
          country: document.getElementById("hotel-form-country").value,
          phoneNumber: document.getElementById("hotel-form-phone").value,
          email: document.getElementById("hotel-form-email").value,
          starRating: parseInt(document.getElementById("hotel-form-stars").value, 10),
          checkInTime: document.getElementById("hotel-form-checkin").value || "14:00",
          checkOutTime: document.getElementById("hotel-form-checkout").value || "11:00",
          imageUrl: document.getElementById("hotel-form-image").value,
          amenities: document.getElementById("hotel-form-amenities").value.split(",").map((s) => s.trim()).filter((s) => s.length > 0)
        };
        if (currentEditingHotelId) {
          await hotelService.updateHotel(currentEditingHotelId, payload);
          NotificationManager.success("Hotel property updated");
        } else {
          await hotelService.createHotel(payload);
          NotificationManager.success("Hotel property added");
        }
        const modalEl = document.getElementById("hotelModal");
        if (modalEl && window.bootstrap) {
          const modalInstance = window.bootstrap.Modal.getInstance(modalEl);
          if (modalInstance) modalInstance.hide();
        }
        await loadHotelsManagement();
      } catch (err) {
        NotificationManager.error("Failed to save hotel: " + err.message);
      }
    });
  }
  const roomForm = document.getElementById("room-modal-form");
  if (roomForm) {
    roomForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      try {
        const payload = {
          hotelId: parseInt(document.getElementById("room-form-hotel").value, 10),
          roomNumber: document.getElementById("room-form-number").value,
          roomType: document.getElementById("room-form-type").value,
          pricePerNight: parseFloat(document.getElementById("room-form-price").value),
          capacity: parseInt(document.getElementById("room-form-capacity").value, 10),
          floor: parseInt(document.getElementById("room-form-floor").value, 10),
          status: document.getElementById("room-form-status").value,
          imageUrl: document.getElementById("room-form-image").value,
          description: document.getElementById("room-form-desc").value,
          amenities: document.getElementById("room-form-amenities").value.split(",").map((s) => s.trim()).filter((s) => s.length > 0)
        };
        if (currentEditingRoomId) {
          await roomService.updateRoom(currentEditingRoomId, payload);
          NotificationManager.success("Room inventory updated");
        } else {
          await roomService.createRoom(payload);
          NotificationManager.success("Room added to inventory");
        }
        const modalEl = document.getElementById("roomModal");
        if (modalEl && window.bootstrap) {
          const modalInstance = window.bootstrap.Modal.getInstance(modalEl);
          if (modalInstance) modalInstance.hide();
        }
        await loadRoomsManagement();
      } catch (err) {
        NotificationManager.error("Failed to save room: " + err.message);
      }
    });
  }
  const saveResBtn = document.getElementById("save-res-status-btn");
  if (saveResBtn) {
    saveResBtn.addEventListener("click", async () => {
      if (!currentEditingResId) return;
      const status = document.getElementById("modal-res-status-select").value;
      const reason = document.getElementById("modal-res-status-reason").value;
      try {
        await reservationService.updateReservationStatus(currentEditingResId, { status, reason });
        NotificationManager.success(`Reservation status updated to ${status}`);
        const modalEl = document.getElementById("reservationStatusModal");
        if (modalEl && window.bootstrap) {
          const modalInstance = window.bootstrap.Modal.getInstance(modalEl);
          if (modalInstance) modalInstance.hide();
        }
        await loadReservationsManagement();
        await refreshAllExecutiveData();
      } catch (err) {
        NotificationManager.error("Failed to update status: " + err.message);
      }
    });
  }
  const resFilter = document.getElementById("res-filter-status");
  if (resFilter) resFilter.addEventListener("change", () => loadReservationsManagement());
  const roomFilter = document.getElementById("room-filter-hotel");
  if (roomFilter) roomFilter.addEventListener("change", () => loadRoomsManagement());
  const expenseFilter = document.getElementById("expense-status-filter");
  if (expenseFilter) expenseFilter.addEventListener("change", () => loadExpenses());
}
function populateHotelSelects() {
  const roomFilter = document.getElementById("room-filter-hotel");
  const roomModalHotel = document.getElementById("room-form-hotel");
  if (roomFilter) {
    const currentVal = roomFilter.value;
    roomFilter.innerHTML = '<option value="">All Hotels</option>' + currentHotelList.map((h) => `<option value="${h.id}">${h.name} (${h.city})</option>`).join("");
    roomFilter.value = currentVal;
  }
  if (roomModalHotel) {
    roomModalHotel.innerHTML = currentHotelList.map((h) => `<option value="${h.id}">${h.name} (${h.city})</option>`).join("");
  }
}
window.openExpenseModal = () => {
  const form = document.getElementById("expense-modal-form");
  if (form) {
    form.reset();
    document.getElementById("expense-form-date").value = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  }
  const modalEl = document.getElementById("expenseModal");
  if (modalEl && window.bootstrap) {
    new window.bootstrap.Modal(modalEl).show();
  }
};
window.openNewHotelModal = () => {
  currentEditingHotelId = null;
  const form = document.getElementById("hotel-modal-form");
  if (form) form.reset();
  const label = document.getElementById("hotelModalLabel");
  if (label) label.textContent = "Add New Hotel Property";
  const modalEl = document.getElementById("hotelModal");
  if (modalEl && window.bootstrap) {
    new window.bootstrap.Modal(modalEl).show();
  }
};
window.openNewRoomModal = () => {
  currentEditingRoomId = null;
  const form = document.getElementById("room-modal-form");
  if (form) form.reset();
  const label = document.getElementById("roomModalLabel");
  if (label) label.textContent = "Add Room to Inventory";
  const modalEl = document.getElementById("roomModal");
  if (modalEl && window.bootstrap) {
    new window.bootstrap.Modal(modalEl).show();
  }
};
window.editHotel = async (id) => {
  try {
    const hotel = await hotelService.getHotelById(id);
    currentEditingHotelId = hotel.id;
    document.getElementById("hotel-form-name").value = hotel.name;
    document.getElementById("hotel-form-desc").value = hotel.description || "";
    document.getElementById("hotel-form-address").value = hotel.address;
    document.getElementById("hotel-form-city").value = hotel.city;
    document.getElementById("hotel-form-country").value = hotel.country;
    document.getElementById("hotel-form-phone").value = hotel.phoneNumber;
    document.getElementById("hotel-form-email").value = hotel.email;
    document.getElementById("hotel-form-stars").value = (hotel.starRating || 5).toString();
    document.getElementById("hotel-form-checkin").value = hotel.checkInTime || "14:00";
    document.getElementById("hotel-form-checkout").value = hotel.checkOutTime || "11:00";
    document.getElementById("hotel-form-image").value = hotel.imageUrl || "";
    document.getElementById("hotel-form-amenities").value = (hotel.amenities || []).join(", ");
    const label = document.getElementById("hotelModalLabel");
    if (label) label.textContent = `Edit Hotel: ${hotel.name}`;
    const modalEl = document.getElementById("hotelModal");
    if (modalEl && window.bootstrap) {
      new window.bootstrap.Modal(modalEl).show();
    }
  } catch (err) {
    NotificationManager.error("Failed to load hotel details: " + err.message);
  }
};
window.deleteHotel = async (id) => {
  if (!confirm(`Are you sure you want to delete Hotel #${id}?`)) return;
  try {
    await hotelService.deleteHotel(id);
    NotificationManager.success("Hotel property removed");
    await loadHotelsManagement();
  } catch (err) {
    NotificationManager.error("Failed to delete hotel: " + err.message);
  }
};
window.editRoom = async (id) => {
  try {
    const room = await roomService.getRoomById(id);
    currentEditingRoomId = room.id;
    document.getElementById("room-form-hotel").value = room.hotelId.toString();
    document.getElementById("room-form-number").value = room.roomNumber;
    document.getElementById("room-form-type").value = room.roomType;
    document.getElementById("room-form-price").value = room.pricePerNight.toString();
    document.getElementById("room-form-capacity").value = room.capacity.toString();
    document.getElementById("room-form-floor").value = (room.floor || 1).toString();
    document.getElementById("room-form-status").value = room.status;
    document.getElementById("room-form-image").value = room.imageUrl || "";
    document.getElementById("room-form-desc").value = room.description || "";
    document.getElementById("room-form-amenities").value = (room.amenities || []).join(", ");
    const label = document.getElementById("roomModalLabel");
    if (label) label.textContent = `Edit Room: ${room.roomNumber}`;
    const modalEl = document.getElementById("roomModal");
    if (modalEl && window.bootstrap) {
      new window.bootstrap.Modal(modalEl).show();
    }
  } catch (err) {
    NotificationManager.error("Failed to load room: " + err.message);
  }
};
window.deleteRoom = async (id) => {
  if (!confirm(`Are you sure you want to delete Room #${id}?`)) return;
  try {
    await roomService.deleteRoom(id);
    NotificationManager.success("Room removed from inventory");
    await loadRoomsManagement();
  } catch (err) {
    NotificationManager.error("Failed to delete room: " + err.message);
  }
};
window.openStatusModal = (resId, currentStatus) => {
  currentEditingResId = resId;
  const select = document.getElementById("modal-res-status-select");
  if (select) select.value = currentStatus;
  const modalEl = document.getElementById("reservationStatusModal");
  if (modalEl && window.bootstrap) {
    new window.bootstrap.Modal(modalEl).show();
  }
};
window.quickUpdateStatus = async (resId, status) => {
  try {
    await reservationService.updateReservationStatus(resId, { status });
    NotificationManager.success(`Reservation #${resId} marked as ${status}`);
    await loadReservationsManagement();
    await refreshAllExecutiveData();
  } catch (err) {
    NotificationManager.error("Failed to update status: " + err.message);
  }
};
