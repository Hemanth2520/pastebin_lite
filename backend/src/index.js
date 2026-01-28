import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import healthRoutes from './routes/health.js';
import pasteRoutes from './routes/pastes.js';
import viewRoutes from './routes/view.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB().catch(err => {
    console.error('Failed to connect to MongoDB:', err);
});

// CORS configuration
const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);

        // In development, allow all localhost origins
        if (process.env.NODE_ENV === 'development') {
            if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
                return callback(null, true);
            }
        }

        // Allowed origins
        const allowedOrigins = [
            'https://pastebin-lite-uj26.vercel.app', // Explicitly allow frontend
            'http://localhost:5173', // Allow local dev
            'http://localhost:5174', // Allow local dev alternate
            'http://localhost:3000', // Allow local dev alternate
            ...(process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : [])
        ];

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        // Fallback: allow if FRONTEND_URL is not set (for initial setup)
        if (!process.env.FRONTEND_URL) {
            return callback(null, true);
        }

        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Routes
app.use('/api', healthRoutes);
app.use('/api', pasteRoutes);
app.use('/', viewRoutes);

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'Pastebin-Lite API',
        version: '1.0.0',
        endpoints: {
            health: 'GET /api/healthz',
            createPaste: 'POST /api/pastes',
            getPaste: 'GET /api/pastes/:id',
            viewPaste: 'GET /p/:id'
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Route not found'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        error: 'Internal server error'
    });
});

// Start server (only in non-serverless environment)
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production' || process.env.RENDER) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// Export for Vercel serverless
export default app;
