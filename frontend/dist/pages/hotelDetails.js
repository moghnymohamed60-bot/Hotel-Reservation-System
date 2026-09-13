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

// src/pages/hotelDetails.ts
var currentHotel = null;
document.addEventListener("DOMContentLoaded", async () => {
  setupNavigation();
  initDatePickers();
  const urlParams = new URLSearchParams(window.location.search);
  const hotelId = urlParams.get("id");
  if (!hotelId) {
    window.location.href = "hotels.html";
    return;
  }
  await loadHotelDetails(parseInt(hotelId));
  setupAvailabilityCheck();
});
function initDatePickers() {
  const today = /* @__PURE__ */ new Date();
  const checkInDefault = new Date(today);
  checkInDefault.setDate(today.getDate() + 1);
  const checkOutDefault = new Date(today);
  checkOutDefault.setDate(today.getDate() + 4);
  const checkInInput = document.getElementById("details-checkin");
  const checkOutInput = document.getElementById("details-checkout");
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
}
async function loadHotelDetails(hotelId) {
  try {
    currentHotel = await hotelService.getHotelById(hotelId);
    renderHotelHeader(currentHotel);
    renderRooms(currentHotel.rooms || []);
  } catch (error) {
    alert("Failed to load hotel details: " + error.message);
    window.location.href = "hotels.html";
  }
}
function renderHotelHeader(h) {
  document.title = `${h.name} - Hotel Reservation System`;
  document.getElementById("hotel-name").textContent = h.name;
  document.getElementById("hotel-location").innerHTML = `<i class="fas fa-map-marker-alt text-warning me-1"></i> ${h.address}, ${h.city}, ${h.country}`;
  document.getElementById("hotel-rating").innerHTML = getStarRatingHtml(h.starRating);
  document.getElementById("hotel-description").textContent = h.description;
  document.getElementById("hotel-checkin-time").textContent = h.checkInTime;
  document.getElementById("hotel-checkout-time").textContent = h.checkOutTime;
  document.getElementById("hotel-contact-phone").textContent = h.phoneNumber;
  document.getElementById("hotel-contact-email").textContent = h.email;
  const heroImg = document.getElementById("hotel-hero-image");
  if (heroImg) {
    heroImg.src = h.imageUrl || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80";
  }
  const amenitiesContainer = document.getElementById("hotel-amenities-list");
  if (amenitiesContainer && h.amenities) {
    const amenities = h.amenities.split(",").map((a) => a.trim());
    amenitiesContainer.innerHTML = amenities.map((a) => `
      <span class="amenity-pill mb-2"><i class="fas fa-check-circle text-success"></i> ${a}</span>
    `).join(" ");
  }
}
function renderRooms(rooms) {
  const container = document.getElementById("rooms-catalog-container");
  if (!container) return;
  if (rooms.length === 0) {
    container.innerHTML = `
      <div class="col-12 text-center py-5">
        <div class="p-4 bg-white rounded-4 border text-muted">No rooms currently available in this property.</div>
      </div>
    `;
    return;
  }
  const checkIn = document.getElementById("details-checkin")?.value;
  const checkOut = document.getElementById("details-checkout")?.value;
  const guests = document.getElementById("details-guests")?.value || "2";
  container.innerHTML = rooms.map((r) => `
    <div class="col-lg-6 mb-4">
      <div class="card border-0 shadow-sm rounded-4 overflow-hidden h-100 hotel-card">
        <div class="row g-0 h-100">
          <div class="col-md-5 position-relative">
            <img src="${r.imageUrl || "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80"}" class="img-fluid h-100 w-100 object-fit-cover" alt="Room ${r.roomNumber}">
            <div class="position-absolute top-0 start-0 m-2">
              <span class="badge bg-dark bg-opacity-75">Room ${r.roomNumber}</span>
            </div>
          </div>
          <div class="col-md-7 d-flex flex-column justify-content-between p-3">
            <div>
              <div class="d-flex justify-content-between align-items-center mb-1">
                <span class="badge bg-primary-subtle text-primary fw-semibold">${r.roomType}</span>
                <div>${getStatusBadge(r.status)}</div>
              </div>
              <h5 class="fw-bold mb-1">${r.roomType} Suite</h5>
              <p class="text-muted small mb-2"><i class="fas fa-user-friends me-1"></i> Up to ${r.capacity} Guests &bull; Floor ${r.floor}</p>
              <p class="text-muted small mb-2 text-truncate-2" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                ${r.description || "Spacious, climate-controlled comfort with high-speed WiFi, modern en-suite bath and luxury toiletries."}
              </p>
            </div>
            <div class="pt-2 border-top d-flex justify-content-between align-items-center">
              <div>
                <span class="fs-5 fw-bold text-navy">${formatCurrency(r.pricePerNight)}</span>
                <span class="text-muted small"> / night</span>
              </div>
              ${r.status === "AVAILABLE" ? `
                <a href="reservation.html?roomId=${r.id}&checkInDate=${checkIn}&checkOutDate=${checkOut}&guests=${guests}" class="btn btn-gold btn-sm px-3 rounded-pill">
                  Book Now <i class="fas fa-arrow-right ms-1"></i>
                </a>
              ` : `
                <button class="btn btn-secondary btn-sm px-3 rounded-pill" disabled>Unavailable</button>
              `}
            </div>
          </div>
        </div>
      </div>
    </div>
  `).join("");
}
function setupAvailabilityCheck() {
  document.getElementById("check-availability-btn")?.addEventListener("click", async () => {
    if (!currentHotel) return;
    const checkIn = document.getElementById("details-checkin").value;
    const checkOut = document.getElementById("details-checkout").value;
    const guests = parseInt(document.getElementById("details-guests").value);
    try {
      const availableRooms = await roomService.findAvailableRooms({
        hotelId: currentHotel.id,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        guests
      });
      renderRooms(availableRooms);
    } catch (err) {
      alert("Error verifying availability: " + err.message);
    }
  });
}
