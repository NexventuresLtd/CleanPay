# IsukuPay Login Guide

## Overview
IsukuPay supports **multiple login methods** depending on your role:
- **Staff/Admin**: Email + Password
- **Collectors**: Email + Password  
- **Customers**: Email + Password **OR** Card Number + Password

## Login Credentials

### System Administrator
**Access:** Full system control, manage multiple companies
- **Email:** `admin@isukupay.rw`
- **Password:** `admin123`
- **Portal:** System Admin Dashboard

---

### Company Administrator (C&GS Ltd)
**Access:** Manage company operations, customers, collectors, schedules
- **Email:** `admin@cgs.rw`
- **Password:** `admin123`
- **Portal:** Company Dashboard

---

### Collectors (3 accounts)
**Access:** Mobile app for waste collection operations

| Name | Email | Password |
|------|-------|----------|
| Paul Bizimana | `paul.bizimana@cgs.rw` | `collector123` |
| Joseph Hakizimana | `joseph.hakizimana@cgs.rw` | `collector123` |
| Patrick Nsengimana | `patrick.nsengimana@cgs.rw` | `collector123` |

**Portal:** Collector Dashboard

---

### Customers (10 accounts)
**Access:** View collection schedule, check prepaid balance, track history

#### Login Method 1: Email + Password
| Name | Email | Card Number | Password |
|------|-------|-------------|----------|
| Jean Uwimana | `jean.uwimana@customer.rw` | `88927987` | `customer123` |
| Marie Mukamana | `marie.mukamana@customer.rw` | `98659539` | `customer123` |
| Pierre Habimana | `pierre.habimana@customer.rw` | `03663789` | `customer123` |
| Grace Mutesi | `grace.mutesi@customer.rw` | `25524940` | `customer123` |
| Emmanuel Niyonzima | `emmanuel.niyonzima@customer.rw` | `07173515` | `customer123` |
| Claudine Umurerwa | `claudine.umurerwa@customer.rw` | `65858957` | `customer123` |
| David Nkurunziza | `david.nkurunziza@customer.rw` | `67654022` | `customer123` |
| Diane Uwase | `diane.uwase@customer.rw` | `49254082` | `customer123` |
| Eric Kayinamura | `eric.kayinamura@customer.rw` | `07856436` | `customer123` |
| Francine Murekatete | `francine.murekatete@customer.rw` | `04690558` | `customer123` |

#### Login Method 2: Card Number + Password
Customers can also login using their 8-digit IsukuPay card number instead of email:
- **Card Number:** Any card number from the table above
- **Password:** `customer123`

**Portal:** Customer Portal

---

## Frontend Login Page Features

### Login Method Toggle
The login page now has a toggle to switch between:
1. **Email Login** - For staff, collectors, and customers (using email)
2. **Card Login** - For customers only (using 8-digit card number)

### Access by Role

| Role | Login Method | Default Landing Page |
|------|--------------|---------------------|
| System Admin | Email + Password | `/system-admin` |
| Company Admin | Email + Password | `/dashboard` |
| Finance Manager | Email + Password | `/dashboard` |
| Customer Service | Email + Password | `/dashboard` |
| Collector | Email + Password | `/collector` |
| Customer | Email **OR** Card + Password | `/portal` |

---

## Testing Scenarios

### 1. Test System Admin Access
```
Email: admin@isukupay.rw
Password: admin123
Expected: Access to System Admin Dashboard with company management
```

### 2. Test Company Admin Access
```
Email: admin@cgs.rw
Password: admin123
Expected: Access to Company Dashboard with full operations
```

### 3. Test Collector Access
```
Email: paul.bizimana@cgs.rw
Password: collector123
Expected: Access to Collector Portal with route/schedule info
```

### 4. Test Customer Email Login
```
Email: jean.uwimana@customer.rw
Password: customer123
Expected: Access to Customer Portal with schedule and balance
```

### 5. Test Customer Card Login
```
Card Number: 88927987
Password: customer123
Expected: Access to Customer Portal (same as email login)
```

---

## Separate Login Pages?

### Current Setup: **Single Unified Login Page**
- One login page with method toggle (Email / Card)
- Automatic role-based redirect after authentication
- Simpler for users and easier to maintain

### Alternative: **Separate Login Pages**

If you want separate login pages for different user types:

#### Option A: Role-Specific Subdomains
- `admin.isukupay.rw` - Admin/Staff login
- `collector.isukupay.rw` - Collector login  
- `portal.isukupay.rw` or `customer.isukupay.rw` - Customer login

#### Option B: URL Paths
- `/login` - Main login (default)
- `/login/admin` - Admin/Staff only
- `/login/collector` - Collector only
- `/login/customer` - Customer card login

#### Option C: Landing Page with Role Selection
- Landing page with "Login as: Admin | Collector | Customer"
- Each button routes to role-specific login form

### Recommendation: **Keep Current Single Login**
**Pros:**
- ✅ One URL to remember
- ✅ Flexible - users can choose their method
- ✅ Less maintenance
- ✅ Backend already handles role-based routing

**Cons:**
- ❌ Slight confusion for first-time users
- ❌ Collectors might not realize they have email accounts

**If you want separate logins**, let me know and I can implement Option B (URL paths) as it's the simplest to add.

---

## Security Notes

⚠️ **IMPORTANT:** These are **development/testing credentials**. 

Before production:
1. Change all default passwords
2. Implement password complexity requirements
3. Add email verification workflow
4. Enable MFA for admin accounts
5. Set up password reset functionality
6. Add rate limiting on login endpoints
7. Implement account lockout after failed attempts

---

## Database Summary

- **Total Users:** 15 (1 system admin, 1 company admin, 3 collectors, 10 customers)
- **Companies:** 1 (C&GS Ltd)
- **Service Areas:** 3 (Kicukiro Zone A, Kicukiro Zone B, Gasabo Zone A)
- **All users have active status and verified emails**
- **All customers have prepaid balances between 5-20 collections**
