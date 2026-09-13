import { roomService } from '../services/roomService';
import { reservationService } from '../services/reservationService';
import { requireAuth, setupNavigation } from '../utils/authGuard';
import { formatCurrency, formatDate } from '../utils/formatters';
import { NotificationManager } from '../utils/notifications';
import { Room } from '../types';

let currentRoom: Room | null = null;
let calculatedNights = 1;
let calculatedTotal = 0;

document.addEventListener('DOMContentLoaded', async () => {
  setupNavigation();
  if (!requireAuth()) return;

  const urlParams = new URLSearchParams(window.location.search);
  const roomId = urlParams.get('roomId');
  const checkInDate = urlParams.get('checkInDate');
  const checkOutDate = urlParams.get('checkOutDate');
  const guests = urlParams.get('guests') || '1';

  if (!roomId || !checkInDate || !checkOutDate) {
    NotificationManager.error('Missing reservation details');
    window.location.href = 'hotels.html';
    return;
  }

  (document.getElementById('res-checkin') as HTMLInputElement).value = checkInDate;
  (document.getElementById('res-checkout') as HTMLInputElement).value = checkOutDate;
  (document.getElementById('res-guests') as HTMLInputElement).value = guests;

  await loadRoomDetails(parseInt(roomId));
  setupDateCalculation();
  setupBookingForm();
});

async function loadRoomDetails(roomId: number): Promise<void> {
  try {
    currentRoom = await roomService.getRoomById(roomId);

    (document.getElementById('summary-hotel-name') as HTMLElement).textContent = currentRoom.hotelName || 'Grand Hotel';
    (document.getElementById('summary-hotel-location') as HTMLElement).textContent = currentRoom.hotelCity || '';
    (document.getElementById('summary-room-type') as HTMLElement).textContent = `${currentRoom.roomType} (Room ${currentRoom.roomNumber})`;
    (document.getElementById('summary-price-night') as HTMLElement).textContent = formatCurrency(currentRoom.pricePerNight);

    const roomImg = document.getElementById('summary-room-img') as HTMLImageElement;
    if (roomImg) {
      roomImg.src = currentRoom.imageUrl || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80';
    }

    recalculateSummary();
  } catch (err: any) {
    NotificationManager.error('Failed to load room details: ' + err.message);
    window.location.href = 'hotels.html';
  }
}

function setupDateCalculation(): void {
  const checkInInput = document.getElementById('res-checkin') as HTMLInputElement;
  const checkOutInput = document.getElementById('res-checkout') as HTMLInputElement;

  const handler = () => recalculateSummary();
  checkInInput?.addEventListener('change', handler);
  checkOutInput?.addEventListener('change', handler);
}

function recalculateSummary(): void {
  if (!currentRoom) return;

  const checkInStr = (document.getElementById('res-checkin') as HTMLInputElement).value;
  const checkOutStr = (document.getElementById('res-checkout') as HTMLInputElement).value;

  const checkIn = new Date(checkInStr);
  const checkOut = new Date(checkOutStr);

  const diffTime = checkOut.getTime() - checkIn.getTime();
  calculatedNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (calculatedNights <= 0) {
    calculatedNights = 1;
  }

  calculatedTotal = currentRoom.pricePerNight * calculatedNights;

  (document.getElementById('summary-nights-count') as HTMLElement).textContent = `${calculatedNights} Night${calculatedNights > 1 ? 's' : ''}`;
  (document.getElementById('summary-dates-display') as HTMLElement).textContent = `${formatDate(checkInStr)} - ${formatDate(checkOutStr)}`;
  (document.getElementById('summary-subtotal') as HTMLElement).textContent = formatCurrency(calculatedTotal);
  (document.getElementById('summary-total-price') as HTMLElement).textContent = formatCurrency(calculatedTotal);
}

function setupBookingForm(): void {
  const form = document.getElementById('reservation-checkout-form') as HTMLFormElement;
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!currentRoom) return;

    const btn = document.getElementById('confirm-booking-btn') as HTMLButtonElement;
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span> Processing Reservation...`;

    const checkInDate = (document.getElementById('res-checkin') as HTMLInputElement).value;
    const checkOutDate = (document.getElementById('res-checkout') as HTMLInputElement).value;
    const numberOfGuests = parseInt((document.getElementById('res-guests') as HTMLInputElement).value);
    const specialRequests = (document.getElementById('res-special-requests') as HTMLTextAreaElement).value;
    const paymentMethod = (document.querySelector('input[name="paymentMethod"]:checked') as HTMLInputElement)?.value || 'CARD';

    try {
      const reservation = await reservationService.createReservation({
        roomId: currentRoom.id,
        checkInDate,
        checkOutDate,
        numberOfGuests,
        specialRequests,
        paymentMethod,
      });

      NotificationManager.success('Booking confirmed! Redirecting to confirmation page...');
      setTimeout(() => {
        window.location.href = `confirmation.html?code=${reservation.reservationCode}`;
      }, 1000);
    } catch (err: any) {
      NotificationManager.error(err.message, 'Reservation Failed');
      btn.disabled = false;
      btn.innerHTML = `<i class="fas fa-lock me-2"></i> Confirm & Pay ${formatCurrency(calculatedTotal)}`;
    }
  });
}
