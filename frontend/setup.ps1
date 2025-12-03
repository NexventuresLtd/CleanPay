# CleanPay Frontend - Quick Setup Script
# Run this script to install all required dependencies

Write-Host "🚀 CleanPay Frontend Setup" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan
Write-Host ""

# Check if pnpm is installed
if (Get-Command pnpm -ErrorAction SilentlyContinue) {
    Write-Host "✓ pnpm found" -ForegroundColor Green
    $packageManager = "pnpm"
} elseif (Get-Command npm -ErrorAction SilentlyContinue) {
    Write-Host "⚠ pnpm not found, using npm" -ForegroundColor Yellow
    $packageManager = "npm"
} else {
    Write-Host "✗ No package manager found. Please install Node.js" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan
Write-Host ""

# Core dependencies
Write-Host "Installing core dependencies..." -ForegroundColor Yellow
& $packageManager add axios react-router-dom

# Form handling
Write-Host "Installing form handling..." -ForegroundColor Yellow
& $packageManager add react-hook-form zod @hookform/resolvers

# Date handling
Write-Host "Installing date utilities..." -ForegroundColor Yellow
& $packageManager add date-fns

# Utilities
Write-Host "Installing utilities..." -ForegroundColor Yellow
& $packageManager add clsx

# Dev dependencies
Write-Host "Installing dev dependencies..." -ForegroundColor Yellow
& $packageManager add -D @types/node

Write-Host ""
Write-Host "✓ Basic dependencies installed!" -ForegroundColor Green
Write-Host ""

# Ask for UI framework
Write-Host "Would you like to install a UI framework? (optional)" -ForegroundColor Cyan
Write-Host "1. Material-UI (MUI)" -ForegroundColor White
Write-Host "2. Ant Design" -ForegroundColor White
Write-Host "3. Chakra UI" -ForegroundColor White
Write-Host "4. Skip (use custom components)" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Enter choice (1-4)"

switch ($choice) {
    "1" {
        Write-Host "Installing Material-UI..." -ForegroundColor Yellow
        & $packageManager add @mui/material @mui/icons-material @emotion/react @emotion/styled
    }
    "2" {
        Write-Host "Installing Ant Design..." -ForegroundColor Yellow
        & $packageManager add antd
    }
    "3" {
        Write-Host "Installing Chakra UI..." -ForegroundColor Yellow
        & $packageManager add @chakra-ui/react @chakra-ui/icons @emotion/react @emotion/styled framer-motion
    }
    "4" {
        Write-Host "Skipping UI framework installation" -ForegroundColor Yellow
    }
    default {
        Write-Host "Invalid choice. Skipping UI framework installation" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Would you like to install optional dependencies? (Y/N)" -ForegroundColor Cyan
$installOptional = Read-Host

if ($installOptional -eq "Y" -or $installOptional -eq "y") {
    Write-Host ""
    Write-Host "Installing optional dependencies..." -ForegroundColor Yellow
    
    # Charts
    & $packageManager add recharts
    
    # Notifications
    & $packageManager add react-hot-toast
    
    # State management
    & $packageManager add zustand
    
    # PDF generation
    & $packageManager add jspdf jspdf-autotable
    
    # Payment processing
    & $packageManager add @stripe/stripe-js @stripe/react-stripe-js
    
    Write-Host "✓ Optional dependencies installed!" -ForegroundColor Green
}

Write-Host ""
Write-Host "🔧 Setting up environment file..." -ForegroundColor Cyan

if (Test-Path ".env.local") {
    Write-Host "⚠ .env.local already exists" -ForegroundColor Yellow
} else {
    Copy-Item ".env.example" ".env.local"
    Write-Host "✓ Created .env.local from template" -ForegroundColor Green
}

Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Edit .env.local to configure API endpoint" -ForegroundColor White
Write-Host "2. Run: $packageManager dev" -ForegroundColor White
Write-Host "3. Open: http://localhost:5173" -ForegroundColor White
Write-Host ""
Write-Host "📚 See SETUP_GUIDE.md for detailed documentation" -ForegroundColor Cyan
Write-Host ""
