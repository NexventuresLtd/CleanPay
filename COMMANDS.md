# 🚀 CleanPay - Quick Command Reference

Quick reference for common commands used in CleanPay development.

---

## 📁 Navigation

```powershell
# Navigate to backend
cd "c:\Users\mbric\Documents\Sook\NexVentures Projects\Clean Pay\backend"

# Navigate to frontend
cd "c:\Users\mbric\Documents\Sook\NexVentures Projects\Clean Pay\frontend"

# Navigate to project root
cd "c:\Users\mbric\Documents\Sook\NexVentures Projects\Clean Pay"
```

---

## 🔧 Backend Commands

### Server Management

```powershell
# Start development server
cd backend
uv run python manage.py runserver

# Start on specific port
uv run python manage.py runserver 8001

# Start and allow external connections
uv run python manage.py runserver 0.0.0.0:8000
```

### Database Commands

```powershell
cd backend

# Make migrations
uv run python manage.py makemigrations

# Apply migrations
uv run python manage.py migrate

# Create superuser
uv run python manage.py createsuperuser

# Show migrations status
uv run python manage.py showmigrations

# Reset database (DANGER!)
uv run python manage.py flush
```

### Django Shell & Management

```powershell
cd backend

# Open Django shell
uv run python manage.py shell

# Open database shell
uv run python manage.py dbshell

# Create new app
uv run python manage.py startapp appname

# Collect static files
uv run python manage.py collectstatic
```

### Testing

```powershell
cd backend

# Run all tests
uv run python manage.py test

# Run specific app tests
uv run python manage.py test accounts

# Run with verbosity
uv run python manage.py test --verbosity=2

# Run with coverage
uv run coverage run --source='.' manage.py test
uv run coverage report
uv run coverage html
```

### User Management (via shell)

```powershell
cd backend
uv run python manage.py shell

# In Python shell:
from accounts.models import User, Role

# Create admin user
admin_role = Role.objects.get(name='admin')
user = User.objects.create_user(
    email='admin@cleanpay.com',
    password='SecurePass123!',
    first_name='Admin',
    last_name='User',
    role=admin_role
)

# List all users
User.objects.all()

# Get user by email
user = User.objects.get(email='admin@cleanpay.com')

# Update user
user.first_name = 'Updated'
user.save()

# Delete user (soft delete)
user.delete()
```

### View Logs

```powershell
cd backend

# View recent audit logs (in shell)
uv run python manage.py shell
from accounts.models import AuditLog
AuditLog.objects.all().order_by('-timestamp')[:10]
```

---

## ⚛️ Frontend Commands

### Development Server

```powershell
cd frontend

# Start dev server (Vite)
pnpm dev

# Start on specific port
pnpm dev --port 3000

# Open browser automatically
pnpm dev --open

# Show network address
pnpm dev --host
```

### Package Management

```powershell
cd frontend

# Install all dependencies
pnpm install

# Add a package
pnpm add package-name

# Add dev dependency
pnpm add -D package-name

# Remove package
pnpm remove package-name

# Update all packages
pnpm update

# Check outdated packages
pnpm outdated

# Clean install (remove node_modules and reinstall)
Remove-Item -Recurse -Force node_modules
pnpm install
```

### Build & Preview

```powershell
cd frontend

# Build for production
pnpm build

# Preview production build
pnpm preview

# Type check only (no build)
pnpm tsc --noEmit
```

### Code Quality

```powershell
cd frontend

# Run linter
pnpm lint

# Fix linting issues
pnpm lint --fix

# Format code with Prettier (if configured)
pnpm format
```

### Testing

```powershell
cd frontend

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run tests in UI mode
pnpm test:ui
```

---

## 🔄 Git Commands

```powershell
# Check status
git status

# Create new branch
git checkout -b feature/branch-name

# Stage changes
git add .
git add filename

# Commit changes
git commit -m "Description of changes"

# Push to remote
git push origin branch-name

# Pull latest changes
git pull origin main

# View commit history
git log --oneline

# View changes
git diff

# Discard local changes
git checkout -- filename
git restore filename

# Switch branches
git checkout main
git checkout feature/branch-name

# Merge branch
git checkout main
git merge feature/branch-name

# Delete branch
git branch -d feature/branch-name
```

---

## 🛠️ Useful One-Liners

### Backend

```powershell
# Create migrations and migrate in one command
cd backend; uv run python manage.py makemigrations; uv run python manage.py migrate

# Create superuser non-interactively
uv run python manage.py createsuperuser --email admin@cleanpay.com --noinput

# Reset migrations (DANGER - development only!)
cd backend; Remove-Item -Recurse accounts/migrations; uv run python manage.py makemigrations; uv run python manage.py migrate
```

### Frontend

```powershell
# Install dependencies and start dev server
cd frontend; pnpm install; pnpm dev

# Clean build
cd frontend; Remove-Item -Recurse dist; pnpm build

# Update all dependencies to latest
cd frontend; pnpm update --latest
```

### Full Stack

```powershell
# Start both backend and frontend (requires 2 terminals)
# Terminal 1:
cd "c:\Users\mbric\Documents\Sook\NexVentures Projects\Clean Pay\backend"; uv run python manage.py runserver

# Terminal 2:
cd "c:\Users\mbric\Documents\Sook\NexVentures Projects\Clean Pay\frontend"; pnpm dev
```

---

## 🐛 Troubleshooting Commands

### Backend Issues

```powershell
# Reset database (removes all data!)
cd backend
uv run python manage.py flush

# Recreate all migrations
cd backend
Remove-Item -Recurse -Force */migrations/0*.py
uv run python manage.py makemigrations
uv run python manage.py migrate

# Check for Django issues
cd backend
uv run python manage.py check

# Show Django version
uv run python manage.py version
```

### Frontend Issues

```powershell
# Clear Vite cache
cd frontend
Remove-Item -Recurse -Force node_modules/.vite

# Clear all caches and reinstall
cd frontend
Remove-Item -Recurse -Force node_modules
Remove-Item -Force pnpm-lock.yaml
pnpm install

# Check for TypeScript errors
cd frontend
pnpm tsc --noEmit
```

### Port Already in Use

```powershell
# Find process using port 8000 (backend)
netstat -ano | findstr :8000

# Kill process by PID
taskkill /PID <PID> /F

# Find process using port 5173 (frontend)
netstat -ano | findstr :5173

# Kill process by PID
taskkill /PID <PID> /F
```

---

## 📊 Database Inspection

```powershell
cd backend

# Open Django shell
uv run python manage.py shell

# Useful queries in shell:
from accounts.models import User, Role, AuditLog

# Count users
User.objects.count()

# List all emails
[u.email for u in User.objects.all()]

# Find users by role
Role.objects.get(name='admin').user_set.all()

# Recent audit logs
AuditLog.objects.order_by('-timestamp')[:10]

# Failed login attempts
AuditLog.objects.filter(action='login', metadata__success=False)
```

---

## 🔐 Environment Variables

### Backend (.env)

```powershell
# View current environment
cd backend
Get-Content .env

# Edit environment
notepad .env
```

### Frontend (.env.local)

```powershell
# View current environment
cd frontend
Get-Content .env.local

# Edit environment
notepad .env.local
```

---

## 📝 API Testing with curl (PowerShell)

### Register User

```powershell
$body = @{
    email = "test@example.com"
    password = "SecurePass123!"
    password_confirm = "SecurePass123!"
    first_name = "Test"
    last_name = "User"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8000/api/v1/auth/register/" -Method Post -Body $body -ContentType "application/json"
```

### Login

```powershell
$body = @{
    email = "test@example.com"
    password = "SecurePass123!"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:8000/api/v1/auth/login/" -Method Post -Body $body -ContentType "application/json"
$response
```

### Get Current User (with token)

```powershell
$token = "your-access-token-here"

$headers = @{
    "Authorization" = "Bearer $token"
}

Invoke-RestMethod -Uri "http://localhost:8000/api/v1/auth/users/me/" -Method Get -Headers $headers
```

### Refresh Token

```powershell
$body = @{
    refresh = "your-refresh-token-here"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8000/api/v1/auth/token/refresh/" -Method Post -Body $body -ContentType "application/json"
```

---

## 🎨 Frontend URLs (when dev server running)

```
http://localhost:5173              # Home page
http://localhost:5173/login        # Login page (to be created)
http://localhost:5173/register     # Register page (to be created)
http://localhost:5173/dashboard    # Dashboard (to be created)
http://localhost:5173/customers    # Customers page (to be created)
http://localhost:5173/invoices     # Invoices page (to be created)
http://localhost:5173/payments     # Payments page (to be created)
```

## 🔗 Backend URLs (when server running)

```
http://localhost:8000/admin/                    # Django admin panel
http://localhost:8000/api/v1/auth/login/        # Login endpoint
http://localhost:8000/api/v1/auth/register/     # Register endpoint
http://localhost:8000/api/v1/auth/users/        # Users list
http://localhost:8000/api/v1/auth/users/me/     # Current user
http://localhost:8000/api/v1/auth/roles/        # Roles list
http://localhost:8000/api/v1/auth/audit-logs/   # Audit logs
```

---

## 📚 Documentation Files

```powershell
# Open documentation files
notepad "IMPLEMENTATION_PLAN.md"
notepad "FEATURE_TRACKING.md"
notepad "CURRENT_STATUS.md"
notepad "WHERE_WE_ARE.md"
notepad "QUICK_START.md"
notepad "frontend\SETUP_GUIDE.md"
```

---

## 💾 Backup & Restore

### Backup Database

```powershell
cd backend
uv run python manage.py dumpdata > backup.json

# Backup specific app
uv run python manage.py dumpdata accounts > accounts_backup.json
```

### Restore Database

```powershell
cd backend
uv run python manage.py loaddata backup.json
```

---

## 🔥 Quick Setup for New Developer

```powershell
# 1. Clone/Navigate to project
cd "c:\Users\mbric\Documents\Sook\NexVentures Projects\Clean Pay"

# 2. Backend Setup
cd backend
uv pip install -r requirements.txt
uv run python manage.py migrate
uv run python manage.py createsuperuser
uv run python manage.py runserver

# 3. Frontend Setup (in new terminal)
cd frontend
.\setup.ps1
pnpm dev

# 4. Access the app
# Backend: http://localhost:8000
# Frontend: http://localhost:5173
# Admin: http://localhost:8000/admin
```

---

**Pro Tip**: Bookmark this file for quick reference! 🚀
