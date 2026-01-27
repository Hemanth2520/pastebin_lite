# Quick Reference Guide

## 🚀 Quick Start

### First Time Setup
```bash
# 1. Install backend dependencies
cd backend
npm install

# 2. Install frontend dependencies
cd ../client
npm install

# 3. Set up MongoDB (choose one):
#    - MongoDB Atlas: https://www.mongodb.com/cloud/atlas
#    - Local MongoDB: Install and run locally

# 4. Configure environment variables
#    - Copy backend/.env.example to backend/.env
#    - Update MONGODB_URI in backend/.env
#    - Copy client/.env.example to client/.env
```

### Start Development
```bash
# Option 1: Use the startup script (Windows)
./start-dev.ps1

# Option 2: Manual start
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

### Access the Application
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/healthz

---

## 📝 Common Commands

### Backend
```bash
cd backend

# Start development server
npm run dev

# Start production server
npm start

# Install dependencies
npm install
```

### Frontend
```bash
cd client

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Install dependencies
npm install
```

---

## 🔧 Environment Variables

### Backend (`backend/.env`)
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/pastebin
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
TEST_MODE=0
```

### Frontend (`client/.env`)
```env
VITE_API_URL=http://localhost:5000
```

---

## 🌐 API Endpoints

### Health Check
```bash
GET /api/healthz
```

### Create Paste
```bash
POST /api/pastes
Content-Type: application/json

{
  "content": "Your text here",
  "ttl_seconds": 3600,      # Optional
  "max_views": 5            # Optional
}
```

### Get Paste (API)
```bash
GET /api/pastes/:id
```

### View Paste (HTML)
```bash
GET /p/:id
```

---

## 🧪 Testing Examples

### Create a Simple Paste
```bash
curl -X POST http://localhost:5000/api/pastes \
  -H "Content-Type: application/json" \
  -d '{"content": "Hello, World!"}'
```

### Create Paste with Expiry (1 hour)
```bash
curl -X POST http://localhost:5000/api/pastes \
  -H "Content-Type: application/json" \
  -d '{"content": "Expires in 1 hour", "ttl_seconds": 3600}'
```

### Create Paste with View Limit
```bash
curl -X POST http://localhost:5000/api/pastes \
  -H "Content-Type: application/json" \
  -d '{"content": "Max 5 views", "max_views": 5}'
```

### Fetch a Paste
```bash
curl http://localhost:5000/api/pastes/PASTE_ID
```

---

## 🚢 Deployment Checklist

### Prerequisites
- [ ] Vercel account
- [ ] MongoDB Atlas account
- [ ] Git repository (GitHub/GitLab/Bitbucket)

### Backend Deployment
1. [ ] Create MongoDB Atlas cluster
2. [ ] Get connection string
3. [ ] Push code to Git
4. [ ] Import to Vercel
5. [ ] Set root directory to `backend`
6. [ ] Add environment variables:
   - `MONGODB_URI`
   - `NODE_ENV=production`
   - `TEST_MODE=0`
7. [ ] Deploy
8. [ ] Copy deployment URL

### Frontend Deployment
1. [ ] Import same repo to Vercel
2. [ ] Set root directory to `client`
3. [ ] Set framework to Vite
4. [ ] Add environment variable:
   - `VITE_API_URL` (backend URL)
5. [ ] Deploy
6. [ ] Copy deployment URL

### Post-Deployment
1. [ ] Update backend `FRONTEND_URL` env variable
2. [ ] Redeploy backend
3. [ ] Test health check
4. [ ] Test creating and viewing pastes

---

## 🐛 Troubleshooting

### Backend won't start
- ✅ Check MongoDB is running
- ✅ Verify MONGODB_URI in .env
- ✅ Check port 5000 is not in use
- ✅ Run `npm install` in backend directory

### Frontend won't start
- ✅ Check VITE_API_URL in .env
- ✅ Check port 5173 is not in use
- ✅ Run `npm install` in client directory

### CORS errors
- ✅ Verify FRONTEND_URL in backend .env
- ✅ Restart backend server
- ✅ Check browser console for exact error

### Database connection failed
- ✅ Check MongoDB Atlas IP whitelist (0.0.0.0/0)
- ✅ Verify username/password in connection string
- ✅ Test connection string with MongoDB Compass

### Pastes not expiring
- ✅ Check MongoDB TTL index is created
- ✅ Wait 60 seconds after expiry (MongoDB TTL runs every 60s)
- ✅ Verify expiresAt field is set correctly

---

## 📚 Documentation Files

- **README.md**: Main project documentation
- **DEPLOYMENT.md**: Detailed deployment guide
- **API_TESTING.md**: API testing examples
- **PROJECT_STRUCTURE.md**: Complete project structure
- **QUICK_REFERENCE.md**: This file

---

## 🔑 Key Features

### Paste Creation
- ✅ Create text pastes
- ✅ Optional time-based expiry (TTL)
- ✅ Optional view-count limits
- ✅ Shareable URLs

### Paste Viewing
- ✅ API endpoint (JSON)
- ✅ HTML view (browser)
- ✅ View count tracking
- ✅ Expiry status

### Technical
- ✅ MongoDB persistence
- ✅ Serverless-ready
- ✅ CORS enabled
- ✅ Input validation
- ✅ XSS protection
- ✅ Deterministic time testing

---

## 📊 Tech Stack Summary

**Backend**: Node.js + Express + MongoDB  
**Frontend**: React + Vite  
**Deployment**: Vercel  
**Database**: MongoDB Atlas  

---

## 💡 Tips

1. **Development**: Use MongoDB Atlas free tier for easier setup
2. **Testing**: Use the health check endpoint to verify backend is running
3. **Debugging**: Check browser console and terminal logs
4. **Production**: Set NODE_ENV=production for backend
5. **Security**: Never commit .env files to Git
6. **Performance**: MongoDB TTL indexes handle automatic cleanup

---

## 🎯 Next Steps

1. Set up MongoDB (Atlas or local)
2. Configure environment variables
3. Start development servers
4. Test locally
5. Deploy to Vercel
6. Share your deployed URL!

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the documentation files
3. Check MongoDB Atlas and Vercel logs
4. Verify environment variables are set correctly

---

**Happy Coding! 🚀**
