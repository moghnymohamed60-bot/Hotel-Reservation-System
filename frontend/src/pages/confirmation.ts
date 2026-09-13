import { reservationService } from '../services/reservationService';
import { setupNavigation } from '../utils/authGuard';
import { formatCurrency, formatDate, formatDateTime, getStatusBadge } from '../utils/formatters';
import { Reservation } from '../types';

document.addEventListener('DOMContentLoaded', async () => {
  setupNavigation();

  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');

  if (!code) {
    window.location.href = 'my-reservations.html';
    return;
  }

  await loadReservationDetails(code);
  document.getElementById('print-receipt-btn')?.addEventListener('click', () => {
    window.print();
  });
});

async function loadReservationDetails(code: string): Promise<void> {
  try {
    const res = await reservationService.getReservationByCode(code);
    renderConfirmation(res);
  } catch (err: any) {
    alert('Error loading reservation: ' + err.message);
    window.location.href = 'my-reservations.html';
  }
}

function renderConfirmation(res: Reservation): void {
  (document.getElementById('conf-code') as HTMLElement).textContent = res.reservationCode;
  (document.getElementById('conf-status') as HTMLElement).innerHTML = getStatusBadge(res.reservationStatus);
  (document.getElementById('conf-hotel-name') as HTMLElement).textContent = res.hotelName;
  (document.getElementById('conf-hotel-location') as HTMLElement).textContent = `${res.hotelAddress}, ${res.hotelCity}`;
  (document.getElementById('conf-room') as HTMLElement).textContent = `${res.roomType} (Room ${res.roomNumber})`;
  (document.getElementById('conf-checkin') as HTMLElement).textContent = formatDate(res.checkInDate);
  (document.getElementById('conf-checkout') as HTMLElement).textContent = formatDate(res.checkOutDate);
  (document.getElementById('conf-duration') as HTMLElement).textContent = `${res.numberOfNights} Night${res.numberOfNights > 1 ? 's' : ''}`;
  (document.getElementById('conf-guests') as HTMLElement).textContent = `${res.numberOfGuests} Guest${res.numberOfGuests > 1 ? 's' : ''}`;
  (document.getElementById('conf-total-price') as HTMLElement).textContent = formatCurrency(res.totalPrice);
  (document.getElementById('conf-guest-name') as HTMLElement).textContent = res.userFullName;
  (document.getElementById('conf-guest-email') as HTMLElement).textContent = res.userEmail;
  (document.getElementById('conf-booked-at') as HTMLElement).textContent = formatDateTime(res.createdAt);

  if (res.payment) {
    (document.getElementById('conf-payment-status') as HTMLElement).innerHTML = getStatusBadge(res.payment.paymentStatus);
    (document.getElementById('conf-payment-method') as HTMLElement).textContent = res.payment.paymentMethod;
    (document.getElementById('conf-payment-ref') as HTMLElement).textContent = res.payment.transactionReference;
  }
}
