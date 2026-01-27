# Pastebin-Lite

A simple Pastebin-like application built with the MERN stack that allows users to create and share text pastes with optional expiry and view limits.

## Features

- Create text pastes with shareable URLs
- Optional time-based expiry (TTL)
- Optional view-count limits
- Automatic paste cleanup when constraints are met
- RESTful API with comprehensive error handling
- Modern, responsive UI

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas (cloud-hosted)
- **Deployment**: Vercel

### Frontend
- **Framework**: React
- **Build Tool**: Vite
- **Styling**: CSS3
- **Deployment**: Vercel

## Persistence Layer

This application uses **MongoDB Atlas** as its persistence layer. MongoDB was chosen because:

1. **Serverless-friendly**: Works seamlessly with Vercel's serverless functions
2. **TTL indexes**: Native support for automatic document expiration
3. **Scalability**: Cloud-hosted with automatic scaling
4. **Free tier**: Generous free tier for small applications
5. **Easy setup**: Quick to configure and deploy

The database stores paste documents with the following schema:
- `content`: The paste text
- `pasteId`: Unique identifier
- `maxViews`: Optional view limit
- `viewCount`: Current view count
- `expiresAt`: Optional expiration timestamp
- `createdAt`: Creation timestamp

MongoDB's TTL indexes automatically clean up expired pastes, and the application logic handles view-count limits.

## Running Locally

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB instance)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `backend` directory:
```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

4. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `client` directory:
```env
VITE_API_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Deployment

### Backend Deployment (Vercel)

1. Push your code to a Git repository
2. Import the `backend` directory to Vercel
3. Set environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `FRONTEND_URL`: Your deployed frontend URL
4. Deploy

### Frontend Deployment (Vercel)

1. Import the `client` directory to Vercel
2. Set environment variables:
   - `VITE_API_URL`: Your deployed backend URL
3. Deploy

## API Endpoints

### Health Check
```
GET /api/healthz
```
Returns the health status of the application and database connection.

### Create Paste
```
POST /api/pastes
Content-Type: application/json

{
  "content": "string (required)",
  "ttl_seconds": number (optional, >= 1),
  "max_views": number (optional, >= 1)
}
```

### Get Paste (API)
```
GET /api/pastes/:id
```
Returns paste content and metadata. Increments view count.

### View Paste (HTML)
```
GET /p/:id
```
Returns HTML page displaying the paste content.

## Important Design Decisions

### 1. Separate Frontend and Backend
The application is split into two independent deployments for:
- Better separation of concerns
- Independent scaling
- Easier maintenance
- Flexibility in deployment strategies

### 2. MongoDB for Persistence
MongoDB Atlas was chosen over in-memory or file-based storage because:
- Vercel serverless functions are stateless
- TTL indexes provide automatic cleanup
- Cloud-hosted solution requires no server maintenance
- Free tier is sufficient for the use case

### 3. Deterministic Time for Testing
The application supports `TEST_MODE=1` environment variable and `x-test-now-ms` header for deterministic expiry testing, allowing automated tests to verify TTL functionality.

### 4. View Count Tracking
Each API fetch increments the view count. The application uses atomic operations to prevent race conditions under concurrent load.

### 5. Error Handling
Comprehensive error handling with:
- Input validation using express-validator
- Proper HTTP status codes
- JSON error responses
- Safe HTML rendering (XSS prevention)

### 6. CORS Configuration
Backend is configured to accept requests from the frontend domain, with proper CORS headers for cross-origin requests.

## Testing

The application is designed to pass automated tests for:
- Health check endpoint
- Paste creation and retrieval
- View limits
- TTL expiry
- Combined constraints
- Error handling
- Concurrent access

## License

MIT
