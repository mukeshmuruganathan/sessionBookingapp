import Booking from '../models/reservationModel.js';
import asyncHandler from '../utils/asyncHandler.js';
import { validationResult } from 'express-validator';

/**
 * @desc    Create a new booking/reservation
 * @route   POST /api/bookings
 * @access  Public
 */
export const createBooking = asyncHandler(async (req, res) => {
    // Check for input validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { date, time, fullName, email, phone } = req.body;

    // Prevent double-booking the same slot
    const existingSlot = await Booking.findOne({ date, time });
    if (existingSlot) {
        return res.status(400).json({ message: 'This time slot has already been reserved. Please pick another one.' });
    }

    // Save the booking to the database
    const newBooking = await Booking.create({
        fullName,
        email,
        phone,
        date,
        time
    });

    res.status(201).json(newBooking);
});

/**
 * @desc    Get all bookings with search and pagination (Admin use)
 * @route   GET /api/bookings
 * @access  Private (Admin)
 */
export const getBookings = asyncHandler(async (req, res) => {
    const pageNumber = Number(req.query.page) || 1;
    const pageSize = Number(req.query.limit) || 10;
    const searchTerm = req.query.search || '';

    // Filter by name or email if search term is provided
    const searchFilter = {
        $or: [
            { fullName: { $regex: searchTerm, $options: 'i' } },
            { email: { $regex: searchTerm, $options: 'i' } }
        ]
    };

    const totalCount = await Booking.countDocuments(searchFilter);
    const bookingsList = await Booking.find(searchFilter)
        .sort({ date: 1, time: 1 }) // Order by soonest first
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize);

    res.json({
        bookings: bookingsList,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalCount / pageSize),
        totalItems: totalCount
    });
});

/**
 * @desc    Remove/Cancel a booking
 * @route   DELETE /api/bookings/:id
 * @access  Private (Admin)
 */
export const deleteBooking = asyncHandler(async (req, res) => {
    const bookingToCancel = await Booking.findById(req.params.id);

    if (!bookingToCancel) {
        return res.status(404).json({ message: 'Reservation not found. It might have already been deleted.' });
    }

    await bookingToCancel.deleteOne();
    res.json({ message: 'The booking has been successfully removed.' });
});

/**
 * @desc    Get simple statistics for the dashboard
 * @route   GET /api/bookings/stats
 * @access  Private (Admin)
 */
export const getStats = asyncHandler(async (req, res) => {
    const todayISO = new Date().toISOString().split('T')[0];

    const [totalBookings, todayBookings, upcomingBookings] = await Promise.all([
        Booking.countDocuments(),
        Booking.countDocuments({ date: todayISO }),
        Booking.countDocuments({ date: { $gt: todayISO } })
    ]);

    res.json({
        total: totalBookings,
        today: todayBookings,
        upcoming: upcomingBookings
    });
});

/**
 * @desc    Get list of already booked times for a specific date
 * @route   GET /api/bookings/slots/:date
 * @access  Public
 */
export const getBookedSlots = asyncHandler(async (req, res) => {
    const specificDateBookings = await Booking.find({ date: req.params.date }).select('time');
    const occupiedTimes = specificDateBookings.map(entry => entry.time);

    res.json(occupiedTimes);
});

