import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
});

export const bookingService = {
    get: (page, search) => api.get(`/bookings?page=${page}&search=${search}`),
    create: (data) => api.post('/bookings', data),
    delete: (id) => api.delete(`/bookings/${id}`),
    getStats: () => api.get('/bookings/stats'),
    getSlots: (date) => api.get(`/bookings/booked-slots/${date}`),
};

export default api;
