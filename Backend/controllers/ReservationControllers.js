import Booking from '../models/reservationModel.js';
import asyncHandler from '../utils/asyncHandler.js';
import { validationResult } from 'express-validator';

export const createBooking = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { date, time } = req.body;

    const exists = await Booking.findOne({ date, time });
    if (exists) {
        return res.status(400).json({ message: 'This slot is already booked.' });
    }

    const booking = await Booking.create(req.body);
    res.status(201).json(booking);
});

export const getBookings = asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search || '';

    const filter = {
        $or: [
            { fullName: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
        ]
    };

    const total = await Booking.countDocuments(filter);
    const bookings = await Booking.find(filter)
        .sort({ date: 1, time: 1 })
        .skip((page - 1) * limit)
        .limit(limit);

    res.json({
        bookings,
        page,
        pages: Math.ceil(total / limit),
        total
    });
});

export const deleteBooking = asyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
    }

    await booking.deleteOne();
    res.json({ message: 'Booking removed' });
});

export const getStats = asyncHandler(async (req, res) => {
    const today = new Date().toISOString().split('T')[0];

    const stats = await Promise.all([
        Booking.countDocuments(),
        Booking.countDocuments({ date: today }),
        Booking.countDocuments({ date: { $gt: today } })
    ]);

    res.json({
        total: stats[0],
        today: stats[1],
        upcoming: stats[2]
    });
});

export const getBookedSlots = asyncHandler(async (req, res) => {
    const bookings = await Booking.find({ date: req.params.date }).select('time');
    res.json(bookings.map(b => b.time));
});
