import { adminService } from '../services/adminService';
import { hotelService } from '../services/hotelService';
import { roomService } from '../services/roomService';
import { reservationService } from '../services/reservationService';
import { userService } from '../services/userService';
import { authService } from '../services/authService';
import { requireRole, setupNavigation } from '../utils/authGuard';
import { formatCurrency, formatDate, formatDateTime, getStatusBadge } from '../utils/formatters';
import { NotificationManager } from '../utils/notifications';
import { DashboardStats, Hotel, Reservation, ReservationStatus, Role, Room, RoomStatus, RoomType, User } from '../types';

let currentHotelList: Hotel[] = [];
let currentEditingHotelId: number | null = null;
let currentEditingRoomId: number | null = null;
let currentEditingResId: number | null = null;

document.addEventListener('DOMContentLoaded', async () => {
  setupNavigation();
  if (!requireRole(['ADMIN', 'STAFF'])) return;

  const user = authService.getCurrentStoredUser();
  if (user?.role === 'STAFF') {
    // Hide admin-only tabs
    document.querySelectorAll('.admin-only-feature').forEach((el) => {
      (el as HTMLElement).style.display = 'none';
    });
  }

  await loadDashboardStats();
  await loadHotelsManagement();
  await loadRoomsManagement();
  await loadReservationsManagement();
  if (user?.role === 'ADMIN') {
    await loadUsersManagement();
  }

  setupAdminModals();
});

async function loadDashboardStats(): Promise<void> {
  try {
    const stats: DashboardStats = await adminService.getDashboardStatistics();

    (document.getElementById('stat-total-revenue') as HTMLElement).textContent = formatCurrency(stats.totalRevenue);
    (document.getElementById('stat-total-bookings') as HTMLElement).textContent = stats.totalReservations.toString();
    (document.getElementById('stat-confirmed-bookings') as HTMLElement).textContent = stats.confirmedReservations.toString();
    (document.getElementById('stat-pending-bookings') as HTMLElement).textContent = stats.pendingReservations.toString();
    (document.getElementById('stat-occupancy-rate') as HTMLElement).textContent = `${stats.occupancyRatePercentage}%`;
    (document.getElementById('stat-total-rooms') as HTMLElement).textContent = `${stats.totalAvailableRooms} / ${stats.totalRooms} Available`;

    // Render Recent Reservations Table in Dashboard Overview
    const recentTable = document.getElementById('dashboard-recent-table-body');
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
        `).join('');
      }
    }
  } catch (err: any) {
    NotificationManager.error('Failed to load dashboard metrics: ' + err.message);
  }
}

// ==========================================
// HOTELS MANAGEMENT
// ==========================================
async function loadHotelsManagement(): Promise<void> {
  const tableBody = document.getElementById('admin-hotels-table-body');
  if (!tableBody) return;

  try {
    const pageData = await hotelService.getHotels({ size: 50 });
    currentHotelList = pageData.content || [];

    // Populate hotel dropdowns in room filter & modal
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
            <img src="${h.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=100&q=80'}" class="rounded-2" width="40" height="40" style="object-fit: cover;">
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
    `).join('');
  } catch (err: any) {
    tableBody.innerHTML = `<tr><td colspan="7" class="text-danger py-3">Error loading hotels: ${err.message}</td></tr>`;
  }
}

function populateHotelSelects(): void {
  const selects = [
    document.getElementById('room-filter-hotel') as HTMLSelectElement,
    document.getElementById('room-form-hotel') as HTMLSelectElement,
  ];

  selects.forEach((select) => {
    if (!select) return;
    const currentVal = select.value;
    select.innerHTML = select.id.includes('filter') ? `<option value="">All Hotels</option>` : '';
    currentHotelList.forEach((h) => {
      const opt = document.createElement('option');
      opt.value = h.id.toString();
      opt.textContent = `${h.name} (${h.city})`;
      select.appendChild(opt);
    });
    if (currentVal) select.value = currentVal;
  });
}

// ==========================================
// ROOMS MANAGEMENT
// ==========================================
async function loadRoomsManagement(): Promise<void> {
  const tableBody = document.getElementById('admin-rooms-table-body');
  if (!tableBody) return;

  const hotelIdStr = (document.getElementById('room-filter-hotel') as HTMLSelectElement)?.value;
  const hotelId = hotelIdStr ? parseInt(hotelIdStr) : undefined;

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
        <td>${r.hotelName || '-'}</td>
        <td><span class="badge bg-light text-dark border">${r.roomType}</span></td>
        <td>${r.capacity} Guests (Fl ${r.floor})</td>
        <td><strong>${formatCurrency(r.pricePerNight)}</strong></td>
        <td>
          <select class="form-select form-select-sm" style="width: 140px;" onchange="window.updateRoomStatus(${r.id}, this.value)">
            <option value="AVAILABLE" ${r.status === 'AVAILABLE' ? 'selected' : ''}>AVAILABLE</option>
            <option value="OCCUPIED" ${r.status === 'OCCUPIED' ? 'selected' : ''}>OCCUPIED</option>
            <option value="MAINTENANCE" ${r.status === 'MAINTENANCE' ? 'selected' : ''}>MAINTENANCE</option>
            <option value="INACTIVE" ${r.status === 'INACTIVE' ? 'selected' : ''}>INACTIVE</option>
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
    `).join('');
  } catch (err: any) {
    tableBody.innerHTML = `<tr><td colspan="8" class="text-danger py-3">Error loading rooms: ${err.message}</td></tr>`;
  }
}

// ==========================================
// RESERVATIONS MANAGEMENT
// ==========================================
async function loadReservationsManagement(): Promise<void> {
  const tableBody = document.getElementById('admin-reservations-table-body');
  if (!tableBody) return;

  const statusVal = (document.getElementById('res-filter-status') as HTMLSelectElement)?.value as ReservationStatus | undefined;

  try {
    const pageData = await reservationService.getReservations({
      status: statusVal || undefined,
      size: 50,
      sortBy: 'createdAt',
      sortDir: 'desc',
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
    `).join('');
  } catch (err: any) {
    tableBody.innerHTML = `<tr><td colspan="8" class="text-danger py-3">Error loading reservations: ${err.message}</td></tr>`;
  }
}

// ==========================================
// USERS MANAGEMENT
// ==========================================
async function loadUsersManagement(): Promise<void> {
  const tableBody = document.getElementById('admin-users-table-body');
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
            <option value="CUSTOMER" ${u.role === 'CUSTOMER' ? 'selected' : ''}>CUSTOMER</option>
            <option value="STAFF" ${u.role === 'STAFF' ? 'selected' : ''}>STAFF</option>
            <option value="ADMIN" ${u.role === 'ADMIN' ? 'selected' : ''}>ADMIN</option>
          </select>
        </td>
        <td>
          <select class="form-select form-select-sm" style="width: 130px;" onchange="window.updateUserStatus(${u.id}, '${u.role}', this.value)">
            <option value="ACTIVE" ${u.accountStatus === 'ACTIVE' ? 'selected' : ''}>ACTIVE</option>
            <option value="SUSPENDED" ${u.accountStatus === 'SUSPENDED' ? 'selected' : ''}>SUSPENDED</option>
          </select>
        </td>
        <td>${formatDateTime(u.createdAt)}</td>
      </tr>
    `).join('');
  } catch (err: any) {
    tableBody.innerHTML = `<tr><td colspan="7" class="text-danger py-3">Error loading users: ${err.message}</td></tr>`;
  }
}

// ==========================================
// MODAL FORMS & EVENT ATTACHMENTS
// ==========================================
function setupAdminModals(): void {
  // Hotel Filter / Form
  document.getElementById('room-filter-hotel')?.addEventListener('change', () => {
    loadRoomsManagement();
  });

  document.getElementById('res-filter-status')?.addEventListener('change', () => {
    loadReservationsManagement();
  });

  // Hotel Form Submit
  const hotelForm = document.getElementById('hotel-modal-form') as HTMLFormElement;
  hotelForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data: Partial<Hotel> = {
      name: (document.getElementById('hotel-form-name') as HTMLInputElement).value,
      description: (document.getElementById('hotel-form-desc') as HTMLTextAreaElement).value,
      address: (document.getElementById('hotel-form-address') as HTMLInputElement).value,
      city: (document.getElementById('hotel-form-city') as HTMLInputElement).value,
      country: (document.getElementById('hotel-form-country') as HTMLInputElement).value,
      phoneNumber: (document.getElementById('hotel-form-phone') as HTMLInputElement).value,
      email: (document.getElementById('hotel-form-email') as HTMLInputElement).value,
      starRating: parseInt((document.getElementById('hotel-form-stars') as HTMLSelectElement).value),
      checkInTime: (document.getElementById('hotel-form-checkin') as HTMLInputElement).value || '14:00',
      checkOutTime: (document.getElementById('hotel-form-checkout') as HTMLInputElement).value || '11:00',
      imageUrl: (document.getElementById('hotel-form-image') as HTMLInputElement).value,
      amenities: (document.getElementById('hotel-form-amenities') as HTMLInputElement).value,
    };

    try {
      if (currentEditingHotelId) {
        await hotelService.updateHotel(currentEditingHotelId, data);
        NotificationManager.success('Hotel updated successfully!');
      } else {
        await hotelService.createHotel(data);
        NotificationManager.success('Hotel created successfully!');
      }

      hideModal('hotelModal');
      await loadHotelsManagement();
      await loadDashboardStats();
    } catch (err: any) {
      NotificationManager.error(err.message, 'Operation Failed');
    }
  });

  // Room Form Submit
  const roomForm = document.getElementById('room-modal-form') as HTMLFormElement;
  roomForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data: Partial<Room> = {
      hotelId: parseInt((document.getElementById('room-form-hotel') as HTMLSelectElement).value),
      roomNumber: (document.getElementById('room-form-number') as HTMLInputElement).value,
      roomType: (document.getElementById('room-form-type') as HTMLSelectElement).value as RoomType,
      pricePerNight: parseFloat((document.getElementById('room-form-price') as HTMLInputElement).value),
      capacity: parseInt((document.getElementById('room-form-capacity') as HTMLInputElement).value),
      floor: parseInt((document.getElementById('room-form-floor') as HTMLInputElement).value),
      description: (document.getElementById('room-form-desc') as HTMLTextAreaElement).value,
      status: (document.getElementById('room-form-status') as HTMLSelectElement).value as RoomStatus,
      imageUrl: (document.getElementById('room-form-image') as HTMLInputElement).value,
      amenities: (document.getElementById('room-form-amenities') as HTMLInputElement).value,
    };

    try {
      if (currentEditingRoomId) {
        await roomService.updateRoom(currentEditingRoomId, data);
        NotificationManager.success('Room updated successfully!');
      } else {
        await roomService.createRoom(data);
        NotificationManager.success('Room created successfully!');
      }

      hideModal('roomModal');
      await loadRoomsManagement();
      await loadDashboardStats();
    } catch (err: any) {
      NotificationManager.error(err.message, 'Operation Failed');
    }
  });

  // Status Change Submit
  document.getElementById('save-res-status-btn')?.addEventListener('click', async () => {
    if (!currentEditingResId) return;
    const newStatus = (document.getElementById('modal-res-status-select') as HTMLSelectElement).value as ReservationStatus;
    const reason = (document.getElementById('modal-res-status-reason') as HTMLInputElement).value;

    try {
      await reservationService.updateReservationStatus(currentEditingResId, newStatus, reason);
      NotificationManager.success('Reservation status updated!');
      hideModal('reservationStatusModal');
      await loadReservationsManagement();
      await loadDashboardStats();
    } catch (err: any) {
      NotificationManager.error(err.message, 'Failed to update status');
    }
  });
}

function hideModal(modalId: string): void {
  const el = document.getElementById(modalId);
  if (el && (window as any).bootstrap) {
    const modal = (window as any).bootstrap.Modal.getInstance(el);
    modal?.hide();
  }
}

// Global window functions for table action buttons
(window as any).openNewHotelModal = () => {
  currentEditingHotelId = null;
  (document.getElementById('hotelModalLabel') as HTMLElement).textContent = 'Create New Hotel';
  (document.getElementById('hotel-modal-form') as HTMLFormElement).reset();
  const el = document.getElementById('hotelModal');
  if (el && (window as any).bootstrap) {
    new (window as any).bootstrap.Modal(el).show();
  }
};

(window as any).editHotel = async (id: number) => {
  try {
    const h = await hotelService.getHotelById(id);
    currentEditingHotelId = id;
    (document.getElementById('hotelModalLabel') as HTMLElement).textContent = `Edit Hotel: ${h.name}`;

    (document.getElementById('hotel-form-name') as HTMLInputElement).value = h.name;
    (document.getElementById('hotel-form-desc') as HTMLTextAreaElement).value = h.description;
    (document.getElementById('hotel-form-address') as HTMLInputElement).value = h.address;
    (document.getElementById('hotel-form-city') as HTMLInputElement).value = h.city;
    (document.getElementById('hotel-form-country') as HTMLInputElement).value = h.country;
    (document.getElementById('hotel-form-phone') as HTMLInputElement).value = h.phoneNumber;
    (document.getElementById('hotel-form-email') as HTMLInputElement).value = h.email;
    (document.getElementById('hotel-form-stars') as HTMLSelectElement).value = h.starRating.toString();
    (document.getElementById('hotel-form-checkin') as HTMLInputElement).value = h.checkInTime;
    (document.getElementById('hotel-form-checkout') as HTMLInputElement).value = h.checkOutTime;
    (document.getElementById('hotel-form-image') as HTMLInputElement).value = h.imageUrl || '';
    (document.getElementById('hotel-form-amenities') as HTMLInputElement).value = h.amenities || '';

    const el = document.getElementById('hotelModal');
    if (el && (window as any).bootstrap) {
      new (window as any).bootstrap.Modal(el).show();
    }
  } catch (err: any) {
    NotificationManager.error(err.message);
  }
};

(window as any).deleteHotel = async (id: number) => {
  if (confirm('Are you sure you want to delete this hotel and all its rooms?')) {
    try {
      await hotelService.deleteHotel(id);
      NotificationManager.success('Hotel deleted successfully');
      loadHotelsManagement();
      loadRoomsManagement();
      loadDashboardStats();
    } catch (err: any) {
      NotificationManager.error(err.message);
    }
  }
};

(window as any).openNewRoomModal = () => {
  currentEditingRoomId = null;
  (document.getElementById('roomModalLabel') as HTMLElement).textContent = 'Add Room Inventory';
  (document.getElementById('room-modal-form') as HTMLFormElement).reset();
  const el = document.getElementById('roomModal');
  if (el && (window as any).bootstrap) {
    new (window as any).bootstrap.Modal(el).show();
  }
};

(window as any).editRoom = async (id: number) => {
  try {
    const r = await roomService.getRoomById(id);
    currentEditingRoomId = id;
    (document.getElementById('roomModalLabel') as HTMLElement).textContent = `Edit Room ${r.roomNumber}`;

    (document.getElementById('room-form-hotel') as HTMLSelectElement).value = r.hotelId.toString();
    (document.getElementById('room-form-number') as HTMLInputElement).value = r.roomNumber;
    (document.getElementById('room-form-type') as HTMLSelectElement).value = r.roomType;
    (document.getElementById('room-form-price') as HTMLInputElement).value = r.pricePerNight.toString();
    (document.getElementById('room-form-capacity') as HTMLInputElement).value = r.capacity.toString();
    (document.getElementById('room-form-floor') as HTMLInputElement).value = r.floor.toString();
    (document.getElementById('room-form-status') as HTMLSelectElement).value = r.status;
    (document.getElementById('room-form-desc') as HTMLTextAreaElement).value = r.description || '';
    (document.getElementById('room-form-image') as HTMLInputElement).value = r.imageUrl || '';
    (document.getElementById('room-form-amenities') as HTMLInputElement).value = r.amenities || '';

    const el = document.getElementById('roomModal');
    if (el && (window as any).bootstrap) {
      new (window as any).bootstrap.Modal(el).show();
    }
  } catch (err: any) {
    NotificationManager.error(err.message);
  }
};

(window as any).updateRoomStatus = async (id: number, status: RoomStatus) => {
  try {
    await roomService.updateRoomStatus(id, status);
    NotificationManager.success(`Room status updated to ${status}`);
    loadDashboardStats();
  } catch (err: any) {
    NotificationManager.error(err.message);
  }
};

(window as any).deleteRoom = async (id: number) => {
  if (confirm('Are you sure you want to delete this room?')) {
    try {
      await roomService.deleteRoom(id);
      NotificationManager.success('Room deleted');
      loadRoomsManagement();
      loadDashboardStats();
    } catch (err: any) {
      NotificationManager.error(err.message);
    }
  }
};

(window as any).openStatusModal = (id: number, currentStatus: string) => {
  currentEditingResId = id;
  (document.getElementById('modal-res-status-select') as HTMLSelectElement).value = currentStatus;
  const el = document.getElementById('reservationStatusModal');
  if (el && (window as any).bootstrap) {
    new (window as any).bootstrap.Modal(el).show();
  }
};

(window as any).updateUserRole = async (id: number, role: Role, accountStatus: string) => {
  try {
    const user = await userService.getUserById(id);
    await userService.updateUser(id, { ...user, role });
    NotificationManager.success(`User role updated to ${role}`);
    loadDashboardStats();
  } catch (err: any) {
    NotificationManager.error(err.message);
  }
};

(window as any).updateUserStatus = async (id: number, role: string, accountStatus: any) => {
  try {
    const user = await userService.getUserById(id);
    await userService.updateUser(id, { ...user, accountStatus });
    NotificationManager.success(`Account status updated to ${accountStatus}`);
  } catch (err: any) {
    NotificationManager.error(err.message);
  }
};
