import { authService } from '../services/authService';
import { userService } from '../services/userService';
import { requireAuth, setupNavigation } from '../utils/authGuard';
import { formatDateTime, getStatusBadge } from '../utils/formatters';
import { NotificationManager } from '../utils/notifications';
import { User } from '../types';

let currentUser: User | null = null;

document.addEventListener('DOMContentLoaded', async () => {
  setupNavigation();
  if (!requireAuth()) return;

  await loadUserProfile();
  setupProfileForm();
  setupPasswordForm();
});

async function loadUserProfile(): Promise<void> {
  try {
    currentUser = await authService.getCurrentUser();

    (document.getElementById('profile-fullname-header') as HTMLElement).textContent = currentUser.fullName;
    (document.getElementById('profile-email-header') as HTMLElement).textContent = currentUser.email;
    (document.getElementById('profile-role-badge') as HTMLElement).textContent = currentUser.role;
    (document.getElementById('profile-status-badge') as HTMLElement).innerHTML = getStatusBadge(currentUser.accountStatus);
    (document.getElementById('profile-joined-at') as HTMLElement).textContent = formatDateTime(currentUser.createdAt);

    (document.getElementById('profile-first-name') as HTMLInputElement).value = currentUser.firstName;
    (document.getElementById('profile-last-name') as HTMLInputElement).value = currentUser.lastName;
    (document.getElementById('profile-email') as HTMLInputElement).value = currentUser.email;
    (document.getElementById('profile-phone') as HTMLInputElement).value = currentUser.phoneNumber;
  } catch (err: any) {
    NotificationManager.error('Failed to load profile: ' + err.message);
  }
}

function setupProfileForm(): void {
  const form = document.getElementById('profile-update-form') as HTMLFormElement;
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    const firstName = (document.getElementById('profile-first-name') as HTMLInputElement).value;
    const lastName = (document.getElementById('profile-last-name') as HTMLInputElement).value;
    const email = (document.getElementById('profile-email') as HTMLInputElement).value;
    const phoneNumber = (document.getElementById('profile-phone') as HTMLInputElement).value;

    try {
      const updated = await userService.updateUser(currentUser.id, {
        firstName,
        lastName,
        email,
        phoneNumber,
      });

      currentUser = updated;
      authService.getCurrentUser(); // sync store
      NotificationManager.success('Profile updated successfully!');
      loadUserProfile();
    } catch (err: any) {
      NotificationManager.error(err.message, 'Update Failed');
    }
  });
}

function setupPasswordForm(): void {
  const form = document.getElementById('password-change-form') as HTMLFormElement;
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    const currentPassword = (document.getElementById('pwd-current') as HTMLInputElement).value;
    const newPassword = (document.getElementById('pwd-new') as HTMLInputElement).value;
    const confirmPassword = (document.getElementById('pwd-confirm') as HTMLInputElement).value;

    if (newPassword !== confirmPassword) {
      NotificationManager.error('New password and confirmation do not match');
      return;
    }

    try {
      await userService.changePassword(currentUser.id, { currentPassword, newPassword });
      NotificationManager.success('Password changed successfully!');
      form.reset();
    } catch (err: any) {
      NotificationManager.error(err.message, 'Password Change Failed');
    }
  });
}
