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

// src/services/adminService.ts
var adminService = {
  async getDashboardStatistics() {
    return ApiService.get("/admin/dashboard/statistics");
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
var currentHotelList = [];
var currentEditingHotelId = null;
var currentEditingRoomId = null;
var currentEditingResId = null;
document.addEventListener("DOMContentLoaded", async () => {
  setupNavigation();
  if (!requireRole(["ADMIN", "STAFF"])) return;
  const user = authService.getCurrentStoredUser();
  if (user?.role === "STAFF") {
    document.querySelectorAll(".admin-only-feature").forEach((el) => {
      el.style.display = "none";
    });
  }
  await loadDashboardStats();
  await loadHotelsManagement();
  await loadRoomsManagement();
  await loadReservationsManagement();
  if (user?.role === "ADMIN") {
    await loadUsersManagement();
  }
  setupAdminModals();
});
async function loadDashboardStats() {
  try {
    const stats = await adminService.getDashboardStatistics();
    document.getElementById("stat-total-revenue").textContent = formatCurrency(stats.totalRevenue);
    document.getElementById("stat-total-bookings").textContent = stats.totalReservations.toString();
    document.getElementById("stat-confirmed-bookings").textContent = stats.confirmedReservations.toString();
    document.getElementById("stat-pending-bookings").textContent = stats.pendingReservations.toString();
    document.getElementById("stat-occupancy-rate").textContent = `${stats.occupancyRatePercentage}%`;
    document.getElementById("stat-total-rooms").textContent = `${stats.totalAvailableRooms} / ${stats.totalRooms} Available`;
    const recentTable = document.getElementById("dashboard-recent-table-body");
    if (recentTable) {
      if (stats.recentReservations.length === 0) {
        recentTable.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-3">No recent bookings.</td></tr>`;
      } else {
        recentTable.innerHTML = stats.recentReservations.map((r) => `
          <tr>
            <td><strong>${r.reservationCode}</strong></td>
            <td>${r.userFullName}</td>
            <td>${r.hotelName} (Rm ${r.roomNumber})</td>
            <td>${formatDate(r.checkInDate)}</td>
            <td>${formatCurrency(r.totalPrice)}</td>
            <td>${getStatusBadge(r.reservationStatus)}</td>
          </tr>
        `).join("");
      }
    }
  } catch (err) {
    NotificationManager.error("Failed to load dashboard metrics: " + err.message);
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
    tableBody.innerHTML = currentHotelList.map((h) => `
      <tr>
        <td><strong>#${h.id}</strong></td>
        <td>
          <div class="d-flex align-items-center gap-2">
            <img src="${h.imageUrl || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=100&q=80"}" class="rounded-2" width="40" height="40" style="object-fit: cover;">
            <div>
              <strong>${h.name}</strong><br>
              <span class="text-muted small">${h.starRating} Stars &bull; ${h.totalRooms || 0} Rooms</span>
            </div>
          </div>
        </td>
        <td>${h.city}, ${h.country}</td>
        <td>${h.phoneNumber}</td>
        <td>${h.email}</td>
        <td>${h.checkInTime} / ${h.checkOutTime}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-primary me-1" onclick="window.editHotel(${h.id})">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-sm btn-outline-danger" onclick="window.deleteHotel(${h.id})">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      </tr>
    `).join("");
  } catch (err) {
    tableBody.innerHTML = `<tr><td colspan="7" class="text-danger py-3">Error loading hotels: ${err.message}</td></tr>`;
  }
}
function populateHotelSelects() {
  const selects = [
    document.getElementById("room-filter-hotel"),
    document.getElementById("room-form-hotel")
  ];
  selects.forEach((select) => {
    if (!select) return;
    const currentVal = select.value;
    select.innerHTML = select.id.includes("filter") ? `<option value="">All Hotels</option>` : "";
    currentHotelList.forEach((h) => {
      const opt = document.createElement("option");
      opt.value = h.id.toString();
      opt.textContent = `${h.name} (${h.city})`;
      select.appendChild(opt);
    });
    if (currentVal) select.value = currentVal;
  });
}
async function loadRoomsManagement() {
  const tableBody = document.getElementById("admin-rooms-table-body");
  if (!tableBody) return;
  const hotelIdStr = document.getElementById("room-filter-hotel")?.value;
  const hotelId = hotelIdStr ? parseInt(hotelIdStr) : void 0;
  try {
    const pageData = await roomService.getRooms({ hotelId, size: 50 });
    const rooms = pageData.content || [];
    if (rooms.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="8" class="text-center text-muted py-4">No rooms found.</td></tr>`;
      return;
    }
    tableBody.innerHTML = rooms.map((r) => `
      <tr>
        <td><strong>#${r.id}</strong></td>
        <td><strong>Room ${r.roomNumber}</strong></td>
        <td>${r.hotelName || "-"}</td>
        <td><span class="badge bg-light text-dark border">${r.roomType}</span></td>
        <td>${r.capacity} Guests (Fl ${r.floor})</td>
        <td><strong>${formatCurrency(r.pricePerNight)}</strong></td>
        <td>
          <select class="form-select form-select-sm" style="width: 140px;" onchange="window.updateRoomStatus(${r.id}, this.value)">
            <option value="AVAILABLE" ${r.status === "AVAILABLE" ? "selected" : ""}>AVAILABLE</option>
            <option value="OCCUPIED" ${r.status === "OCCUPIED" ? "selected" : ""}>OCCUPIED</option>
            <option value="MAINTENANCE" ${r.status === "MAINTENANCE" ? "selected" : ""}>MAINTENANCE</option>
            <option value="INACTIVE" ${r.status === "INACTIVE" ? "selected" : ""}>INACTIVE</option>
          </select>
        </td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-primary me-1" onclick="window.editRoom(${r.id})">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-sm btn-outline-danger" onclick="window.deleteRoom(${r.id})">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      </tr>
    `).join("");
  } catch (err) {
    tableBody.innerHTML = `<tr><td colspan="8" class="text-danger py-3">Error loading rooms: ${err.message}</td></tr>`;
  }
}
async function loadReservationsManagement() {
  const tableBody = document.getElementById("admin-reservations-table-body");
  if (!tableBody) return;
  const statusVal = document.getElementById("res-filter-status")?.value;
  try {
    const pageData = await reservationService.getReservations({
      status: statusVal || void 0,
      size: 50,
      sortBy: "createdAt",
      sortDir: "desc"
    });
    const reservations = pageData.content || [];
    if (reservations.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="8" class="text-center text-muted py-4">No reservations found.</td></tr>`;
      return;
    }
    tableBody.innerHTML = reservations.map((res) => `
      <tr>
        <td><strong>${res.reservationCode}</strong></td>
        <td>
          <strong>${res.userFullName}</strong><br>
          <span class="text-muted small">${res.userEmail}</span>
        </td>
        <td>
          ${res.hotelName}<br>
          <span class="text-muted small">${res.roomType} (Rm ${res.roomNumber})</span>
        </td>
        <td>
          ${formatDate(res.checkInDate)} &rarr; ${formatDate(res.checkOutDate)}<br>
          <span class="text-muted small">${res.numberOfNights} Nights &bull; ${res.numberOfGuests} Guests</span>
        </td>
        <td><strong>${formatCurrency(res.totalPrice)}</strong></td>
        <td>${getStatusBadge(res.reservationStatus)}</td>
        <td>${res.payment ? getStatusBadge(res.payment.paymentStatus) : '<span class="text-muted">-</span>'}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-primary" onclick="window.openStatusModal(${res.id}, '${res.reservationStatus}')">
            Update Status
          </button>
        </td>
      </tr>
    `).join("");
  } catch (err) {
    tableBody.innerHTML = `<tr><td colspan="8" class="text-danger py-3">Error loading reservations: ${err.message}</td></tr>`;
  }
}
async function loadUsersManagement() {
  const tableBody = document.getElementById("admin-users-table-body");
  if (!tableBody) return;
  try {
    const pageData = await userService.getUsers({ size: 50 });
    const users = pageData.content || [];
    tableBody.innerHTML = users.map((u) => `
      <tr>
        <td><strong>#${u.id}</strong></td>
        <td><strong>${u.fullName}</strong></td>
        <td>${u.email}</td>
        <td>${u.phoneNumber}</td>
        <td>
          <select class="form-select form-select-sm" style="width: 120px;" onchange="window.updateUserRole(${u.id}, this.value, '${u.accountStatus}')">
            <option value="CUSTOMER" ${u.role === "CUSTOMER" ? "selected" : ""}>CUSTOMER</option>
            <option value="STAFF" ${u.role === "STAFF" ? "selected" : ""}>STAFF</option>
            <option value="ADMIN" ${u.role === "ADMIN" ? "selected" : ""}>ADMIN</option>
          </select>
        </td>
        <td>
          <select class="form-select form-select-sm" style="width: 130px;" onchange="window.updateUserStatus(${u.id}, '${u.role}', this.value)">
            <option value="ACTIVE" ${u.accountStatus === "ACTIVE" ? "selected" : ""}>ACTIVE</option>
            <option value="SUSPENDED" ${u.accountStatus === "SUSPENDED" ? "selected" : ""}>SUSPENDED</option>
          </select>
        </td>
        <td>${formatDateTime(u.createdAt)}</td>
      </tr>
    `).join("");
  } catch (err) {
    tableBody.innerHTML = `<tr><td colspan="7" class="text-danger py-3">Error loading users: ${err.message}</td></tr>`;
  }
}
function setupAdminModals() {
  document.getElementById("room-filter-hotel")?.addEventListener("change", () => {
    loadRoomsManagement();
  });
  document.getElementById("res-filter-status")?.addEventListener("change", () => {
    loadReservationsManagement();
  });
  const hotelForm = document.getElementById("hotel-modal-form");
  hotelForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = {
      name: document.getElementById("hotel-form-name").value,
      description: document.getElementById("hotel-form-desc").value,
      address: document.getElementById("hotel-form-address").value,
      city: document.getElementById("hotel-form-city").value,
      country: document.getElementById("hotel-form-country").value,
      phoneNumber: document.getElementById("hotel-form-phone").value,
      email: document.getElementById("hotel-form-email").value,
      starRating: parseInt(document.getElementById("hotel-form-stars").value),
      checkInTime: document.getElementById("hotel-form-checkin").value || "14:00",
      checkOutTime: document.getElementById("hotel-form-checkout").value || "11:00",
      imageUrl: document.getElementById("hotel-form-image").value,
      amenities: document.getElementById("hotel-form-amenities").value
    };
    try {
      if (currentEditingHotelId) {
        await hotelService.updateHotel(currentEditingHotelId, data);
        NotificationManager.success("Hotel updated successfully!");
      } else {
        await hotelService.createHotel(data);
        NotificationManager.success("Hotel created successfully!");
      }
      hideModal("hotelModal");
      await loadHotelsManagement();
      await loadDashboardStats();
    } catch (err) {
      NotificationManager.error(err.message, "Operation Failed");
    }
  });
  const roomForm = document.getElementById("room-modal-form");
  roomForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = {
      hotelId: parseInt(document.getElementById("room-form-hotel").value),
      roomNumber: document.getElementById("room-form-number").value,
      roomType: document.getElementById("room-form-type").value,
      pricePerNight: parseFloat(document.getElementById("room-form-price").value),
      capacity: parseInt(document.getElementById("room-form-capacity").value),
      floor: parseInt(document.getElementById("room-form-floor").value),
      description: document.getElementById("room-form-desc").value,
      status: document.getElementById("room-form-status").value,
      imageUrl: document.getElementById("room-form-image").value,
      amenities: document.getElementById("room-form-amenities").value
    };
    try {
      if (currentEditingRoomId) {
        await roomService.updateRoom(currentEditingRoomId, data);
        NotificationManager.success("Room updated successfully!");
      } else {
        await roomService.createRoom(data);
        NotificationManager.success("Room created successfully!");
      }
      hideModal("roomModal");
      await loadRoomsManagement();
      await loadDashboardStats();
    } catch (err) {
      NotificationManager.error(err.message, "Operation Failed");
    }
  });
  document.getElementById("save-res-status-btn")?.addEventListener("click", async () => {
    if (!currentEditingResId) return;
    const newStatus = document.getElementById("modal-res-status-select").value;
    const reason = document.getElementById("modal-res-status-reason").value;
    try {
      await reservationService.updateReservationStatus(currentEditingResId, newStatus, reason);
      NotificationManager.success("Reservation status updated!");
      hideModal("reservationStatusModal");
      await loadReservationsManagement();
      await loadDashboardStats();
    } catch (err) {
      NotificationManager.error(err.message, "Failed to update status");
    }
  });
}
function hideModal(modalId) {
  const el = document.getElementById(modalId);
  if (el && window.bootstrap) {
    const modal = window.bootstrap.Modal.getInstance(el);
    modal?.hide();
  }
}
window.openNewHotelModal = () => {
  currentEditingHotelId = null;
  document.getElementById("hotelModalLabel").textContent = "Create New Hotel";
  document.getElementById("hotel-modal-form").reset();
  const el = document.getElementById("hotelModal");
  if (el && window.bootstrap) {
    new window.bootstrap.Modal(el).show();
  }
};
window.editHotel = async (id) => {
  try {
    const h = await hotelService.getHotelById(id);
    currentEditingHotelId = id;
    document.getElementById("hotelModalLabel").textContent = `Edit Hotel: ${h.name}`;
    document.getElementById("hotel-form-name").value = h.name;
    document.getElementById("hotel-form-desc").value = h.description;
    document.getElementById("hotel-form-address").value = h.address;
    document.getElementById("hotel-form-city").value = h.city;
    document.getElementById("hotel-form-country").value = h.country;
    document.getElementById("hotel-form-phone").value = h.phoneNumber;
    document.getElementById("hotel-form-email").value = h.email;
    document.getElementById("hotel-form-stars").value = h.starRating.toString();
    document.getElementById("hotel-form-checkin").value = h.checkInTime;
    document.getElementById("hotel-form-checkout").value = h.checkOutTime;
    document.getElementById("hotel-form-image").value = h.imageUrl || "";
    document.getElementById("hotel-form-amenities").value = h.amenities || "";
    const el = document.getElementById("hotelModal");
    if (el && window.bootstrap) {
      new window.bootstrap.Modal(el).show();
    }
  } catch (err) {
    NotificationManager.error(err.message);
  }
};
window.deleteHotel = async (id) => {
  if (confirm("Are you sure you want to delete this hotel and all its rooms?")) {
    try {
      await hotelService.deleteHotel(id);
      NotificationManager.success("Hotel deleted successfully");
      loadHotelsManagement();
      loadRoomsManagement();
      loadDashboardStats();
    } catch (err) {
      NotificationManager.error(err.message);
    }
  }
};
window.openNewRoomModal = () => {
  currentEditingRoomId = null;
  document.getElementById("roomModalLabel").textContent = "Add Room Inventory";
  document.getElementById("room-modal-form").reset();
  const el = document.getElementById("roomModal");
  if (el && window.bootstrap) {
    new window.bootstrap.Modal(el).show();
  }
};
window.editRoom = async (id) => {
  try {
    const r = await roomService.getRoomById(id);
    currentEditingRoomId = id;
    document.getElementById("roomModalLabel").textContent = `Edit Room ${r.roomNumber}`;
    document.getElementById("room-form-hotel").value = r.hotelId.toString();
    document.getElementById("room-form-number").value = r.roomNumber;
    document.getElementById("room-form-type").value = r.roomType;
    document.getElementById("room-form-price").value = r.pricePerNight.toString();
    document.getElementById("room-form-capacity").value = r.capacity.toString();
    document.getElementById("room-form-floor").value = r.floor.toString();
    document.getElementById("room-form-status").value = r.status;
    document.getElementById("room-form-desc").value = r.description || "";
    document.getElementById("room-form-image").value = r.imageUrl || "";
    document.getElementById("room-form-amenities").value = r.amenities || "";
    const el = document.getElementById("roomModal");
    if (el && window.bootstrap) {
      new window.bootstrap.Modal(el).show();
    }
  } catch (err) {
    NotificationManager.error(err.message);
  }
};
window.updateRoomStatus = async (id, status) => {
  try {
    await roomService.updateRoomStatus(id, status);
    NotificationManager.success(`Room status updated to ${status}`);
    loadDashboardStats();
  } catch (err) {
    NotificationManager.error(err.message);
  }
};
window.deleteRoom = async (id) => {
  if (confirm("Are you sure you want to delete this room?")) {
    try {
      await roomService.deleteRoom(id);
      NotificationManager.success("Room deleted");
      loadRoomsManagement();
      loadDashboardStats();
    } catch (err) {
      NotificationManager.error(err.message);
    }
  }
};
window.openStatusModal = (id, currentStatus) => {
  currentEditingResId = id;
  document.getElementById("modal-res-status-select").value = currentStatus;
  const el = document.getElementById("reservationStatusModal");
  if (el && window.bootstrap) {
    new window.bootstrap.Modal(el).show();
  }
};
window.updateUserRole = async (id, role, accountStatus) => {
  try {
    const user = await userService.getUserById(id);
    await userService.updateUser(id, { ...user, role });
    NotificationManager.success(`User role updated to ${role}`);
    loadDashboardStats();
  } catch (err) {
    NotificationManager.error(err.message);
  }
};
window.updateUserStatus = async (id, role, accountStatus) => {
  try {
    const user = await userService.getUserById(id);
    await userService.updateUser(id, { ...user, accountStatus });
    NotificationManager.success(`Account status updated to ${accountStatus}`);
  } catch (err) {
    NotificationManager.error(err.message);
  }
};
