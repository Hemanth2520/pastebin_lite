# Deployment Guide - Pastebin-Lite

This guide will walk you through deploying both the backend and frontend to Vercel.

## Prerequisites

1. A [Vercel](https://vercel.com) account
2. A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (free tier is sufficient)
3. Git repository (GitHub, GitLab, or Bitbucket)

## Step 1: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up/login
2. Create a new cluster (free tier M0 is fine)
3. Create a database user:
   - Go to Database Access
   - Add New Database User
   - Choose Password authentication
   - Save username and password
4. Whitelist IP addresses:
   - Go to Network Access
   - Add IP Address
   - Choose "Allow Access from Anywhere" (0.0.0.0/0) for Vercel
5. Get your connection string:
   - Go to Database → Connect
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `pastebin`

Example connection string:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/pastebin?retryWrites=true&w=majority
```

## Step 2: Push Code to Git Repository

1. Initialize git repository (if not already done):
```bash
cd pastebin_lite
git init
git add .
git commit -m "Initial commit"
```

2. Create a new repository on GitHub/GitLab/Bitbucket

3. Push your code:
```bash
git remote add origin <your-repo-url>
git branch -M main
git push -u origin main
```

## Step 3: Deploy Backend to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Import your Git repository
4. Configure the project:
   - **Framework Preset**: Other
   - **Root Directory**: `backend`
   - **Build Command**: Leave empty
   - **Output Directory**: Leave empty
5. Add Environment Variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `NODE_ENV`: `production`
   - `TEST_MODE`: `0`
   - `FRONTEND_URL`: (leave empty for now, will update after frontend deployment)
6. Click "Deploy"
7. Wait for deployment to complete
8. Copy the deployment URL (e.g., `https://your-backend.vercel.app`)

## Step 4: Deploy Frontend to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Import the same Git repository
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variables:
   - `VITE_API_URL`: Your backend URL from Step 3 (e.g., `https://your-backend.vercel.app`)
6. Click "Deploy"
7. Wait for deployment to complete
8. Copy the deployment URL (e.g., `https://your-frontend.vercel.app`)

## Step 5: Update Backend Environment Variable

1. Go to your backend project in Vercel Dashboard
2. Go to Settings → Environment Variables
3. Add or update `FRONTEND_URL` with your frontend URL from Step 4
4. Go to Deployments tab
5. Click the three dots on the latest deployment → "Redeploy"

## Step 6: Test Your Deployment

1. Visit your frontend URL
2. Create a test paste
3. Verify you can view the paste
4. Test the health check endpoint: `https://your-backend.vercel.app/api/healthz`

## Troubleshooting

### Backend Issues

**Problem**: Health check returns `{ "ok": false }`

**Solution**: 
- Check MongoDB connection string is correct
- Verify MongoDB Atlas IP whitelist includes 0.0.0.0/0
- Check Vercel logs for connection errors

**Problem**: CORS errors in browser console

**Solution**:
- Ensure `FRONTEND_URL` environment variable is set correctly in backend
- Redeploy backend after updating environment variables

### Frontend Issues

**Problem**: API calls fail with network errors

**Solution**:
- Verify `VITE_API_URL` is set correctly
- Check backend is deployed and accessible
- Redeploy frontend after updating environment variables

**Problem**: Routing doesn't work (404 on refresh)

**Solution**:
- Ensure `vercel.json` exists in client directory with proper rewrites configuration

## Environment Variables Summary

### Backend Environment Variables
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pastebin?retryWrites=true&w=majority
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
TEST_MODE=0
```

### Frontend Environment Variables
```
VITE_API_URL=https://your-backend.vercel.app
```

## Custom Domain (Optional)

To use a custom domain:

1. Go to your project in Vercel Dashboard
2. Go to Settings → Domains
3. Add your custom domain
4. Follow Vercel's instructions to configure DNS
5. Update environment variables if needed

## Monitoring

- View logs in Vercel Dashboard → Deployments → [Select deployment] → View Function Logs
- Monitor MongoDB usage in MongoDB Atlas Dashboard
- Set up alerts in MongoDB Atlas for storage and connection limits

## Cost Considerations

- **Vercel Free Tier**: 
  - 100GB bandwidth/month
  - 100 hours serverless function execution/month
  - Unlimited deployments
  
- **MongoDB Atlas Free Tier (M0)**:
  - 512 MB storage
  - Shared RAM
  - No backup
  - Perfect for this use case

Both free tiers should be sufficient for moderate usage of this application.
