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

// src/pages/myReservations.ts
var allReservations = [];
var selectedReservationId = null;
document.addEventListener("DOMContentLoaded", async () => {
  setupNavigation();
  if (!requireAuth()) return;
  await loadMyReservations();
  setupFilterTabs();
  setupCancelModal();
});
async function loadMyReservations() {
  const container = document.getElementById("my-reservations-list");
  if (!container) return;
  container.innerHTML = `<div class="text-center py-5"><div class="spinner-border text-warning" role="status"></div></div>`;
  try {
    allReservations = await reservationService.getMyReservations();
    renderReservations("ALL");
  } catch (err) {
    container.innerHTML = `<div class="alert alert-danger">Failed to load reservations: ${err.message}</div>`;
  }
}
function setupFilterTabs() {
  const tabs = document.querySelectorAll(".res-filter-tab");
  tabs.forEach((tab) => {
    tab.addEventListener("click", (e) => {
      tabs.forEach((t) => t.classList.remove("active"));
      const target = e.currentTarget;
      target.classList.add("active");
      const filter = target.getAttribute("data-filter") || "ALL";
      renderReservations(filter);
    });
  });
}
function renderReservations(filter) {
  const container = document.getElementById("my-reservations-list");
  if (!container) return;
  let filtered = allReservations;
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  if (filter === "UPCOMING") {
    filtered = allReservations.filter((r) => r.reservationStatus === "CONFIRMED" && r.checkInDate >= today);
  } else if (filter === "PAID" || filter === "CONFIRMED") {
    filtered = allReservations.filter((r) => r.reservationStatus === "CONFIRMED");
  } else if (filter === "CANCELLED") {
    filtered = allReservations.filter((r) => r.reservationStatus === "CANCELLED" || r.reservationStatus === "REJECTED");
  } else if (filter === "COMPLETED") {
    filtered = allReservations.filter((r) => r.reservationStatus === "COMPLETED");
  }
  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="text-center py-5 bg-white rounded-4 border p-5">
        <i class="fas fa-calendar-times fs-1 text-muted mb-3"></i>
        <h4>No reservations found</h4>
        <p class="text-muted">You have no reservations under this filter category.</p>
        <a href="hotels.html" class="btn btn-gold btn-sm px-4 rounded-pill mt-2">Explore Hotels</a>
      </div>
    `;
    return;
  }
  container.innerHTML = filtered.map((r) => `
    <div class="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden hotel-card">
      <div class="card-body p-4">
        <div class="d-flex flex-wrap justify-content-between align-items-center mb-3 pb-3 border-bottom gap-2">
          <div>
            <span class="text-muted small">Reservation Code</span>
            <h5 class="fw-bold mb-0 text-navy">${r.reservationCode}</h5>
          </div>
          <div class="d-flex align-items-center gap-2">
            ${getStatusBadge(r.reservationStatus)}
            <a href="confirmation.html?code=${r.reservationCode}" class="btn btn-outline-secondary btn-sm rounded-pill px-3">
              <i class="fas fa-receipt me-1"></i> Receipt
            </a>
          </div>
        </div>
        <div class="row align-items-center">
          <div class="col-md-6 mb-3 mb-md-0">
            <h5 class="fw-bold mb-1">${r.hotelName}</h5>
            <p class="text-muted small mb-2"><i class="fas fa-map-marker-alt text-warning me-1"></i> ${r.hotelAddress}, ${r.hotelCity}</p>
            <div class="d-flex gap-3 text-muted small">
              <span><i class="fas fa-bed me-1"></i> ${r.roomType} (Room ${r.roomNumber})</span>
              <span><i class="fas fa-user-friends me-1"></i> ${r.numberOfGuests} Guests</span>
            </div>
          </div>
          <div class="col-md-3 mb-3 mb-md-0">
            <span class="text-muted small d-block">Stay Period</span>
            <strong>${formatDate(r.checkInDate)} - ${formatDate(r.checkOutDate)}</strong>
            <span class="text-muted small d-block">${r.numberOfNights} Night${r.numberOfNights > 1 ? "s" : ""}</span>
          </div>
          <div class="col-md-3 text-md-end">
            <span class="text-muted small d-block">Total Cost</span>
            <h4 class="fw-bold text-navy mb-2">${formatCurrency(r.totalPrice)}</h4>
            ${r.reservationStatus === "CONFIRMED" || r.reservationStatus === "PENDING" ? `
              <button class="btn btn-outline-danger btn-sm rounded-pill px-3" onclick="window.openCancelModal(${r.id})">
                Cancel Booking
              </button>
            ` : ""}
          </div>
        </div>
      </div>
    </div>
  `).join("");
}
function setupCancelModal() {
  const confirmBtn = document.getElementById("confirm-cancel-res-btn");
  confirmBtn?.addEventListener("click", async () => {
    if (!selectedReservationId) return;
    try {
      await reservationService.cancelReservation(selectedReservationId);
      NotificationManager.success("Reservation cancelled successfully. Any eligible payments are queued for refund.");
      const modalEl = document.getElementById("cancelReservationModal");
      if (modalEl && window.bootstrap) {
        const modal = window.bootstrap.Modal.getInstance(modalEl);
        modal?.hide();
      }
      await loadMyReservations();
    } catch (err) {
      NotificationManager.error(err.message, "Cancellation Failed");
    }
  });
}
window.openCancelModal = (id) => {
  selectedReservationId = id;
  const modalEl = document.getElementById("cancelReservationModal");
  if (modalEl && window.bootstrap) {
    const modal = new window.bootstrap.Modal(modalEl);
    modal.show();
  }
};
