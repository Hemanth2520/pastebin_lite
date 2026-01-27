import express from 'express';
import { nanoid } from 'nanoid';
import Paste from '../models/Paste.js';
import { validateCreatePaste, validatePasteId } from '../middleware/validation.js';
import { getCurrentTime, isPasteAvailable } from '../utils/timeUtils.js';

const router = express.Router();

/**
 * POST /api/pastes
 * Create a new paste
 */
router.post('/pastes', validateCreatePaste, async (req, res) => {
    try {
        const { content, ttl_seconds, max_views } = req.body;

        // Generate unique ID
        const pasteId = nanoid(10);

        // Calculate expiration time if TTL is provided
        let expiresAt = null;
        if (ttl_seconds) {
            const currentTime = getCurrentTime(req);
            expiresAt = new Date(currentTime.getTime() + ttl_seconds * 1000);
        }

        // Create paste document
        const paste = new Paste({
            pasteId,
            content,
            maxViews: max_views || null,
            viewCount: 0,
            expiresAt
        });

        await paste.save();

        // Construct URL
        const baseUrl = process.env.FRONTEND_URL || req.get('origin') || 'http://localhost:5173';
        const url = `${baseUrl}/p/${pasteId}`;

        res.status(201).json({
            id: pasteId,
            url
        });
    } catch (error) {
        console.error('Error creating paste:', error);
        res.status(500).json({
            error: 'Failed to create paste'
        });
    }
});

/**
 * GET /api/pastes/:id
 * Fetch a paste by ID (API endpoint)
 */
router.get('/pastes/:id', validatePasteId, async (req, res) => {
    try {
        const { id } = req.params;
        const currentTime = getCurrentTime(req);

        // Find paste
        const paste = await Paste.findOne({ pasteId: id });

        // Check if paste exists and is available
        if (!isPasteAvailable(paste, currentTime)) {
            return res.status(404).json({
                error: 'Paste not found or no longer available'
            });
        }

        // Increment view count atomically
        const updatedPaste = await Paste.findOneAndUpdate(
            { pasteId: id },
            { $inc: { viewCount: 1 } },
            { new: true }
        );

        // Check if this view exceeded the limit
        if (updatedPaste.maxViews !== null && updatedPaste.viewCount > updatedPaste.maxViews) {
            return res.status(404).json({
                error: 'Paste not found or no longer available'
            });
        }

        // Prepare response
        const response = {
            content: updatedPaste.content,
            remaining_views: updatedPaste.maxViews !== null
                ? Math.max(0, updatedPaste.maxViews - updatedPaste.viewCount)
                : null,
            expires_at: updatedPaste.expiresAt ? updatedPaste.expiresAt.toISOString() : null
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching paste:', error);
        res.status(500).json({
            error: 'Failed to fetch paste'
        });
    }
});

export default router;
