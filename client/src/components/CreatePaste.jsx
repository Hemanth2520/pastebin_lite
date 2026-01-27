import { useState } from 'react';
import { createPaste } from '../services/api';
import './CreatePaste.css';

const CreatePaste = () => {
    const [content, setContent] = useState('');
    const [ttlSeconds, setTtlSeconds] = useState('');
    const [maxViews, setMaxViews] = useState('');
    const [useTtl, setUseTtl] = useState(false);
    const [useMaxViews, setUseMaxViews] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(null);
        setLoading(true);

        try {
            // Validate content
            if (!content.trim()) {
                throw new Error('Content cannot be empty');
            }

            // Build paste data
            const pasteData = {
                content: content.trim(),
            };

            if (useTtl && ttlSeconds) {
                const ttl = parseInt(ttlSeconds, 10);
                if (isNaN(ttl) || ttl < 1) {
                    throw new Error('TTL must be a positive integer');
                }
                pasteData.ttl_seconds = ttl;
            }

            if (useMaxViews && maxViews) {
                const views = parseInt(maxViews, 10);
                if (isNaN(views) || views < 1) {
                    throw new Error('Max views must be a positive integer');
                }
                pasteData.max_views = views;
            }

            // Create paste
            const result = await createPaste(pasteData);
            setSuccess(result);

            // Reset form
            setContent('');
            setTtlSeconds('');
            setMaxViews('');
            setUseTtl(false);
            setUseMaxViews(false);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (success?.url) {
            navigator.clipboard.writeText(success.url);
            alert('Link copied to clipboard!');
        }
    };

    const createAnother = () => {
        setSuccess(null);
        setError('');
    };

    if (success) {
        return (
            <div className="create-paste-container fade-in">
                <div className="card success-card">
                    <div className="card-header">
                        <h2>✓ Paste Created Successfully!</h2>
                    </div>
                    <div className="card-body">
                        <div className="alert alert-success">
                            Your paste has been created and is ready to share.
                        </div>

                        <div className="form-group">
                            <label className="form-label">Shareable Link</label>
                            <div className="link-display">
                                <input
                                    type="text"
                                    value={success.url}
                                    readOnly
                                    onClick={(e) => e.target.select()}
                                />
                                <button className="btn btn-primary btn-sm" onClick={copyToClipboard}>
                                    📋 Copy
                                </button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Paste ID</label>
                            <div className="code-block">{success.id}</div>
                        </div>

                        <div className="button-group">
                            <a href={success.url} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
                                🔗 View Paste
                            </a>
                            <button className="btn btn-secondary" onClick={createAnother}>
                                ➕ Create Another
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="create-paste-container fade-in">
            <div className="card">
                <div className="card-header">
                    <h1>📋 Create New Paste</h1>
                    <p className="subtitle">Share text snippets with optional expiry and view limits</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="card-body">
                        {error && (
                            <div className="alert alert-error">
                                {error}
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="content" className="form-label">
                                Paste Content *
                            </label>
                            <textarea
                                id="content"
                                className="form-textarea"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Enter your text here..."
                                required
                                autoFocus
                            />
                            <span className="form-hint">
                                Enter the text you want to share
                            </span>
                        </div>

                        <div className="options-section">
                            <h3>⚙️ Optional Settings</h3>

                            <div className="checkbox-wrapper">
                                <input
                                    type="checkbox"
                                    id="useTtl"
                                    className="checkbox-input"
                                    checked={useTtl}
                                    onChange={(e) => setUseTtl(e.target.checked)}
                                />
                                <label htmlFor="useTtl" className="checkbox-label">
                                    Set expiration time
                                </label>
                            </div>

                            {useTtl && (
                                <div className="form-group nested-option">
                                    <label htmlFor="ttlSeconds" className="form-label">
                                        Time to Live (seconds)
                                    </label>
                                    <input
                                        type="number"
                                        id="ttlSeconds"
                                        className="form-input"
                                        value={ttlSeconds}
                                        onChange={(e) => setTtlSeconds(e.target.value)}
                                        placeholder="e.g., 3600 (1 hour)"
                                        min="1"
                                    />
                                    <span className="form-hint">
                                        Paste will expire after this many seconds (e.g., 60 = 1 minute, 3600 = 1 hour)
                                    </span>
                                </div>
                            )}

                            <div className="checkbox-wrapper">
                                <input
                                    type="checkbox"
                                    id="useMaxViews"
                                    className="checkbox-input"
                                    checked={useMaxViews}
                                    onChange={(e) => setUseMaxViews(e.target.checked)}
                                />
                                <label htmlFor="useMaxViews" className="checkbox-label">
                                    Set view limit
                                </label>
                            </div>

                            {useMaxViews && (
                                <div className="form-group nested-option">
                                    <label htmlFor="maxViews" className="form-label">
                                        Maximum Views
                                    </label>
                                    <input
                                        type="number"
                                        id="maxViews"
                                        className="form-input"
                                        value={maxViews}
                                        onChange={(e) => setMaxViews(e.target.value)}
                                        placeholder="e.g., 5"
                                        min="1"
                                    />
                                    <span className="form-hint">
                                        Paste will become unavailable after this many views
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="card-footer">
                        <button
                            type="submit"
                            className="btn btn-primary btn-lg"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner"></span>
                                    Creating...
                                </>
                            ) : (
                                <>
                                    🚀 Create Paste
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            <div className="info-cards">
                <div className="info-card">
                    <div className="info-icon">⏱️</div>
                    <h3>Time-Based Expiry</h3>
                    <p>Set an expiration time for your paste. It will automatically become unavailable after the specified duration.</p>
                </div>
                <div className="info-card">
                    <div className="info-icon">👁️</div>
                    <h3>View Limits</h3>
                    <p>Limit how many times your paste can be viewed. Perfect for one-time secrets or limited sharing.</p>
                </div>
                <div className="info-card">
                    <div className="info-icon">🔒</div>
                    <h3>Secure & Simple</h3>
                    <p>Your pastes are stored securely and can be shared with a simple link. No account required.</p>
                </div>
            </div>
        </div>
    );
};

export default CreatePaste;
