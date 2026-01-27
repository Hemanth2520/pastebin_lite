# Quick Start Development Script
# This script helps you get started with local development

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Pastebin-Lite Development Setup" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Check if MongoDB is needed
Write-Host "IMPORTANT: MongoDB Setup Required" -ForegroundColor Yellow
Write-Host ""
Write-Host "This application requires MongoDB. You have two options:" -ForegroundColor White
Write-Host ""
Write-Host "Option 1: MongoDB Atlas (Recommended - Cloud-based)" -ForegroundColor Green
Write-Host "  1. Go to https://www.mongodb.com/cloud/atlas" -ForegroundColor White
Write-Host "  2. Create a free account and cluster" -ForegroundColor White
Write-Host "  3. Get your connection string" -ForegroundColor White
Write-Host "  4. Update backend/.env with your connection string" -ForegroundColor White
Write-Host ""
Write-Host "Option 2: Local MongoDB" -ForegroundColor Green
Write-Host "  1. Install MongoDB Community Edition" -ForegroundColor White
Write-Host "  2. Start MongoDB service" -ForegroundColor White
Write-Host "  3. The default connection string is already in backend/.env" -ForegroundColor White
Write-Host ""

$continue = Read-Host "Have you set up MongoDB? (y/n)"

if ($continue -ne "y") {
    Write-Host ""
    Write-Host "Please set up MongoDB first, then run this script again." -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "Starting development servers..." -ForegroundColor Cyan
Write-Host ""

# Start backend in a new terminal
Write-Host "Starting backend server on http://localhost:5000..." -ForegroundColor Green
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; npm run dev"

# Wait a bit for backend to start
Start-Sleep -Seconds 3

# Start frontend in a new terminal
Write-Host "Starting frontend server on http://localhost:5173..." -ForegroundColor Green
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\client'; npm run dev"

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Development servers are starting!" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend:  http://localhost:5000" -ForegroundColor Green
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Green
Write-Host ""
Write-Host "Check the new terminal windows for server output." -ForegroundColor Yellow
Write-Host "Press Ctrl+C in each terminal to stop the servers." -ForegroundColor Yellow
Write-Host ""
