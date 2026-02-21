import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import bookingRoutes from './routes/reservation.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const app = express();
const port = process.env.PORT || 4000;

// Init DB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Main Routes
app.use('/api/bookings', bookingRoutes);

app.get('/', (req, res) => res.send('Booking API is live'));

// Error handling
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));