# Project Structure

This document outlines the complete structure of the Pastebin-Lite application.

```
pastebin_lite/
│
├── README.md                    # Main project documentation
├── DEPLOYMENT.md                # Deployment guide for Vercel
├── API_TESTING.md              # API testing examples and guide
├── start-dev.ps1               # Development startup script (Windows)
├── .gitignore                  # Root gitignore
│
├── backend/                    # Backend API (Node.js + Express)
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js          # MongoDB connection configuration
│   │   │
│   │   ├── models/
│   │   │   └── Paste.js       # Mongoose schema for pastes
│   │   │
│   │   ├── routes/
│   │   │   ├── health.js      # Health check endpoint
│   │   │   ├── pastes.js      # Paste CRUD API endpoints
│   │   │   └── view.js        # HTML view endpoint
│   │   │
│   │   ├── middleware/
│   │   │   └── validation.js  # Request validation middleware
│   │   │
│   │   ├── utils/
│   │   │   └── timeUtils.js   # Time handling utilities
│   │   │
│   │   └── index.js           # Express app entry point
│   │
│   ├── package.json           # Backend dependencies
│   ├── .env                   # Environment variables (not in git)
│   ├── .env.example           # Environment variables template
│   ├── .gitignore             # Backend gitignore
│   └── vercel.json            # Vercel deployment config
│
└── client/                    # Frontend (React + Vite)
    ├── src/
    │   ├── components/
    │   │   ├── CreatePaste.jsx      # Paste creation component
    │   │   ├── CreatePaste.css      # CreatePaste styles
    │   │   ├── ViewPaste.jsx        # Paste viewing component
    │   │   └── ViewPaste.css        # ViewPaste styles
    │   │
    │   ├── services/
    │   │   └── api.js              # API service layer
    │   │
    │   ├── App.jsx                 # Main app component
    │   ├── main.jsx                # React entry point
    │   └── index.css               # Global styles and design system
    │
    ├── public/                     # Static assets
    ├── index.html                  # HTML entry point
    ├── package.json                # Frontend dependencies
    ├── vite.config.js              # Vite configuration
    ├── .env                        # Environment variables (not in git)
    ├── .env.example                # Environment variables template
    ├── .gitignore                  # Frontend gitignore
    └── vercel.json                 # Vercel deployment config
```

## Directory Descriptions

### Root Level

- **README.md**: Comprehensive project documentation including setup, tech stack, and design decisions
- **DEPLOYMENT.md**: Step-by-step guide for deploying to Vercel with MongoDB Atlas
- **API_TESTING.md**: Complete API testing guide with curl examples
- **start-dev.ps1**: PowerShell script to start both servers for development
- **.gitignore**: Prevents committing node_modules, .env files, and build artifacts

### Backend (`/backend`)

#### `/src/config`
- **db.js**: MongoDB connection logic with connection pooling for serverless environments

#### `/src/models`
- **Paste.js**: Mongoose schema defining paste structure with TTL indexes

#### `/src/routes`
- **health.js**: Health check endpoint (`GET /api/healthz`)
- **pastes.js**: API endpoints for creating and fetching pastes
- **view.js**: HTML rendering endpoint (`GET /p/:id`)

#### `/src/middleware`
- **validation.js**: Express-validator middleware for input validation

#### `/src/utils`
- **timeUtils.js**: Utilities for deterministic time testing and paste availability checks

#### Root Files
- **index.js**: Main Express application setup
- **package.json**: Dependencies (express, mongoose, cors, etc.)
- **.env**: Local environment variables (MongoDB URI, PORT, etc.)
- **vercel.json**: Vercel serverless configuration

### Frontend (`/client`)

#### `/src/components`
- **CreatePaste.jsx**: Form component for creating new pastes
- **CreatePaste.css**: Styles for create paste page
- **ViewPaste.jsx**: Component for viewing paste content
- **ViewPaste.css**: Styles for view paste page

#### `/src/services`
- **api.js**: Centralized API communication layer

#### Root Files
- **App.jsx**: Main React component with routing
- **main.jsx**: React DOM rendering entry point
- **index.css**: Global CSS with design system (colors, typography, components)
- **index.html**: HTML template with meta tags
- **vite.config.js**: Vite build configuration
- **package.json**: Dependencies (react, react-router-dom, etc.)
- **vercel.json**: SPA routing configuration for Vercel

## Key Features by File

### Backend Features

| Feature | File | Description |
|---------|------|-------------|
| Database Connection | `config/db.js` | Persistent MongoDB connection for serverless |
| Paste Schema | `models/Paste.js` | Schema with TTL indexes for auto-expiry |
| Health Check | `routes/health.js` | Database connectivity check |
| Create Paste | `routes/pastes.js` | POST endpoint with validation |
| Fetch Paste | `routes/pastes.js` | GET endpoint with view counting |
| HTML View | `routes/view.js` | Server-rendered HTML with XSS protection |
| Input Validation | `middleware/validation.js` | Request validation rules |
| Time Testing | `utils/timeUtils.js` | Deterministic time for automated tests |

### Frontend Features

| Feature | File | Description |
|---------|------|-------------|
| Create UI | `components/CreatePaste.jsx` | Form with TTL and view limit options |
| View UI | `components/ViewPaste.jsx` | Display paste with metadata |
| API Layer | `services/api.js` | Centralized fetch calls |
| Routing | `App.jsx` | React Router setup |
| Design System | `index.css` | CSS variables, components, utilities |

## Technology Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Validation**: express-validator
- **ID Generation**: nanoid
- **CORS**: cors middleware

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router DOM v6
- **Styling**: Vanilla CSS with design system
- **Fonts**: Google Fonts (Inter)

### Deployment
- **Platform**: Vercel (serverless)
- **Database**: MongoDB Atlas (cloud)

## Development Workflow

1. **Install Dependencies**
   ```bash
   cd backend && npm install
   cd ../client && npm install
   ```

2. **Configure Environment**
   - Copy `.env.example` to `.env` in both directories
   - Update MongoDB connection string in `backend/.env`

3. **Start Development Servers**
   ```bash
   # Option 1: Use script
   ./start-dev.ps1

   # Option 2: Manual
   # Terminal 1
   cd backend && npm run dev

   # Terminal 2
   cd client && npm run dev
   ```

4. **Access Application**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000
   - Health Check: http://localhost:5000/api/healthz

## Build for Production

### Backend
```bash
cd backend
# No build step needed - runs directly on Node.js
```

### Frontend
```bash
cd client
npm run build
# Output in dist/ directory
```

## Environment Variables

### Backend (`.env`)
```env
MONGODB_URI=mongodb://localhost:27017/pastebin
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
TEST_MODE=0
```

### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:5000
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/healthz` | Health check |
| POST | `/api/pastes` | Create paste |
| GET | `/api/pastes/:id` | Fetch paste (counts as view) |
| GET | `/p/:id` | View paste as HTML |

## Design Patterns

### Backend
- **Separation of Concerns**: Routes, models, middleware, utilities in separate files
- **Validation Layer**: Centralized input validation
- **Error Handling**: Consistent JSON error responses
- **Atomic Operations**: MongoDB atomic updates for view counting
- **Serverless-Ready**: Connection pooling and stateless design

### Frontend
- **Component-Based**: Reusable React components
- **Service Layer**: API calls abstracted from components
- **Design System**: CSS variables for consistent theming
- **Responsive Design**: Mobile-first approach
- **Accessibility**: Semantic HTML and ARIA labels

## Testing Considerations

- Health check endpoint for monitoring
- Deterministic time support for TTL testing
- Atomic view counting prevents race conditions
- Input validation prevents invalid data
- XSS protection in HTML rendering
- CORS configuration for cross-origin requests

## Future Enhancements

Potential features to add:
- User authentication
- Paste editing
- Syntax highlighting for code
- Paste categories/tags
- Search functionality
- Analytics dashboard
- Rate limiting
- Custom URLs
- Password protection
- File upload support
