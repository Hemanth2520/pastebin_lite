import { body, param, validationResult } from 'express-validator';

/**
 * Validation middleware for creating a paste
 */
export const validateCreatePaste = [
    body('content')
        .trim()
        .notEmpty()
        .withMessage('content is required and must be a non-empty string')
        .isString()
        .withMessage('content must be a string'),

    body('ttl_seconds')
        .optional()
        .isInt({ min: 1 })
        .withMessage('ttl_seconds must be an integer >= 1'),

    body('max_views')
        .optional()
        .isInt({ min: 1 })
        .withMessage('max_views must be an integer >= 1'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Invalid input',
                details: errors.array().map(err => err.msg)
            });
        }
        next();
    }
];

/**
 * Validation middleware for paste ID parameter
 */
export const validatePasteId = [
    param('id')
        .trim()
        .notEmpty()
        .withMessage('Paste ID is required'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Invalid paste ID'
            });
        }
        next();
    }
];
