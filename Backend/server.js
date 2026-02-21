import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import bookingRoutes from './routes/reservation.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Initialize the application
const app = express();
const PORT = process.env.PORT || 4000;

// Connect to MongoDB Atlas
connectDB();

// Global Middlewares
app.use(cors());
app.use(express.json()); // Parse incoming JSON requests

// API Routes
app.use('/api/bookings', bookingRoutes);

// Base Route for health check
app.get('/', (req, res) => {
    res.status(200).send('Booking System API is running smoothly.');
});

// Error Handling Middleware
app.use(notFound);      // Handle 404s
app.use(errorHandler);  // Handle internal server errors

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server is live on port ${PORT}`);
});
