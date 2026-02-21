import axios from 'axios';

/**
 * Configure global axios instance with the base URL for our backend API.
 * The URL is pulled from environment variables or defaults to localhost.
 */
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
});

/**
 * Service object containing all API calls for the booking system.
 * This keeps our frontend components clean and decoupled from the exact URL structures.
 */
export const bookingService = {
    // Fetch all bookings (with optional pagination and search)
    getAllBookings: (page = 1, searchQuery = '') =>
        api.get(`/bookings?page=${page}&search=${searchQuery}`),

    // Submit a new booking form
    createNewBooking: (bookingData) =>
        api.post('/bookings', bookingData),

    // Cancel/Remove a specific booking
    cancelBooking: (bookingId) =>
        api.delete(`/bookings/${bookingId}`),

    // Get dashboard statistics (total, today, upcoming)
    getDashboardStatistics: () =>
        api.get('/bookings/stats'),

    // Retrieve a list of occupied time slots for a specific date
    getOccupiedSlots: (selectedDate) =>
        api.get(`/bookings/booked-slots/${selectedDate}`),
};

export default api;

