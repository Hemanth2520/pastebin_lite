# Assignment Submission Checklist

Use this checklist to ensure your submission meets all requirements.

## ✅ Functional Requirements

### User Capabilities
- [ ] Users can create a paste containing arbitrary text
- [ ] Users receive a shareable URL for the paste
- [ ] Users can visit the URL to view the paste
- [ ] Pastes become unavailable based on optional constraints

### Paste Constraints
- [ ] Time-based expiry (TTL) works correctly
- [ ] View-count limit works correctly
- [ ] Paste becomes unavailable when either constraint triggers
- [ ] Both constraints can be used together

## ✅ Required Routes

### Health Check (`GET /api/healthz`)
- [ ] Returns HTTP 200
- [ ] Returns valid JSON
- [ ] Responds quickly (< 1 second)
- [ ] Reflects database connection status
- [ ] Example response: `{ "ok": true }`

### Create Paste (`POST /api/pastes`)
- [ ] Accepts JSON request body
- [ ] `content` is required and non-empty
- [ ] `ttl_seconds` is optional, must be >= 1 if present
- [ ] `max_views` is optional, must be >= 1 if present
- [ ] Returns 2xx status on success
- [ ] Returns JSON with `id` and `url`
- [ ] Invalid input returns 4xx with JSON error

### Fetch Paste (`GET /api/pastes/:id`)
- [ ] Returns 200 with JSON on success
- [ ] Response includes `content`, `remaining_views`, `expires_at`
- [ ] `remaining_views` is null if unlimited
- [ ] `expires_at` is null if no TTL
- [ ] Each fetch counts as a view
- [ ] Returns 404 for missing/expired/limit-exceeded pastes
- [ ] 404 response is JSON

### View Paste (`GET /p/:id`)
- [ ] Returns HTML (200) with paste content
- [ ] Returns 404 if paste unavailable
- [ ] Content is rendered safely (no script execution)

## ✅ Deterministic Time Testing

- [ ] `TEST_MODE=1` environment variable supported
- [ ] `x-test-now-ms` header treated as current time for expiry
- [ ] Falls back to system time if header absent
- [ ] Only affects expiry logic, not other functionality

## ✅ Persistence Layer

- [ ] Using persistent storage (not in-memory only)
- [ ] Works across serverless function invocations
- [ ] Documented in README.md
- [ ] Suitable for Vercel deployment

## ✅ Automated Test Compatibility

### Service Checks
- [ ] `/api/healthz` returns 200 and valid JSON
- [ ] All API responses return valid JSON
- [ ] Correct `Content-Type: application/json` headers
- [ ] Requests complete within reasonable timeout

### Paste Creation
- [ ] Creating paste returns valid `id` and `url`
- [ ] URL points to `/p/:id` on your domain

### Paste Retrieval
- [ ] Fetching existing paste returns original content
- [ ] Visiting `/p/:id` returns HTML with content

### View Limits
- [ ] Paste with `max_views=1`: first fetch 200, second 404
- [ ] Paste with `max_views=2`: two successful, third 404
- [ ] No negative remaining view counts

### Time-to-Live
- [ ] Paste available before expiry
- [ ] Paste returns 404 after expiry (using `x-test-now-ms`)

### Combined Constraints
- [ ] Paste with both TTL and max views
- [ ] Becomes unavailable when first constraint triggers

### Error Handling
- [ ] Invalid inputs return 4xx with JSON errors
- [ ] Unavailable pastes consistently return 404

### Robustness
- [ ] No race conditions under concurrent load
- [ ] Atomic view counting

## ✅ UI Requirements

- [ ] Users can create paste via UI
- [ ] Users can view paste via shared link
- [ ] Errors shown clearly (invalid input, expired paste)
- [ ] UI flows work correctly

## ✅ Repository Requirements

### Repository Structure
- [ ] `README.md` exists at repository root
- [ ] README contains project description
- [ ] README contains local setup instructions
- [ ] README describes persistence layer used
- [ ] Repository contains source code (not just build artifacts)

### Code Quality
- [ ] No hardcoded localhost URLs in committed code
- [ ] No secrets/tokens/credentials in repository
- [ ] No global mutable state breaking serverless

### Build & Runtime
- [ ] Project installs with documented commands
- [ ] Project starts with documented commands
- [ ] Deployed app starts without manual migrations
- [ ] No shell access required for deployment

## ✅ Deployment

### Backend Deployment
- [ ] Deployed to Vercel (or equivalent)
- [ ] Environment variables configured
- [ ] Health check endpoint accessible
- [ ] API endpoints working

### Frontend Deployment
- [ ] Deployed to Vercel (or equivalent)
- [ ] Environment variables configured
- [ ] Can create pastes
- [ ] Can view pastes

### Integration
- [ ] Frontend can communicate with backend
- [ ] CORS configured correctly
- [ ] Shared links work
- [ ] End-to-end flow works

## ✅ Submission Package

### Required Items
- [ ] Deployed URL (e.g., `https://your-app.vercel.app`)
- [ ] Public Git repository URL
- [ ] README with:
  - [ ] How to run locally
  - [ ] Persistence layer description
  - [ ] Important design decisions

### Optional (Recommended)
- [ ] DEPLOYMENT.md with deployment instructions
- [ ] API_TESTING.md with testing examples
- [ ] Clear commit history
- [ ] Proper .gitignore files

## ✅ Testing Before Submission

### Manual Testing
- [ ] Create simple paste → verify it works
- [ ] Create paste with TTL → verify expiry
- [ ] Create paste with max views → verify limit
- [ ] Create paste with both → verify first constraint wins
- [ ] Test invalid inputs → verify 4xx errors
- [ ] Test non-existent paste → verify 404

### API Testing
```bash
# Health check
curl https://your-backend.vercel.app/api/healthz

# Create paste
curl -X POST https://your-backend.vercel.app/api/pastes \
  -H "Content-Type: application/json" \
  -d '{"content": "Test"}'

# Fetch paste
curl https://your-backend.vercel.app/api/pastes/PASTE_ID

# View paste (in browser)
# Visit: https://your-frontend.vercel.app/p/PASTE_ID
```

### Edge Cases
- [ ] Empty content → 400 error
- [ ] Negative TTL → 400 error
- [ ] Negative max views → 400 error
- [ ] Non-existent paste → 404
- [ ] Expired paste → 404
- [ ] View limit exceeded → 404

## ✅ Final Checks

- [ ] All URLs are HTTPS (not HTTP)
- [ ] No console errors in browser
- [ ] No server errors in logs
- [ ] Mobile responsive (bonus)
- [ ] Fast load times
- [ ] Professional appearance

## 📋 Submission Template

```
Pastebin-Lite Submission
========================

Deployed URL: https://your-frontend.vercel.app
Git Repository: https://github.com/yourusername/pastebin-lite

Notes:
------
Persistence Layer: MongoDB Atlas (cloud-hosted NoSQL database)
- Chosen for serverless compatibility and TTL index support
- Free tier M0 cluster
- Automatic document expiration via TTL indexes

Design Decisions:
-----------------
1. Separated frontend and backend for independent scaling
2. Used MongoDB TTL indexes for automatic paste cleanup
3. Implemented atomic view counting to prevent race conditions
4. Added deterministic time support for automated testing
5. XSS protection via HTML escaping in view endpoint

Local Setup:
------------
See README.md for detailed instructions.

Backend: cd backend && npm install && npm run dev
Frontend: cd client && npm install && npm run dev

Additional Documentation:
-------------------------
- DEPLOYMENT.md: Step-by-step deployment guide
- API_TESTING.md: API testing examples
- PROJECT_STRUCTURE.md: Complete project structure
```

## 🎯 Success Criteria

Your submission is ready when:
1. ✅ All functional requirements work
2. ✅ All required routes implemented
3. ✅ Persistence layer configured
4. ✅ Deployed and accessible
5. ✅ Repository is clean and documented
6. ✅ README is comprehensive

## 🚀 Ready to Submit?

If all checkboxes are checked, you're ready to submit!

**Good luck! 🎉**
