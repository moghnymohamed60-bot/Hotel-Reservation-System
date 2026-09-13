import { hotelService } from '../services/hotelService';
import { setupNavigation } from '../utils/authGuard';
import { formatCurrency, getStarRatingHtml } from '../utils/formatters';

document.addEventListener('DOMContentLoaded', async () => {
  setupNavigation();
  initSearchForm();
  await loadFeaturedHotels();
  await populateCityOptions();
});

function initSearchForm(): void {
  const form = document.getElementById('hero-search-form') as HTMLFormElement;
  if (!form) return;

  // Set default dates (tomorrow and +3 days)
  const today = new Date();
  const checkInDefault = new Date(today);
  checkInDefault.setDate(today.getDate() + 1);

  const checkOutDefault = new Date(today);
  checkOutDefault.setDate(today.getDate() + 4);

  const checkInInput = document.getElementById('search-checkin') as HTMLInputElement;
  const checkOutInput = document.getElementById('search-checkout') as HTMLInputElement;

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

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const city = (document.getElementById('search-city') as HTMLSelectElement)?.value || '';
    const checkIn = checkInInput?.value || '';
    const checkOut = checkOutInput?.value || '';
    const guests = (document.getElementById('search-guests') as HTMLSelectElement)?.value || '2';

    const params = new URLSearchParams();
    if (city) params.set('city', city);
    if (checkIn) params.set('checkInDate', checkIn);
    if (checkOut) params.set('checkOutDate', checkOut);
    if (guests) params.set('guests', guests);

    window.location.href = `hotels.html?${params.toString()}`;
  });
}

async function populateCityOptions(): Promise<void> {
  const citySelect = document.getElementById('search-city') as HTMLSelectElement;
  if (!citySelect) return;

  try {
    const cities = await hotelService.getCities();
    cities.forEach((city) => {
      const option = document.createElement('option');
      option.value = city;
      option.textContent = city;
      citySelect.appendChild(option);
    });
  } catch (err) {
    console.warn('Could not load distinct cities', err);
  }
}

async function loadFeaturedHotels(): Promise<void> {
  const container = document.getElementById('featured-hotels-grid');
  if (!container) return;

  try {
    const pageData = await hotelService.getHotels({ size: 6, sortBy: 'starRating', sortDir: 'desc' });
    const hotels = pageData.content || [];

    if (hotels.length === 0) {
      container.innerHTML = `<div class="col-12 text-center py-5 text-muted">No hotels currently available.</div>`;
      return;
    }

    container.innerHTML = hotels.map((h) => `
      <div class="col-lg-4 col-md-6 mb-4">
        <div class="hotel-card">
          <div class="hotel-img-wrapper">
            <img src="${h.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'}" alt="${h.name}">
            <div class="hotel-card-badge">
              <i class="fas fa-map-marker-alt text-warning me-1"></i> ${h.city}, ${h.country}
            </div>
            ${h.minPrice ? `<div class="hotel-card-price-badge">From ${formatCurrency(h.minPrice)}<span class="text-muted fw-normal fs-xs">/night</span></div>` : ''}
          </div>
          <div class="p-4 d-flex flex-column flex-grow-1 justify-content-between">
            <div>
              <div class="d-flex justify-content-between align-items-center mb-2">
                <div class="rating-stars">${getStarRatingHtml(h.starRating)}</div>
                <span class="badge bg-light text-secondary border">${h.totalRooms || 0} Rooms</span>
              </div>
              <h4 class="card-title text-truncate mb-2" title="${h.name}">${h.name}</h4>
              <p class="text-muted small mb-3 text-truncate-2" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                ${h.description}
              </p>
            </div>
            <div class="pt-3 border-top d-flex justify-content-between align-items-center">
              <span class="small text-muted"><i class="fas fa-concierge-bell me-1"></i> Check-in ${h.checkInTime}</span>
              <a href="hotel-details.html?id=${h.id}" class="btn btn-gold btn-sm px-3 rounded-pill">View Stay</a>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  } catch (err) {
    container.innerHTML = `<div class="col-12 text-center text-danger py-4">Failed to load featured properties. Please ensure the backend server is running.</div>`;
  }
}
