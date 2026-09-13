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

// src/pages/profile.ts
var currentUser = null;
document.addEventListener("DOMContentLoaded", async () => {
  setupNavigation();
  if (!requireAuth()) return;
  await loadUserProfile();
  setupProfileForm();
  setupPasswordForm();
});
async function loadUserProfile() {
  try {
    currentUser = await authService.getCurrentUser();
    document.getElementById("profile-fullname-header").textContent = currentUser.fullName;
    document.getElementById("profile-email-header").textContent = currentUser.email;
    document.getElementById("profile-role-badge").textContent = currentUser.role;
    document.getElementById("profile-status-badge").innerHTML = getStatusBadge(currentUser.accountStatus);
    document.getElementById("profile-joined-at").textContent = formatDateTime(currentUser.createdAt);
    document.getElementById("profile-first-name").value = currentUser.firstName;
    document.getElementById("profile-last-name").value = currentUser.lastName;
    document.getElementById("profile-email").value = currentUser.email;
    document.getElementById("profile-phone").value = currentUser.phoneNumber;
  } catch (err) {
    NotificationManager.error("Failed to load profile: " + err.message);
  }
}
function setupProfileForm() {
  const form = document.getElementById("profile-update-form");
  if (!form) return;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    const firstName = document.getElementById("profile-first-name").value;
    const lastName = document.getElementById("profile-last-name").value;
    const email = document.getElementById("profile-email").value;
    const phoneNumber = document.getElementById("profile-phone").value;
    try {
      const updated = await userService.updateUser(currentUser.id, {
        firstName,
        lastName,
        email,
        phoneNumber
      });
      currentUser = updated;
      authService.getCurrentUser();
      NotificationManager.success("Profile updated successfully!");
      loadUserProfile();
    } catch (err) {
      NotificationManager.error(err.message, "Update Failed");
    }
  });
}
function setupPasswordForm() {
  const form = document.getElementById("password-change-form");
  if (!form) return;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    const currentPassword = document.getElementById("pwd-current").value;
    const newPassword = document.getElementById("pwd-new").value;
    const confirmPassword = document.getElementById("pwd-confirm").value;
    if (newPassword !== confirmPassword) {
      NotificationManager.error("New password and confirmation do not match");
      return;
    }
    try {
      await userService.changePassword(currentUser.id, { currentPassword, newPassword });
      NotificationManager.success("Password changed successfully!");
      form.reset();
    } catch (err) {
      NotificationManager.error(err.message, "Password Change Failed");
    }
  });
}
