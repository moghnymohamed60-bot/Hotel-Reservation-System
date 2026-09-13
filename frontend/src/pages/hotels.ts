import { hotelService } from '../services/hotelService';
import { setupNavigation } from '../utils/authGuard';
import { formatCurrency, getStarRatingHtml } from '../utils/formatters';

let currentPage = 0;
const pageSize = 9;

document.addEventListener('DOMContentLoaded', async () => {
  setupNavigation();
  initFiltersFromUrl();
  setupFilterListeners();
  await loadHotels();
  await populateCityFilter();
});

function initFiltersFromUrl(): void {
  const urlParams = new URLSearchParams(window.location.search);
  const city = urlParams.get('city');
  const starRating = urlParams.get('starRating');
  const minPrice = urlParams.get('minPrice');
  const maxPrice = urlParams.get('maxPrice');
  const name = urlParams.get('name');

  if (city) (document.getElementById('filter-city') as HTMLSelectElement).value = city;
  if (starRating) (document.getElementById('filter-rating') as HTMLSelectElement).value = starRating;
  if (minPrice) (document.getElementById('filter-min-price') as HTMLInputElement).value = minPrice;
  if (maxPrice) (document.getElementById('filter-max-price') as HTMLInputElement).value = maxPrice;
  if (name) (document.getElementById('filter-search-name') as HTMLInputElement).value = name;
}

function setupFilterListeners(): void {
  document.getElementById('filter-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    currentPage = 0;
    loadHotels();
  });

  document.getElementById('filter-reset-btn')?.addEventListener('click', () => {
    (document.getElementById('filter-form') as HTMLFormElement).reset();
    currentPage = 0;
    loadHotels();
  });

  document.getElementById('sort-by-select')?.addEventListener('change', () => {
    currentPage = 0;
    loadHotels();
  });
}

async function populateCityFilter(): Promise<void> {
  const select = document.getElementById('filter-city') as HTMLSelectElement;
  if (!select) return;

  try {
    const cities = await hotelService.getCities();
    cities.forEach((city) => {
      const option = document.createElement('option');
      option.value = city;
      option.textContent = city;
      select.appendChild(option);
    });
  } catch (e) {
    console.error('Error fetching cities', e);
  }
}

async function loadHotels(): Promise<void> {
  const grid = document.getElementById('hotels-grid');
  const paginationContainer = document.getElementById('hotels-pagination');
  const resultCount = document.getElementById('hotels-result-count');
  if (!grid) return;

  grid.innerHTML = `<div class="col-12 text-center py-5"><div class="spinner-border text-warning" role="status"></div></div>`;

  const city = (document.getElementById('filter-city') as HTMLSelectElement)?.value || undefined;
  const starRating = (document.getElementById('filter-rating') as HTMLSelectElement)?.value ?
    parseInt((document.getElementById('filter-rating') as HTMLSelectElement).value) : undefined;
  const minPrice = (document.getElementById('filter-min-price') as HTMLInputElement)?.value ?
    parseFloat((document.getElementById('filter-min-price') as HTMLInputElement).value) : undefined;
  const maxPrice = (document.getElementById('filter-max-price') as HTMLInputElement)?.value ?
    parseFloat((document.getElementById('filter-max-price') as HTMLInputElement).value) : undefined;
  const name = (document.getElementById('filter-search-name') as HTMLInputElement)?.value || undefined;

  const sortVal = (document.getElementById('sort-by-select') as HTMLSelectElement)?.value || 'id-asc';
  const [sortBy, sortDir] = sortVal.split('-');

  try {
    const pageData = await hotelService.getHotels({
      city,
      name,
      starRating,
      minPrice,
      maxPrice,
      page: currentPage,
      size: pageSize,
      sortBy,
      sortDir,
    });

    const hotels = pageData.content || [];
    if (resultCount) {
      resultCount.textContent = `Found ${pageData.totalElements} properties`;
    }

    if (hotels.length === 0) {
      grid.innerHTML = `
        <div class="col-12 text-center py-5">
          <div class="p-5 bg-white rounded-4 border">
            <i class="fas fa-search fs-1 text-muted mb-3"></i>
            <h4>No properties found</h4>
            <p class="text-muted">Try adjusting your filters or destination criteria.</p>
          </div>
        </div>
      `;
      if (paginationContainer) paginationContainer.innerHTML = '';
      return;
    }

    grid.innerHTML = hotels.map((h) => `
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
                <div>${getStarRatingHtml(h.starRating)}</div>
                <span class="badge bg-light text-secondary border">${h.totalRooms || 0} Rooms</span>
              </div>
              <h4 class="card-title text-truncate mb-2" title="${h.name}">${h.name}</h4>
              <p class="text-muted small mb-3" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                ${h.description}
              </p>
            </div>
            <div class="pt-3 border-top d-flex justify-content-between align-items-center">
              <span class="small text-muted"><i class="fas fa-phone-alt me-1"></i> ${h.phoneNumber}</span>
              <a href="hotel-details.html?id=${h.id}" class="btn btn-gold btn-sm px-3 rounded-pill">View Rooms</a>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    renderPagination(pageData.totalPages, paginationContainer);
  } catch (err: any) {
    grid.innerHTML = `<div class="col-12 text-center text-danger py-4">Error loading properties: ${err.message}</div>`;
  }
}

function renderPagination(totalPages: number, container: HTMLElement | null): void {
  if (!container) return;
  if (totalPages <= 1) {
    container.innerHTML = '';
    return;
  }

  let html = `<ul class="pagination justify-content-center">`;
  html += `
    <li class="page-item ${currentPage === 0 ? 'disabled' : ''}">
      <button class="page-link" onclick="window.changePage(${currentPage - 1})">Previous</button>
    </li>
  `;

  for (let i = 0; i < totalPages; i++) {
    html += `
      <li class="page-item ${currentPage === i ? 'active' : ''}">
        <button class="page-link" onclick="window.changePage(${i})">${i + 1}</button>
      </li>
    `;
  }

  html += `
    <li class="page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}">
      <button class="page-link" onclick="window.changePage(${currentPage + 1})">Next</button>
    </li>
  `;
  html += `</ul>`;
  container.innerHTML = html;
}

(window as any).changePage = (page: number) => {
  currentPage = page;
  loadHotels();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
