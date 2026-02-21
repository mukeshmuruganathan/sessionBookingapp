import mongoose from 'mongoose';

/**
 * Mongoose Schema for Session Bookings
 * Stores client details, appointment date/time, and current status.
 */
const bookingSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Please provide a full name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email address is required'],
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: [true, 'Contact phone number is required'],
        trim: true
    },
    date: {
        type: String, // Stored as YYYY-MM-DD
        required: [true, 'Appointment date is required']
    },
    time: {
        type: String, // Stored as HH:MM
        required: [true, 'Time slot selection is required']
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Cancelled'],
        default: 'Confirmed' // Defaulting to Confirmed for simple use cases
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Optimization: Index date and time for faster lookups and to enforce uniqueness
// This ensures no two clients can book the exact same slot.
bookingSchema.index({ date: 1, time: 1 }, { unique: true });

export default mongoose.model('Booking', bookingSchema);
