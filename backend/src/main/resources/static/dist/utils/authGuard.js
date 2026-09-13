import { authService } from '../services/authService';
export function setupNavigation() {
    const user = authService.getCurrentStoredUser();
    const navContainer = document.getElementById('auth-nav-items');
    if (!navContainer)
        return;
    if (user) {
        let dashboardLink = '';
        if (user.role === 'ADMIN' || user.role === 'STAFF') {
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
        document.getElementById('nav-logout-btn')?.addEventListener('click', () => {
            authService.logout();
        });
    }
    else {
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
export function requireAuth() {
    if (!authService.isLoggedIn()) {
        window.location.href = `login.html?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`;
        return false;
    }
    return true;
}
export function requireRole(allowedRoles) {
    if (!requireAuth())
        return false;
    const user = authService.getCurrentStoredUser();
    if (!user || !allowedRoles.includes(user.role)) {
        window.location.href = 'index.html?error=unauthorized';
        return false;
    }
    return true;
}
