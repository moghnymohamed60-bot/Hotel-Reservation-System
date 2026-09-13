import { authService } from '../services/authService';
import { setupNavigation } from '../utils/authGuard';
import { NotificationManager } from '../utils/notifications';

document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  initLoginForm();
  initRegisterForm();
  initDemoCredentialsButtons();
});

function initLoginForm(): void {
  const form = document.getElementById('login-form') as HTMLFormElement;
  if (!form) return;

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('expired') === 'true') {
    NotificationManager.warning('Your session has expired. Please sign in again.');
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('login-submit-btn') as HTMLButtonElement;
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span> Signing in...`;

    const email = (document.getElementById('login-email') as HTMLInputElement).value;
    const password = (document.getElementById('login-password') as HTMLInputElement).value;

    try {
      const res = await authService.login({ email, password });
      NotificationManager.success(`Welcome back, ${res.user.firstName}!`);

      const redirect = urlParams.get('redirect');
      setTimeout(() => {
        if (redirect) {
          window.location.href = redirect;
        } else if (res.user.role === 'ADMIN' || res.user.role === 'STAFF') {
          window.location.href = 'admin.html';
        } else {
          window.location.href = 'index.html';
        }
      }, 700);
    } catch (err: any) {
      NotificationManager.error(err.message, 'Login Failed');
      btn.disabled = false;
      btn.innerHTML = `Sign In <i class="fas fa-arrow-right ms-2"></i>`;
    }
  });
}

function initRegisterForm(): void {
  const form = document.getElementById('register-form') as HTMLFormElement;
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('register-submit-btn') as HTMLButtonElement;

    const firstName = (document.getElementById('reg-first-name') as HTMLInputElement).value;
    const lastName = (document.getElementById('reg-last-name') as HTMLInputElement).value;
    const email = (document.getElementById('reg-email') as HTMLInputElement).value;
    const phoneNumber = (document.getElementById('reg-phone') as HTMLInputElement).value;
    const password = (document.getElementById('reg-password') as HTMLInputElement).value;
    const confirmPassword = (document.getElementById('reg-confirm-password') as HTMLInputElement).value;

    if (password !== confirmPassword) {
      NotificationManager.error('Passwords do not match');
      return;
    }

    btn.disabled = true;
    btn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span> Creating Account...`;

    try {
      const res = await authService.register({
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
      });

      NotificationManager.success(`Account created! Welcome, ${res.user.firstName}!`);
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 700);
    } catch (err: any) {
      NotificationManager.error(err.message, 'Registration Failed');
      btn.disabled = false;
      btn.innerHTML = `Create Account <i class="fas fa-user-plus ms-2"></i>`;
    }
  });
}

function initDemoCredentialsButtons(): void {
  const adminBtn = document.getElementById('fill-demo-admin');
  const staffBtn = document.getElementById('fill-demo-staff');
  const customerBtn = document.getElementById('fill-demo-customer');

  adminBtn?.addEventListener('click', () => {
    (document.getElementById('login-email') as HTMLInputElement).value = 'admin@grandhotel.com';
    (document.getElementById('login-password') as HTMLInputElement).value = 'password123';
  });

  staffBtn?.addEventListener('click', () => {
    (document.getElementById('login-email') as HTMLInputElement).value = 'sarah.staff@grandhotel.com';
    (document.getElementById('login-password') as HTMLInputElement).value = 'password123';
  });

  customerBtn?.addEventListener('click', () => {
    (document.getElementById('login-email') as HTMLInputElement).value = 'john.doe@example.com';
    (document.getElementById('login-password') as HTMLInputElement).value = 'password123';
  });
}
