// Base HTTP API Service with JWT Bearer Token interceptor
export class ApiService {
    static BASE_URL = 'http://localhost:8080/api';
    static TOKEN_KEY = 'hotel_app_jwt';
    static USER_KEY = 'hotel_app_user';
    static getToken() {
        return localStorage.getItem(this.TOKEN_KEY);
    }
    static setToken(token) {
        localStorage.setItem(this.TOKEN_KEY, token);
    }
    static getUser() {
        const raw = localStorage.getItem(this.USER_KEY);
        return raw ? JSON.parse(raw) : null;
    }
    static setUser(user) {
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
    static clearSession() {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
    }
    static isAuthenticated() {
        return !!this.getToken();
    }
    static async request(endpoint, options = {}) {
        const url = `${this.BASE_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
        const token = this.getToken();
        const headers = {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            ...(options.headers || {}),
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        try {
            const response = await fetch(url, {
                ...options,
                headers,
            });
            if (response.status === 401) {
                // Session expired or invalid token
                const currentPath = window.location.pathname;
                if (!currentPath.includes('login.html') && !currentPath.includes('register.html')) {
                    this.clearSession();
                    window.location.href = 'login.html?expired=true';
                }
            }
            const json = await response.json();
            if (!response.ok) {
                let errorMessage = json.message || 'An error occurred during request';
                if (json.validationErrors) {
                    const details = Object.entries(json.validationErrors)
                        .map(([k, v]) => `${k}: ${v}`)
                        .join('\n');
                    errorMessage += `\n${details}`;
                }
                throw new Error(errorMessage);
            }
            // If backend wrapped response inside ApiResponse { success: true, data: ... }
            if (json && typeof json === 'object' && 'data' in json && 'success' in json) {
                return json.data;
            }
            return json;
        }
        catch (error) {
            console.error(`API Request Error [${endpoint}]:`, error);
            throw error;
        }
    }
    static get(endpoint, params) {
        let url = endpoint;
        if (params) {
            const searchParams = new URLSearchParams();
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    searchParams.append(key, String(value));
                }
            });
            const queryString = searchParams.toString();
            if (queryString) {
                url += (url.includes('?') ? '&' : '?') + queryString;
            }
        }
        return this.request(url, { method: 'GET' });
    }
    static post(endpoint, body) {
        return this.request(endpoint, {
            method: 'POST',
            body: body ? JSON.stringify(body) : undefined,
        });
    }
    static put(endpoint, body) {
        return this.request(endpoint, {
            method: 'PUT',
            body: body ? JSON.stringify(body) : undefined,
        });
    }
    static patch(endpoint, body, params) {
        let url = endpoint;
        if (params) {
            const searchParams = new URLSearchParams();
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    searchParams.append(key, String(value));
                }
            });
            const queryString = searchParams.toString();
            if (queryString) {
                url += (url.includes('?') ? '&' : '?') + queryString;
            }
        }
        return this.request(url, {
            method: 'PATCH',
            body: body ? JSON.stringify(body) : undefined,
        });
    }
    static delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }
}
