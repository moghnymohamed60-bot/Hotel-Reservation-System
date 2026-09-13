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

// src/utils/formatters.ts
function formatCurrency(amount) {
  if (amount === void 0 || amount === null) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(amount);
}
function getStarRatingHtml(rating) {
  let html = "";
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      html += '<i class="fas fa-star text-warning"></i>';
    } else {
      html += '<i class="far fa-star text-muted"></i>';
    }
  }
  return html;
}

// src/pages/landing.ts
document.addEventListener("DOMContentLoaded", async () => {
  setupNavigation();
  initSearchForm();
  await loadFeaturedHotels();
  await populateCityOptions();
});
function initSearchForm() {
  const form = document.getElementById("hero-search-form");
  if (!form) return;
  const today = /* @__PURE__ */ new Date();
  const checkInDefault = new Date(today);
  checkInDefault.setDate(today.getDate() + 1);
  const checkOutDefault = new Date(today);
  checkOutDefault.setDate(today.getDate() + 4);
  const checkInInput = document.getElementById("search-checkin");
  const checkOutInput = document.getElementById("search-checkout");
  if (checkInInput && checkOutInput) {
    checkInInput.min = today.toISOString().split("T")[0];
    checkInInput.value = checkInDefault.toISOString().split("T")[0];
    checkOutInput.min = checkInDefault.toISOString().split("T")[0];
    checkOutInput.value = checkOutDefault.toISOString().split("T")[0];
    checkInInput.addEventListener("change", () => {
      const nextDay = new Date(checkInInput.value);
      nextDay.setDate(nextDay.getDate() + 1);
      checkOutInput.min = nextDay.toISOString().split("T")[0];
      if (checkOutInput.value <= checkInInput.value) {
        checkOutInput.value = nextDay.toISOString().split("T")[0];
      }
    });
  }
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const city = document.getElementById("search-city")?.value || "";
    const checkIn = checkInInput?.value || "";
    const checkOut = checkOutInput?.value || "";
    const guests = document.getElementById("search-guests")?.value || "2";
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (checkIn) params.set("checkInDate", checkIn);
    if (checkOut) params.set("checkOutDate", checkOut);
    if (guests) params.set("guests", guests);
    window.location.href = `hotels.html?${params.toString()}`;
  });
}
async function populateCityOptions() {
  const citySelect = document.getElementById("search-city");
  if (!citySelect) return;
  try {
    const cities = await hotelService.getCities();
    cities.forEach((city) => {
      const option = document.createElement("option");
      option.value = city;
      option.textContent = city;
      citySelect.appendChild(option);
    });
  } catch (err) {
    console.warn("Could not load distinct cities", err);
  }
}
async function loadFeaturedHotels() {
  const container = document.getElementById("featured-hotels-grid");
  if (!container) return;
  try {
    const pageData = await hotelService.getHotels({ size: 6, sortBy: "starRating", sortDir: "desc" });
    const hotels = pageData.content || [];
    if (hotels.length === 0) {
      container.innerHTML = `<div class="col-12 text-center py-5 text-muted">No hotels currently available.</div>`;
      return;
    }
    container.innerHTML = hotels.map((h) => `
      <div class="col-lg-4 col-md-6 mb-4">
        <div class="hotel-card">
          <div class="hotel-img-wrapper">
            <img src="${h.imageUrl || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"}" alt="${h.name}">
            <div class="hotel-card-badge">
              <i class="fas fa-map-marker-alt text-warning me-1"></i> ${h.city}, ${h.country}
            </div>
            ${h.minPrice ? `<div class="hotel-card-price-badge">From ${formatCurrency(h.minPrice)}<span class="text-muted fw-normal fs-xs">/night</span></div>` : ""}
          </div>
          <div class="p-4 d-flex flex-column flex-grow-1 justify-content-between">
            <div>
              <div class="d-flex justify-content-between align-items-center mb-2">
                <div class="rating-stars">${getStarRatingHtml(h.starRating)}</div>
                <span class="badge bg-light text-secondary border">${h.totalRooms || 0} Rooms</span>
              </div>
              <h4 class="card-title text-truncate mb-2" title="${h.name}">${h.name}</h4>
              <p class="text-muted small mb-3 text-truncate-2" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                ${h.description}
              </p>
            </div>
            <div class="pt-3 border-top d-flex justify-content-between align-items-center">
              <span class="small text-muted"><i class="fas fa-concierge-bell me-1"></i> Check-in ${h.checkInTime}</span>
              <a href="hotel-details.html?id=${h.id}" class="btn btn-gold btn-sm px-3 rounded-pill">View Stay</a>
            </div>
          </div>
        </div>
      </div>
    `).join("");
  } catch (err) {
    container.innerHTML = `<div class="col-12 text-center text-danger py-4">Failed to load featured properties. Please ensure the backend server is running.</div>`;
  }
}
