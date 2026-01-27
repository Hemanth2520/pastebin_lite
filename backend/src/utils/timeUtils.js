/**
 * Get the current time for expiry logic
 * Supports deterministic time for testing via x-test-now-ms header
 */
export const getCurrentTime = (req) => {
    const testMode = process.env.TEST_MODE === '1';

    if (testMode && req.headers['x-test-now-ms']) {
        const testTime = parseInt(req.headers['x-test-now-ms'], 10);
        if (!isNaN(testTime)) {
            return new Date(testTime);
        }
    }

    return new Date();
};

/**
 * Check if a paste has expired based on current time
 */
export const isPasteExpired = (paste, currentTime) => {
    if (!paste.expiresAt) {
        return false;
    }
    return currentTime >= paste.expiresAt;
};

/**
 * Check if a paste has exceeded view limit
 */
export const isPasteViewLimitExceeded = (paste) => {
    if (paste.maxViews === null || paste.maxViews === undefined) {
        return false;
    }
    return paste.viewCount >= paste.maxViews;
};

/**
 * Check if a paste is available
 */
export const isPasteAvailable = (paste, currentTime) => {
    if (!paste) {
        return false;
    }

    if (isPasteExpired(paste, currentTime)) {
        return false;
    }

    if (isPasteViewLimitExceeded(paste)) {
        return false;
    }

    return true;
};
