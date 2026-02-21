import express from 'express';
import { body } from 'express-validator';
import {
    createBooking,
    getBookings,
    getStats,
    getBookedSlots,
    deleteBooking
} from '../controllers/ReservationControllers.js';

const router = express.Router();

// Validation middleware for creating a booking
const bookingValidationRules = [
    body('fullName').notEmpty().withMessage('Full name is required').trim(),
    body('email').isEmail().withMessage('Please provide a valid email address'),
    body('phone').notEmpty().withMessage('Phone number is required'),
    body('date').notEmpty().withMessage('Booking date is required'),
    body('time').notEmpty().withMessage('Preferred time slot is required'),
];

// --- Public Routes ---
// Retrieve occupied slots for a specific date
router.get('/booked-slots/:date', getBookedSlots);

// Create a new reservation
router.post('/', bookingValidationRules, createBooking);

// --- Administrative Routes ---
// Get list of all bookings (paginated/searchable)
router.get('/', getBookings);

// Get summary statistics
router.get('/stats', getStats);

// Delete/Cancel a reservation by ID
router.delete('/:id', deleteBooking);

export default router;
