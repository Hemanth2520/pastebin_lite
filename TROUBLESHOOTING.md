# Troubleshooting Guide - Common Development Issues

## Issue 1: 404 Error When Fetching Paste (Current Issue)

### Symptoms
- Paste creation returns success with an ID
- Trying to view the paste returns 404 error
- Error: `Failed to load resource: the server responded with a status of 404`

### Root Cause
The paste is being created in memory but **not saved to MongoDB**. This happens when:
1. MongoDB is not running
2. MongoDB connection string is incorrect
3. Database connection failed silently

### Solution

#### Option A: Use MongoDB Atlas (Recommended - 5 minutes)

This is the **easiest and recommended** solution:

1. **Create Free MongoDB Atlas Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for free account
   - Create a free M0 cluster (takes 3-5 minutes)

2. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://username:password@cluster.mongodb.net/pastebin?retryWrites=true&w=majority`

3. **Update Backend .env**
   - Open `backend/.env`
   - Replace the MONGODB_URI line with your Atlas connection string:
   ```env
   MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/pastebin?retryWrites=true&w=majority
   ```
   - Replace `your-username` and `your-password` with your actual credentials

4. **Whitelist IP Address**
   - In MongoDB Atlas, go to Network Access
   - Click "Add IP Address"
   - Choose "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

5. **Restart Backend Server**
   - Press `Ctrl+C` in the backend terminal
   - Run `npm run dev` again
   - Look for: "MongoDB Connected: cluster.mongodb.net"

#### Option B: Install Local MongoDB (15-20 minutes)

If you prefer local development:

1. **Download MongoDB Community Edition**
   - Windows: https://www.mongodb.com/try/download/community
   - Download the MSI installer
   - Run installer with default settings

2. **Start MongoDB Service**
   ```powershell
   # Check if MongoDB service is running
   Get-Service -Name MongoDB
   
   # If not running, start it
   Start-Service -Name MongoDB
   ```

3. **Verify MongoDB is Running**
   ```powershell
   # Check if MongoDB is listening on port 27017
   Test-NetConnection -ComputerName localhost -Port 27017
   ```

4. **Restart Backend Server**
   - The default connection string should work: `mongodb://localhost:27017/pastebin`

### Quick Test

After setting up MongoDB, test the connection:

```bash
# In backend directory
cd backend

# Test health check (should show database: connected)
curl http://localhost:5000/api/healthz
```

Expected response:
```json
{
  "ok": true,
  "timestamp": "2026-01-27T...",
  "database": "connected"
}
```

---

## Issue 2: CORS Errors (FIXED ✅)

### Symptoms
- `Access-Control-Allow-Origin` header errors
- Frontend can't communicate with backend

### Solution Applied
- Updated backend CORS to allow all localhost ports in development
- No action needed - already fixed!

---

## Issue 3: React Router Warnings (Optional Fix)

### Symptoms
- Warning about `v7_startTransition` future flag
- Warning about `v7_relativeSplatPath` future flag

### Solution
Update `client/src/App.jsx` to include future flags:

```javascript
<Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
```

---

## Issue 4: Port Conflicts

### Symptoms
- "Port already in use" error
- Frontend runs on unexpected port (5174 instead of 5173)

### Solution
Either:
1. Stop the process using the port
2. Or use the port that's available (already handled by our CORS fix)

---

## Quick Diagnostic Commands

### Check if MongoDB is running (Windows)
```powershell
Get-Service -Name MongoDB
Test-NetConnection -ComputerName localhost -Port 27017
```

### Check if backend is running
```powershell
Test-NetConnection -ComputerName localhost -Port 5000
```

### Check backend health
```bash
curl http://localhost:5000/api/healthz
```

### View backend logs
Check the terminal where `npm run dev` is running for error messages.

---

## Common Error Messages

### "MongooseServerSelectionError: connect ECONNREFUSED"
**Cause**: MongoDB is not running  
**Solution**: Start MongoDB service or use MongoDB Atlas

### "CORS policy: No 'Access-Control-Allow-Origin' header"
**Cause**: CORS not configured  
**Solution**: Already fixed in our code ✅

### "404 Not Found" when fetching paste
**Cause**: Database not connected, paste not saved  
**Solution**: Fix MongoDB connection (see Issue 1 above)

### "Cannot find module"
**Cause**: Dependencies not installed  
**Solution**: Run `npm install` in the affected directory

---

## Recommended Setup for This Project

For the smoothest experience:

1. ✅ **Use MongoDB Atlas** (free, no installation needed)
2. ✅ **Use `npm run dev`** for backend (auto-restart on changes)
3. ✅ **Keep both terminals open** (backend + frontend)
4. ✅ **Check health endpoint** before testing

---

## Next Steps

**Right now, you need to:**

1. **Set up MongoDB** (choose Option A or B above)
2. **Restart backend server** after updating .env
3. **Test the health endpoint** to verify database connection
4. **Try creating a paste again**

Would you like help with MongoDB Atlas setup? I can guide you through it step by step! 🚀
