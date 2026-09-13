import { ApiService } from './apiService';
export const authService = {
    async register(data) {
        const res = await ApiService.post('/auth/register', data);
        ApiService.setToken(res.token);
        ApiService.setUser(res.user);
        return res;
    },
    async login(data) {
        const res = await ApiService.post('/auth/login', data);
        ApiService.setToken(res.token);
        ApiService.setUser(res.user);
        return res;
    },
    async getCurrentUser() {
        const user = await ApiService.get('/auth/me');
        ApiService.setUser(user);
        return user;
    },
    logout() {
        ApiService.clearSession();
        window.location.href = 'login.html';
    },
    getCurrentStoredUser() {
        return ApiService.getUser();
    },
    isLoggedIn() {
        return ApiService.isAuthenticated();
    },
    isAdmin() {
        const user = this.getCurrentStoredUser();
        return user?.role === 'ADMIN';
    },
    isStaffOrAdmin() {
        const user = this.getCurrentStoredUser();
        return user?.role === 'ADMIN' || user?.role === 'STAFF';
    },
};
