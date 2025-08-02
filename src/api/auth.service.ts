import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface LoginResponse {
    access_token: string;
}

export const AuthService = {
    async register(username: string, email: string, password: string): Promise<any> {
        const response = await axios.post(`${API_BASE_URL}/auth/register`, { username, email, password });
        return response.data;
    },

    async login(username: string, password: string): Promise<LoginResponse> {
        const response = await axios.post<LoginResponse>(`${API_BASE_URL}/auth/login`, { username, password });
        return response.data;
    },

    setToken(token: string): void {
        if (typeof window !== 'undefined') {
            localStorage.setItem('access_token', token);
        }
    },

    getToken(): string | null {
        return typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    },

    removeToken(): void {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('access_token');
        }
    },

    isAuthenticated(): boolean {
        return !!this.getToken();
    },
};