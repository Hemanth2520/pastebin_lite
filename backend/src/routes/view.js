import express from 'express';
import Paste from '../models/Paste.js';
import { validatePasteId } from '../middleware/validation.js';
import { getCurrentTime, isPasteAvailable } from '../utils/timeUtils.js';

const router = express.Router();

/**
 * GET /p/:id
 * View a paste as HTML
 */
router.get('/p/:id', validatePasteId, async (req, res) => {
    try {
        const { id } = req.params;
        const currentTime = getCurrentTime(req);

        // Find paste
        const paste = await Paste.findOne({ pasteId: id });

        // Check if paste exists and is available
        if (!isPasteAvailable(paste, currentTime)) {
            return res.status(404).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Paste Not Found - Pastebin Lite</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 20px;
            }
            .container {
              background: white;
              border-radius: 16px;
              box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
              padding: 60px 40px;
              max-width: 600px;
              text-align: center;
            }
            h1 {
              color: #667eea;
              font-size: 72px;
              margin-bottom: 20px;
            }
            h2 {
              color: #333;
              font-size: 28px;
              margin-bottom: 16px;
            }
            p {
              color: #666;
              font-size: 16px;
              line-height: 1.6;
              margin-bottom: 30px;
            }
            a {
              display: inline-block;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              text-decoration: none;
              padding: 14px 32px;
              border-radius: 8px;
              font-weight: 600;
              transition: transform 0.2s, box-shadow 0.2s;
            }
            a:hover {
              transform: translateY(-2px);
              box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>404</h1>
            <h2>Paste Not Found</h2>
            <p>This paste does not exist, has expired, or has reached its view limit.</p>
            <a href="${process.env.FRONTEND_URL || '/'}">Create New Paste</a>
          </div>
        </body>
        </html>
      `);
        }

        // Increment view count atomically (but don't count HTML views for the limit)
        // Note: Only API fetches count toward view limit as per requirements

        // Escape HTML to prevent XSS
        const escapeHtml = (text) => {
            const map = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;'
            };
            return text.replace(/[&<>"']/g, (m) => map[m]);
        };

        const safeContent = escapeHtml(paste.content);

        // Calculate metadata
        const remainingViews = paste.maxViews !== null
            ? Math.max(0, paste.maxViews - paste.viewCount)
            : null;

        const expiresAt = paste.expiresAt ? paste.expiresAt.toISOString() : null;

        // Render HTML
        res.status(200).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Paste - Pastebin Lite</title>
        <meta name="description" content="View shared paste">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 40px 20px;
          }
          .container {
            max-width: 900px;
            margin: 0 auto;
          }
          .header {
            background: white;
            border-radius: 16px 16px 0 0;
            padding: 30px 40px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          h1 {
            color: #667eea;
            font-size: 32px;
            margin-bottom: 16px;
          }
          .metadata {
            display: flex;
            gap: 24px;
            flex-wrap: wrap;
            color: #666;
            font-size: 14px;
          }
          .metadata-item {
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .metadata-label {
            font-weight: 600;
            color: #333;
          }
          .content-wrapper {
            background: #f8f9fa;
            border-radius: 0 0 16px 16px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          }
          .paste-content {
            background: white;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 24px;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            line-height: 1.6;
            white-space: pre-wrap;
            word-wrap: break-word;
            color: #333;
            max-height: 600px;
            overflow-y: auto;
          }
          .actions {
            margin-top: 24px;
            display: flex;
            gap: 16px;
            flex-wrap: wrap;
          }
          .btn {
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            text-decoration: none;
            transition: transform 0.2s, box-shadow 0.2s;
            cursor: pointer;
            border: none;
            font-size: 14px;
          }
          .btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
          }
          .btn-secondary {
            background: white;
            color: #667eea;
            border: 2px solid #667eea;
          }
          .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          }
          .success-message {
            display: none;
            background: #4caf50;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            margin-top: 16px;
            font-size: 14px;
          }
          .success-message.show {
            display: block;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📋 Paste View</h1>
            <div class="metadata">
              <div class="metadata-item">
                <span class="metadata-label">ID:</span>
                <span>${paste.pasteId}</span>
              </div>
              ${remainingViews !== null ? `
                <div class="metadata-item">
                  <span class="metadata-label">Remaining Views:</span>
                  <span>${remainingViews}</span>
                </div>
              ` : ''}
              ${expiresAt ? `
                <div class="metadata-item">
                  <span class="metadata-label">Expires:</span>
                  <span>${new Date(expiresAt).toLocaleString()}</span>
                </div>
              ` : ''}
              <div class="metadata-item">
                <span class="metadata-label">Created:</span>
                <span>${paste.createdAt.toLocaleString()}</span>
              </div>
            </div>
          </div>
          <div class="content-wrapper">
            <div class="paste-content">${safeContent}</div>
            <div class="actions">
              <button class="btn btn-primary" onclick="copyToClipboard()">📋 Copy Content</button>
              <a href="${process.env.FRONTEND_URL || '/'}" class="btn btn-secondary">➕ Create New Paste</a>
            </div>
            <div class="success-message" id="successMessage">✓ Copied to clipboard!</div>
          </div>
        </div>
        <script>
          function copyToClipboard() {
            const content = \`${safeContent.replace(/`/g, '\\`')}\`;
            navigator.clipboard.writeText(content).then(() => {
              const message = document.getElementById('successMessage');
              message.classList.add('show');
              setTimeout(() => {
                message.classList.remove('show');
              }, 3000);
            }).catch(err => {
              alert('Failed to copy content');
            });
          }
        </script>
      </body>
      </html>
    `);
    } catch (error) {
        console.error('Error viewing paste:', error);
        res.status(500).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Error - Pastebin Lite</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
          }
          .container {
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            padding: 60px 40px;
            max-width: 600px;
            text-align: center;
          }
          h1 { color: #f44336; font-size: 48px; margin-bottom: 20px; }
          p { color: #666; font-size: 16px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>⚠️ Error</h1>
          <p>An error occurred while loading this paste. Please try again later.</p>
        </div>
      </body>
      </html>
    `);
    }
});

export default router;
