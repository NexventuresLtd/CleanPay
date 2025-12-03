# CleanPay - Quick Start Guide

## 🚀 Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL 14+ (optional for development)
- Git

---

## Backend Setup

### 1. Navigate to backend directory

```powershell
cd backend
```

### 2. Create virtual environment

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

### 3. Install dependencies

```powershell
pip install -r requirements.txt
```

### 4. Configure environment

The `.env` file is already created with development settings. For production, update with real values.

### 5. Run migrations

```powershell
python manage.py makemigrations
python manage.py migrate
```

### 6. Create default roles

```powershell
python manage.py shell
```

Then in the Python shell:

```python
from accounts.models import Role

roles = [
    {'name': 'admin', 'display_name': 'Administrator', 'description': 'Full system access'},
    {'name': 'finance_manager', 'display_name': 'Finance Manager', 'description': 'Payment oversight and reporting'},
    {'name': 'accountant', 'display_name': 'Accountant', 'description': 'Transaction processing and reconciliation'},
    {'name': 'customer_service', 'display_name': 'Customer Service', 'description': 'Customer support and dispute resolution'},
    {'name': 'customer', 'display_name': 'Customer', 'description': 'Self-service payment portal'},
]

for role_data in roles:
    Role.objects.get_or_create(
        name=role_data['name'],
        defaults={
            'display_name': role_data['display_name'],
            'description': role_data['description']
        }
    )

print('Roles created successfully!')
exit()
```

### 7. Create superuser

```powershell
python manage.py createsuperuser
```

### 8. Run development server

```powershell
python manage.py runserver
```

The backend should now be running at `http://localhost:8000`

---

## Frontend Setup

### 1. Navigate to frontend directory

```powershell
cd ..\frontend
```

### 2. Install dependencies

```powershell
pnpm install
```

### 3. Run development server

```powershell
pnpm dev
```

The frontend should now be running at `http://localhost:5173`

---

## 🔐 Test the Authentication API

### Register a new user

```powershell
curl -X POST http://localhost:8000/api/v1/auth/register/register/ `
  -H "Content-Type: application/json" `
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "password_confirm": "SecurePass123!",
    "first_name": "John",
    "last_name": "Doe"
  }'
```

### Login

```powershell
curl -X POST http://localhost:8000/api/v1/auth/login/ `
  -H "Content-Type: application/json" `
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

This will return access and refresh tokens. Save the access token for authenticated requests.

### Get current user profile

```powershell
curl -X GET http://localhost:8000/api/v1/users/me/ `
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 📚 API Documentation

Once the backend is running, visit:

- **Swagger UI**: http://localhost:8000/api/docs/
- **API Schema**: http://localhost:8000/api/schema/
- **Django Admin**: http://localhost:8000/admin/

---

## 🗂️ Project Structure

```
Clean Pay/
├── backend/                 # Django REST API
│   ├── core/               # Project settings
│   ├── accounts/           # User authentication & management ✅
│   ├── customers/          # Customer management ⏸️
│   ├── payments/           # Payment processing ⏸️
│   ├── invoices/           # Invoice management ⏸️
│   ├── transactions/       # Transaction tracking ⏸️
│   ├── notifications/      # Email/SMS notifications ⏸️
│   └── requirements.txt    # Python dependencies
│
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── contexts/       # React contexts
│   │   └── utils/          # Utility functions
│   └── package.json
│
├── Implementation_Plan.md  # Detailed implementation plan
├── FEATURE_TRACKING.md    # Feature implementation tracking
└── Features.md            # Complete feature list
```

---

## ✅ Current Implementation Status

### Completed Features:

- ✅ Django project setup
- ✅ Custom User model with email authentication
- ✅ Role-based access control (RBAC)
- ✅ JWT authentication (login/logout/refresh)
- ✅ User registration
- ✅ Password reset workflow
- ✅ User profile management
- ✅ Audit logging
- ✅ API documentation (Swagger)
- ✅ CORS configuration
- ✅ REST API framework

### Next Steps:

1. Complete Customer Management backend
2. Set up React frontend with authentication
3. Implement Payment Processing
4. Implement Invoice Management
5. Add Reporting & Analytics

---

## 📝 Available API Endpoints

### Authentication

- `POST /api/v1/auth/register/register/` - Register new user
- `POST /api/v1/auth/login/` - User login
- `POST /api/v1/auth/logout/logout/` - User logout
- `POST /api/v1/auth/token/refresh/` - Refresh access token
- `POST /api/v1/auth/password-reset/request_reset/` - Request password reset
- `POST /api/v1/auth/password-reset/confirm_reset/` - Confirm password reset

### User Management

- `GET /api/v1/users/` - List all users (admin only)
- `POST /api/v1/users/` - Create new user (admin only)
- `GET /api/v1/users/{id}/` - Get user details
- `PATCH /api/v1/users/{id}/` - Update user
- `DELETE /api/v1/users/{id}/` - Delete user (admin only)
- `GET /api/v1/users/me/` - Get current user profile
- `PATCH /api/v1/users/update_profile/` - Update current user profile
- `POST /api/v1/users/change_password/` - Change password
- `PATCH /api/v1/users/{id}/update_role/` - Update user role (admin only)

### Roles

- `GET /api/v1/roles/` - List all roles
- `POST /api/v1/roles/` - Create new role (admin only)
- `GET /api/v1/roles/{id}/` - Get role details
- `PATCH /api/v1/roles/{id}/` - Update role (admin only)
- `DELETE /api/v1/roles/{id}/` - Delete role (admin only)

### Audit Logs

- `GET /api/v1/audit-logs/` - List audit logs (admin only)
- `GET /api/v1/audit-logs/{id}/` - Get audit log details (admin only)

---

## 🛠️ Development Tips

### Running Migrations

```powershell
python manage.py makemigrations
python manage.py migrate
```

### Creating a Superuser

```powershell
python manage.py createsuperuser
```

### Running Tests

```powershell
python manage.py test
```

### Checking Code Quality

```powershell
flake8 .
black .
```

### Database Shell

```powershell
python manage.py dbshell
```

### Python Shell

```powershell
python manage.py shell
```

---

## 🐛 Troubleshooting

### Issue: ModuleNotFoundError

**Solution**: Make sure you've activated the virtual environment and installed dependencies:

```powershell
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### Issue: Database errors

**Solution**: Run migrations:

```powershell
python manage.py makemigrations
python manage.py migrate
```

### Issue: CORS errors in frontend

**Solution**: Check that `CORS_ALLOWED_ORIGINS` in `.env` includes your frontend URL (default: http://localhost:5173)

### Issue: JWT token errors

**Solution**: Make sure you're including the token in the Authorization header:

```
Authorization: Bearer <your_access_token>
```

---

## 📞 Support

For issues or questions:

1. Check the `Implementation_Plan.md` for detailed architecture
2. Check the `FEATURE_TRACKING.md` for feature status
3. Review the API documentation at http://localhost:8000/api/docs/

---

## 🎯 Next Implementation Tasks

See `FEATURE_TRACKING.md` for the complete implementation roadmap.

**Immediate priorities:**

1. Install dependencies and run the backend
2. Test authentication APIs
3. Create customer management models
4. Set up React authentication UI
5. Implement payment processing backend

---

**Happy Coding! 🚀**
