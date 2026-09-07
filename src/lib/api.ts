import axios from 'axios';
import { clientCache } from './cache';

// Self-contained Next.js serverless API routes
const API_URL = '/api/';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('akodUserToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await axios.post(`${API_URL}customers/refresh-token`, {}, { withCredentials: true });
        const { accessToken } = res.data.data;
        localStorage.setItem('akodUserToken', accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, log out the user
        localStorage.removeItem('akodUserToken');
        localStorage.removeItem('akodAuth');
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const customerApi = {
  // Auth & Identity
  register: (data: any) => api.post('customers/register', data),
  login: (data: any) => api.post('customers/login', data),
  logout: () => api.post('customers/logout'),
  refreshToken: () => api.post('customers/refresh-token'),
  sendOTP: (identity: string) => api.post('customers/send-otp', { identity }),
  verifyOTP: (identity: string, otp: string) => api.post('customers/verify-otp', { identity, otp }),
  getProfile: () => api.get('customers/profile'),
  updateProfile: (data: any) => api.put('customers/profile', data),
  changePassword: (data: any) => api.put('customers/change-password', data),
  
  // Addresses
  addAddress: (data: any) => api.post('customers/addresses', data),
  updateAddress: (id: string, data: any) => api.put(`customers/addresses/${id}`, data),
  deleteAddress: (id: string) => api.delete(`customers/addresses/${id}`),
  setDefaultAddress: (id: string) => api.patch(`customers/addresses/${id}/default`),
  
  // Public Data
  getProducts: async (params?: any) => {
    const res = await api.get('products', { params });
    if (res.data?.data && (!params || Object.keys(params).length === 0)) {
      clientCache.set('products_all', res.data.data);
    }
    return res;
  },
  getCachedProducts: () => clientCache.get<any[]>('products_all'),
  getProductById: (id: string) => api.get(`products/${id}`),
  getCategories: async () => {
    const res = await api.get('categories');
    if (res.data?.data) {
      clientCache.set('categories_all', res.data.data);
    }
    return res;
  },
  getCachedCategories: () => clientCache.get<any[]>('categories_all'),
  
  // Cart
  getCart: () => api.get('cart'),
  syncCart: (items: any[]) => api.post('cart/sync', { items }),
  clearBackendCart: () => api.delete('cart'),

  // Payments
  createPaymentOrder: (data: any) => api.post('payments/create-order', data),
  verifyPayment: (data: any) => api.post('payments/verify-payment', data),

  // Orders
  getMyOrders: () => api.get('orders/my-orders'),
  getOrderDetails: (id: string) => api.get(`orders/${id}`),
  cancelOrder: (id: string) => api.put(`orders/${id}/cancel`),

  // Reviews
  getReviews: (productId: string) => api.get(`products/${productId}/reviews`),
  createReview: (productId: string, data: any) => api.post(`products/${productId}/reviews`, data),
};

export default api;
