import { hotelService } from '../services/hotelService';
import { roomService } from '../services/roomService';
import { setupNavigation } from '../utils/authGuard';
import { formatCurrency, getStarRatingHtml, getStatusBadge } from '../utils/formatters';
import { Hotel, Room } from '../types';

let currentHotel: Hotel | null = null;

document.addEventListener('DOMContentLoaded', async () => {
  setupNavigation();
  initDatePickers();
  const urlParams = new URLSearchParams(window.location.search);
  const hotelId = urlParams.get('id');

  if (!hotelId) {
    window.location.href = 'hotels.html';
    return;
  }

  await loadHotelDetails(parseInt(hotelId));
  setupAvailabilityCheck();
});

function initDatePickers(): void {
  const today = new Date();
  const checkInDefault = new Date(today);
  checkInDefault.setDate(today.getDate() + 1);

  const checkOutDefault = new Date(today);
  checkOutDefault.setDate(today.getDate() + 4);

  const checkInInput = document.getElementById('details-checkin') as HTMLInputElement;
  const checkOutInput = document.getElementById('details-checkout') as HTMLInputElement;

  if (checkInInput && checkOutInput) {
    checkInInput.min = today.toISOString().split('T')[0];
    checkInInput.value = checkInDefault.toISOString().split('T')[0];

    checkOutInput.min = checkInDefault.toISOString().split('T')[0];
    checkOutInput.value = checkOutDefault.toISOString().split('T')[0];

    checkInInput.addEventListener('change', () => {
      const nextDay = new Date(checkInInput.value);
      nextDay.setDate(nextDay.getDate() + 1);
      checkOutInput.min = nextDay.toISOString().split('T')[0];
      if (checkOutInput.value <= checkInInput.value) {
        checkOutInput.value = nextDay.toISOString().split('T')[0];
      }
    });
  }
}

async function loadHotelDetails(hotelId: number): Promise<void> {
  try {
    currentHotel = await hotelService.getHotelById(hotelId);
    renderHotelHeader(currentHotel);
    renderRooms(currentHotel.rooms || []);
  } catch (error: any) {
    alert('Failed to load hotel details: ' + error.message);
    window.location.href = 'hotels.html';
  }
}

function renderHotelHeader(h: Hotel): void {
  document.title = `${h.name} - Hotel Reservation System`;
  (document.getElementById('hotel-name') as HTMLElement).textContent = h.name;
  (document.getElementById('hotel-location') as HTMLElement).innerHTML = `<i class="fas fa-map-marker-alt text-warning me-1"></i> ${h.address}, ${h.city}, ${h.country}`;
  (document.getElementById('hotel-rating') as HTMLElement).innerHTML = getStarRatingHtml(h.starRating);
  (document.getElementById('hotel-description') as HTMLElement).textContent = h.description;
  (document.getElementById('hotel-checkin-time') as HTMLElement).textContent = h.checkInTime;
  (document.getElementById('hotel-checkout-time') as HTMLElement).textContent = h.checkOutTime;
  (document.getElementById('hotel-contact-phone') as HTMLElement).textContent = h.phoneNumber;
  (document.getElementById('hotel-contact-email') as HTMLElement).textContent = h.email;

  const heroImg = document.getElementById('hotel-hero-image') as HTMLImageElement;
  if (heroImg) {
    heroImg.src = h.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80';
  }

  const amenitiesContainer = document.getElementById('hotel-amenities-list');
  if (amenitiesContainer && h.amenities) {
    const amenities = h.amenities.split(',').map((a) => a.trim());
    amenitiesContainer.innerHTML = amenities.map((a) => `
      <span class="amenity-pill mb-2"><i class="fas fa-check-circle text-success"></i> ${a}</span>
    `).join(' ');
  }
}

function renderRooms(rooms: Room[]): void {
  const container = document.getElementById('rooms-catalog-container');
  if (!container) return;

  if (rooms.length === 0) {
    container.innerHTML = `
      <div class="col-12 text-center py-5">
        <div class="p-4 bg-white rounded-4 border text-muted">No rooms currently available in this property.</div>
      </div>
    `;
    return;
  }

  const checkIn = (document.getElementById('details-checkin') as HTMLInputElement)?.value;
  const checkOut = (document.getElementById('details-checkout') as HTMLInputElement)?.value;
  const guests = (document.getElementById('details-guests') as HTMLSelectElement)?.value || '2';

  container.innerHTML = rooms.map((r) => `
    <div class="col-lg-6 mb-4">
      <div class="card border-0 shadow-sm rounded-4 overflow-hidden h-100 hotel-card">
        <div class="row g-0 h-100">
          <div class="col-md-5 position-relative">
            <img src="${r.imageUrl || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80'}" class="img-fluid h-100 w-100 object-fit-cover" alt="Room ${r.roomNumber}">
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
                ${r.description || 'Spacious, climate-controlled comfort with high-speed WiFi, modern en-suite bath and luxury toiletries.'}
              </p>
            </div>
            <div class="pt-2 border-top d-flex justify-content-between align-items-center">
              <div>
                <span class="fs-5 fw-bold text-navy">${formatCurrency(r.pricePerNight)}</span>
                <span class="text-muted small"> / night</span>
              </div>
              ${r.status === 'AVAILABLE' ? `
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
  `).join('');
}

function setupAvailabilityCheck(): void {
  document.getElementById('check-availability-btn')?.addEventListener('click', async () => {
    if (!currentHotel) return;
    const checkIn = (document.getElementById('details-checkin') as HTMLInputElement).value;
    const checkOut = (document.getElementById('details-checkout') as HTMLInputElement).value;
    const guests = parseInt((document.getElementById('details-guests') as HTMLSelectElement).value);

    try {
      const availableRooms = await roomService.findAvailableRooms({
        hotelId: currentHotel.id,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        guests,
      });

      renderRooms(availableRooms);
    } catch (err: any) {
      alert('Error verifying availability: ' + err.message);
    }
  });
}
