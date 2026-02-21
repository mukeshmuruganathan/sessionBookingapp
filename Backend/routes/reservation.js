import express from 'express';
import { body } from 'express-validator';
import * as bookings from '../controllers/ReservationControllers.js';

const router = express.Router();

const validate = [
    body('fullName').notEmpty().withMessage('Name is required').trim(),
    body('email').isEmail().withMessage('Valid email required'),
    body('phone').notEmpty().withMessage('Phone is required'),
    body('date').notEmpty().withMessage('Date is required'),
    body('time').notEmpty().withMessage('Time is required'),
];

router.get('/', bookings.getBookings);
router.post('/', validate, bookings.createBooking);
router.get('/stats', bookings.getStats);
router.get('/booked-slots/:date', bookings.getBookedSlots);
router.delete('/:id', bookings.deleteBooking);

export default router;