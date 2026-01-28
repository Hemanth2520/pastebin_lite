const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

/**
 * Create a new paste
 */
export const createPaste = async (pasteData) => {
    const response = await fetch(`${API_URL}/api/pastes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(pasteData),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create paste');
    }

    return response.json();
};

/**
 * Get a paste by ID
 */
export const getPaste = async (id) => {
    const response = await fetch(`${API_URL}/api/pastes/${id}`);

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch paste');
    }

    return response.json();
};

/**
 * Check API health
 */
export const checkHealth = async () => {
    const response = await fetch(`${API_URL}/api/healthz`);
    return response.json();
};
