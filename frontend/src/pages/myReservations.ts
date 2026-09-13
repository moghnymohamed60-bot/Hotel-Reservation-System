import { reservationService } from '../services/reservationService';
import { requireAuth, setupNavigation } from '../utils/authGuard';
import { formatCurrency, formatDate, getStatusBadge } from '../utils/formatters';
import { NotificationManager } from '../utils/notifications';
import { Reservation } from '../types';

let allReservations: Reservation[] = [];
let selectedReservationId: number | null = null;

document.addEventListener('DOMContentLoaded', async () => {
  setupNavigation();
  if (!requireAuth()) return;

  await loadMyReservations();
  setupFilterTabs();
  setupCancelModal();
});

async function loadMyReservations(): Promise<void> {
  const container = document.getElementById('my-reservations-list');
  if (!container) return;

  container.innerHTML = `<div class="text-center py-5"><div class="spinner-border text-warning" role="status"></div></div>`;

  try {
    allReservations = await reservationService.getMyReservations();
    renderReservations('ALL');
  } catch (err: any) {
    container.innerHTML = `<div class="alert alert-danger">Failed to load reservations: ${err.message}</div>`;
  }
}

function setupFilterTabs(): void {
  const tabs = document.querySelectorAll('.res-filter-tab');
  tabs.forEach((tab) => {
    tab.addEventListener('click', (e) => {
      tabs.forEach((t) => t.classList.remove('active'));
      const target = e.currentTarget as HTMLElement;
      target.classList.add('active');
      const filter = target.getAttribute('data-filter') || 'ALL';
      renderReservations(filter);
    });
  });
}

function renderReservations(filter: string): void {
  const container = document.getElementById('my-reservations-list');
  if (!container) return;

  let filtered = allReservations;
  const today = new Date().toISOString().split('T')[0];

  if (filter === 'UPCOMING') {
    filtered = allReservations.filter((r) => r.reservationStatus === 'CONFIRMED' && r.checkInDate >= today);
  } else if (filter === 'PAID' || filter === 'CONFIRMED') {
    filtered = allReservations.filter((r) => r.reservationStatus === 'CONFIRMED');
  } else if (filter === 'CANCELLED') {
    filtered = allReservations.filter((r) => r.reservationStatus === 'CANCELLED' || r.reservationStatus === 'REJECTED');
  } else if (filter === 'COMPLETED') {
    filtered = allReservations.filter((r) => r.reservationStatus === 'COMPLETED');
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
            <span class="text-muted small d-block">${r.numberOfNights} Night${r.numberOfNights > 1 ? 's' : ''}</span>
          </div>
          <div class="col-md-3 text-md-end">
            <span class="text-muted small d-block">Total Cost</span>
            <h4 class="fw-bold text-navy mb-2">${formatCurrency(r.totalPrice)}</h4>
            ${r.reservationStatus === 'CONFIRMED' || r.reservationStatus === 'PENDING' ? `
              <button class="btn btn-outline-danger btn-sm rounded-pill px-3" onclick="window.openCancelModal(${r.id})">
                Cancel Booking
              </button>
            ` : ''}
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

function setupCancelModal(): void {
  const confirmBtn = document.getElementById('confirm-cancel-res-btn');
  confirmBtn?.addEventListener('click', async () => {
    if (!selectedReservationId) return;

    try {
      await reservationService.cancelReservation(selectedReservationId);
      NotificationManager.success('Reservation cancelled successfully. Any eligible payments are queued for refund.');
      const modalEl = document.getElementById('cancelReservationModal');
      if (modalEl && (window as any).bootstrap) {
        const modal = (window as any).bootstrap.Modal.getInstance(modalEl);
        modal?.hide();
      }
      await loadMyReservations();
    } catch (err: any) {
      NotificationManager.error(err.message, 'Cancellation Failed');
    }
  });
}

(window as any).openCancelModal = (id: number) => {
  selectedReservationId = id;
  const modalEl = document.getElementById('cancelReservationModal');
  if (modalEl && (window as any).bootstrap) {
    const modal = new (window as any).bootstrap.Modal(modalEl);
    modal.show();
  }
};
