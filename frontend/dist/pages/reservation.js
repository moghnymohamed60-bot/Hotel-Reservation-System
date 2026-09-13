// src/services/apiService.ts
var ApiService = class {
  static BASE_URL = "http://localhost:8080/api";
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

// src/pages/reservation.ts
var currentRoom = null;
var calculatedNights = 1;
var calculatedTotal = 0;
document.addEventListener("DOMContentLoaded", async () => {
  setupNavigation();
  if (!requireAuth()) return;
  const urlParams = new URLSearchParams(window.location.search);
  const roomId = urlParams.get("roomId");
  const checkInDate = urlParams.get("checkInDate");
  const checkOutDate = urlParams.get("checkOutDate");
  const guests = urlParams.get("guests") || "1";
  if (!roomId || !checkInDate || !checkOutDate) {
    NotificationManager.error("Missing reservation details");
    window.location.href = "hotels.html";
    return;
  }
  document.getElementById("res-checkin").value = checkInDate;
  document.getElementById("res-checkout").value = checkOutDate;
  document.getElementById("res-guests").value = guests;
  await loadRoomDetails(parseInt(roomId));
  setupDateCalculation();
  setupBookingForm();
});
async function loadRoomDetails(roomId) {
  try {
    currentRoom = await roomService.getRoomById(roomId);
    document.getElementById("summary-hotel-name").textContent = currentRoom.hotelName || "Grand Hotel";
    document.getElementById("summary-hotel-location").textContent = currentRoom.hotelCity || "";
    document.getElementById("summary-room-type").textContent = `${currentRoom.roomType} (Room ${currentRoom.roomNumber})`;
    document.getElementById("summary-price-night").textContent = formatCurrency(currentRoom.pricePerNight);
    const roomImg = document.getElementById("summary-room-img");
    if (roomImg) {
      roomImg.src = currentRoom.imageUrl || "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80";
    }
    recalculateSummary();
  } catch (err) {
    NotificationManager.error("Failed to load room details: " + err.message);
    window.location.href = "hotels.html";
  }
}
function setupDateCalculation() {
  const checkInInput = document.getElementById("res-checkin");
  const checkOutInput = document.getElementById("res-checkout");
  const handler = () => recalculateSummary();
  checkInInput?.addEventListener("change", handler);
  checkOutInput?.addEventListener("change", handler);
}
function recalculateSummary() {
  if (!currentRoom) return;
  const checkInStr = document.getElementById("res-checkin").value;
  const checkOutStr = document.getElementById("res-checkout").value;
  const checkIn = new Date(checkInStr);
  const checkOut = new Date(checkOutStr);
  const diffTime = checkOut.getTime() - checkIn.getTime();
  calculatedNights = Math.ceil(diffTime / (1e3 * 60 * 60 * 24));
  if (calculatedNights <= 0) {
    calculatedNights = 1;
  }
  calculatedTotal = currentRoom.pricePerNight * calculatedNights;
  document.getElementById("summary-nights-count").textContent = `${calculatedNights} Night${calculatedNights > 1 ? "s" : ""}`;
  document.getElementById("summary-dates-display").textContent = `${formatDate(checkInStr)} - ${formatDate(checkOutStr)}`;
  document.getElementById("summary-subtotal").textContent = formatCurrency(calculatedTotal);
  document.getElementById("summary-total-price").textContent = formatCurrency(calculatedTotal);
}
function setupBookingForm() {
  const form = document.getElementById("reservation-checkout-form");
  if (!form) return;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!currentRoom) return;
    const btn = document.getElementById("confirm-booking-btn");
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span> Processing Reservation...`;
    const checkInDate = document.getElementById("res-checkin").value;
    const checkOutDate = document.getElementById("res-checkout").value;
    const numberOfGuests = parseInt(document.getElementById("res-guests").value);
    const specialRequests = document.getElementById("res-special-requests").value;
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value || "CARD";
    try {
      const reservation = await reservationService.createReservation({
        roomId: currentRoom.id,
        checkInDate,
        checkOutDate,
        numberOfGuests,
        specialRequests,
        paymentMethod
      });
      NotificationManager.success("Booking confirmed! Redirecting to confirmation page...");
      setTimeout(() => {
        window.location.href = `confirmation.html?code=${reservation.reservationCode}`;
      }, 1e3);
    } catch (err) {
      NotificationManager.error(err.message, "Reservation Failed");
      btn.disabled = false;
      btn.innerHTML = `<i class="fas fa-lock me-2"></i> Confirm & Pay ${formatCurrency(calculatedTotal)}`;
    }
  });
}
