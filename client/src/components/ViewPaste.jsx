import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPaste } from '../services/api';
import './ViewPaste.css';

const ViewPaste = () => {
    const { id } = useParams();
    const [paste, setPaste] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPaste = async () => {
            try {
                setLoading(true);
                const data = await getPaste(id);
                setPaste(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPaste();
    }, [id]);

    const copyToClipboard = () => {
        if (paste?.content) {
            navigator.clipboard.writeText(paste.content);
            alert('Content copied to clipboard!');
        }
    };

    if (loading) {
        return (
            <div className="view-paste-container">
                <div className="loading-state">
                    <div className="spinner spinner-lg"></div>
                    <p>Loading paste...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="view-paste-container fade-in">
                <div className="card error-card">
                    <div className="card-body text-center">
                        <div className="error-icon">❌</div>
                        <h2>Paste Not Found</h2>
                        <p className="error-message">{error}</p>
                        <p className="error-hint">
                            This paste may have expired, reached its view limit, or never existed.
                        </p>
                        <Link to="/" className="btn btn-primary btn-lg">
                            ➕ Create New Paste
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="view-paste-container fade-in">
            <div className="card">
                <div className="card-header">
                    <h1>📋 Paste View</h1>
                    <div className="metadata">
                        <div className="metadata-item">
                            <span className="metadata-label">ID:</span>
                            <span className="metadata-value">{id}</span>
                        </div>
                        {paste.remaining_views !== null && (
                            <div className="metadata-item">
                                <span className="metadata-label">Remaining Views:</span>
                                <span className="badge badge-primary">{paste.remaining_views}</span>
                            </div>
                        )}
                        {paste.expires_at && (
                            <div className="metadata-item">
                                <span className="metadata-label">Expires:</span>
                                <span className="metadata-value">
                                    {new Date(paste.expires_at).toLocaleString()}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="card-body">
                    {paste.remaining_views !== null && paste.remaining_views <= 3 && (
                        <div className="alert alert-warning">
                            ⚠️ Warning: Only {paste.remaining_views} view{paste.remaining_views !== 1 ? 's' : ''} remaining!
                        </div>
                    )}

                    {paste.expires_at && new Date(paste.expires_at) - new Date() < 3600000 && (
                        <div className="alert alert-warning">
                            ⚠️ Warning: This paste will expire soon!
                        </div>
                    )}

                    <div className="paste-content-wrapper">
                        <div className="paste-content">{paste.content}</div>
                    </div>

                    <div className="actions">
                        <button className="btn btn-primary" onClick={copyToClipboard}>
                            📋 Copy Content
                        </button>
                        <Link to="/" className="btn btn-secondary">
                            ➕ Create New Paste
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewPaste;
