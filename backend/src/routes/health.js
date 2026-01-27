import express from 'express';
import { checkDBConnection } from '../config/db.js';

const router = express.Router();

/**
 * GET /api/healthz
 * Health check endpoint
 */
router.get('/healthz', async (req, res) => {
    try {
        const dbConnected = checkDBConnection();

        const healthStatus = {
            ok: dbConnected,
            timestamp: new Date().toISOString(),
            database: dbConnected ? 'connected' : 'disconnected'
        };

        const statusCode = dbConnected ? 200 : 503;

        res.status(statusCode).json(healthStatus);
    } catch (error) {
        res.status(503).json({
            ok: false,
            error: 'Health check failed'
        });
    }
});

export default router;
