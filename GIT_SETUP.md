# Git Repository Setup Guide

This guide will help you initialize a Git repository and push your code to GitHub/GitLab/Bitbucket.

## Prerequisites

- Git installed on your system
- GitHub/GitLab/Bitbucket account

## Step 1: Initialize Git Repository

Open a terminal in the project root directory:

```bash
cd c:\Users\kaith\Downloads\pastebin_lite

# Initialize git repository
git init

# Check status
git status
```

## Step 2: Create .gitignore (Already Done)

The `.gitignore` file is already created and configured to exclude:
- `node_modules/`
- `.env` files
- Build artifacts
- Logs

## Step 3: Make Initial Commit

```bash
# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Complete Pastebin-Lite application

- Backend: Node.js + Express + MongoDB
- Frontend: React + Vite
- Separate deployments for frontend and backend
- Complete documentation included"

# Check commit
git log --oneline
```

## Step 4: Create Remote Repository

### GitHub
1. Go to https://github.com
2. Click "New repository"
3. Name: `pastebin-lite` (or your preferred name)
4. Description: "A Pastebin-like application with time-based expiry and view limits"
5. Choose "Public" (required for assignment submission)
6. **Do NOT** initialize with README, .gitignore, or license
7. Click "Create repository"

### GitLab
1. Go to https://gitlab.com
2. Click "New project"
3. Choose "Create blank project"
4. Project name: `pastebin-lite`
5. Visibility: Public
6. Uncheck "Initialize repository with a README"
7. Click "Create project"

### Bitbucket
1. Go to https://bitbucket.org
2. Click "Create repository"
3. Repository name: `pastebin-lite`
4. Access level: Public
5. Click "Create repository"

## Step 5: Connect Local to Remote

After creating the remote repository, you'll see instructions. Use these commands:

### For GitHub:
```bash
git remote add origin https://github.com/YOUR_USERNAME/pastebin-lite.git
git branch -M main
git push -u origin main
```

### For GitLab:
```bash
git remote add origin https://gitlab.com/YOUR_USERNAME/pastebin-lite.git
git branch -M main
git push -u origin main
```

### For Bitbucket:
```bash
git remote add origin https://bitbucket.org/YOUR_USERNAME/pastebin-lite.git
git branch -M main
git push -u origin main
```

## Step 6: Verify Push

1. Refresh your repository page
2. You should see all files and folders
3. Verify README.md is displayed

## Step 7: Add Repository Description (Optional)

### GitHub
1. Go to your repository
2. Click the gear icon next to "About"
3. Add description: "Pastebin-like app with TTL and view limits - MERN stack"
4. Add topics: `pastebin`, `mern`, `nodejs`, `react`, `mongodb`, `express`

### GitLab
1. Go to Settings → General
2. Update project description
3. Add tags

### Bitbucket
1. Go to Repository settings
2. Update description

## Common Git Commands

### Check Status
```bash
git status
```

### View Commit History
```bash
git log --oneline
```

### Make Changes and Commit
```bash
# After making changes
git add .
git commit -m "Description of changes"
git push
```

### Create a New Branch
```bash
git checkout -b feature-name
```

### Switch Branches
```bash
git checkout main
```

### Pull Latest Changes
```bash
git pull origin main
```

## Troubleshooting

### Problem: "fatal: remote origin already exists"
```bash
# Remove existing remote
git remote remove origin

# Add new remote
git remote add origin YOUR_REPO_URL
```

### Problem: Authentication Failed
```bash
# For GitHub, use Personal Access Token instead of password
# Generate token at: https://github.com/settings/tokens

# Or use SSH instead of HTTPS
git remote set-url origin git@github.com:YOUR_USERNAME/pastebin-lite.git
```

### Problem: Large Files
```bash
# If you accidentally committed large files
git rm --cached path/to/large/file
git commit -m "Remove large file"
git push
```

### Problem: Committed .env File
```bash
# Remove .env from git (but keep local file)
git rm --cached backend/.env
git rm --cached client/.env
git commit -m "Remove .env files from git"
git push

# Make sure .gitignore includes .env
```

## Best Practices

### Commit Messages
- Use clear, descriptive messages
- Start with a verb (Add, Fix, Update, Remove)
- Keep first line under 50 characters
- Add detailed description if needed

Examples:
```bash
git commit -m "Add view limit functionality to pastes"
git commit -m "Fix CORS issue in production deployment"
git commit -m "Update README with deployment instructions"
```

### Branching Strategy
For this assignment, working on `main` is fine. For larger projects:
```bash
# Create feature branch
git checkout -b feature/add-syntax-highlighting

# Make changes and commit
git add .
git commit -m "Add syntax highlighting for code pastes"

# Push feature branch
git push -u origin feature/add-syntax-highlighting

# Merge to main (via pull request)
```

### .gitignore Verification
Before committing, verify sensitive files are ignored:
```bash
# Check what will be committed
git status

# Should NOT see:
# - node_modules/
# - .env files
# - dist/ or build/ folders
```

## Repository Checklist

Before submission, verify:
- [ ] Repository is public
- [ ] README.md is at root
- [ ] No .env files committed
- [ ] No node_modules committed
- [ ] No secrets or credentials
- [ ] Clean commit history
- [ ] Repository description added
- [ ] All code is pushed

## Example Repository Structure

Your repository should look like this on GitHub/GitLab/Bitbucket:

```
pastebin-lite/
├── .gitignore
├── README.md
├── GET_STARTED.md
├── QUICK_REFERENCE.md
├── DEPLOYMENT.md
├── API_TESTING.md
├── PROJECT_STRUCTURE.md
├── SUBMISSION_CHECKLIST.md
├── GIT_SETUP.md
├── start-dev.ps1
├── backend/
│   ├── src/
│   ├── package.json
│   ├── .env.example
│   ├── .gitignore
│   └── vercel.json
└── client/
    ├── src/
    ├── public/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── .env.example
    ├── .gitignore
    └── vercel.json
```

## Next Steps

After pushing to Git:
1. ✅ Verify repository is public
2. ✅ Check README is displayed
3. ✅ Copy repository URL for submission
4. ✅ Proceed with deployment (see DEPLOYMENT.md)

## Quick Reference

```bash
# Initial setup
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_REPO_URL
git push -u origin main

# Daily workflow
git add .
git commit -m "Description"
git push

# Check status
git status
git log --oneline
```

---

**Your code is now version controlled and ready for deployment! 🎉**
