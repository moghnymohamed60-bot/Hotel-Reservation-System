// Toast notification and Modal Confirmation utilities
export class NotificationManager {
    static container = null;
    static getContainer() {
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
            this.container.style.zIndex = '9999';
            document.body.appendChild(this.container);
        }
        return this.container;
    }
    static showToast(message, type = 'info', title) {
        const container = this.getContainer();
        const id = 'toast_' + Date.now();
        const iconMap = {
            success: 'fa-check-circle',
            danger: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle',
        };
        const headerTitle = title || (type.charAt(0).toUpperCase() + type.slice(1));
        const toastHtml = `
      <div id="${id}" class="toast align-items-center text-bg-${type} border-0 shadow-lg mb-2" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body d-flex align-items-center">
            <i class="fas ${iconMap[type]} me-2 fs-5"></i>
            <div>
              <strong>${headerTitle}</strong><br>
              <span>${message}</span>
            </div>
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>
    `;
        container.insertAdjacentHTML('beforeend', toastHtml);
        const element = document.getElementById(id);
        if (element && window.bootstrap) {
            const toast = new window.bootstrap.Toast(element, { delay: 4500 });
            toast.show();
            element.addEventListener('hidden.bs.toast', () => element.remove());
        }
        else {
            setTimeout(() => element?.remove(), 4500);
        }
    }
    static success(message, title = 'Success') {
        this.showToast(message, 'success', title);
    }
    static error(message, title = 'Error') {
        this.showToast(message, 'danger', title);
    }
    static warning(message, title = 'Warning') {
        this.showToast(message, 'warning', title);
    }
    static info(message, title = 'Information') {
        this.showToast(message, 'info', title);
    }
}
