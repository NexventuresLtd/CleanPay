# CleanPay Frontend - Setup & Development Guide

Complete guide for CleanPay React + TypeScript + Vite frontend application.

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── common/          # Shared components (Button, Input, Modal, Table, etc.)
│   │   ├── auth/            # Authentication components (LoginForm, RegisterForm)
│   │   ├── customer/        # Customer-related components
│   │   ├── invoice/         # Invoice-related components
│   │   ├── payment/         # Payment-related components
│   │   └── dashboard/       # Dashboard widgets & charts
│   │
│   ├── pages/               # Page components (routes)
│   │   ├── auth/            # LoginPage, RegisterPage, ResetPasswordPage
│   │   ├── dashboard/       # Main dashboard
│   │   ├── customers/       # Customer management pages
│   │   ├── invoices/        # Invoice management pages
│   │   ├── payments/        # Payment processing pages
│   │   ├── transactions/    # Transaction pages
│   │   ├── reports/         # Reporting pages
│   │   └── settings/        # User & system settings
│   │
│   ├── services/            # API services layer
│   │   ├── api.ts           # Axios instance with interceptors
│   │   ├── authService.ts   # Authentication API calls
│   │   ├── userService.ts   # User management API calls
│   │   ├── customerService.ts  # Customer API calls
│   │   ├── invoiceService.ts   # Invoice API calls
│   │   └── paymentService.ts   # Payment API calls
│   │
│   ├── types/               # TypeScript type definitions
│   │   ├── common.types.ts     # ApiResponse, PaginatedResponse, LoadingState
│   │   ├── auth.types.ts       # LoginCredentials, RegisterData, AuthTokens
│   │   ├── user.types.ts       # User, Role, AuditLog types
│   │   ├── customer.types.ts   # Customer, Address, PaymentMethod
│   │   ├── invoice.types.ts    # Invoice, InvoiceLineItem types
│   │   ├── payment.types.ts    # Transaction, Refund, Subscription
│   │   ├── transaction.types.ts # TransactionRecord, Reconciliation
│   │   └── index.ts            # Export all types
│   │
│   ├── contexts/            # React Context providers
│   │   ├── AuthContext.tsx  # Authentication state management
│   │   └── ThemeContext.tsx # UI theme (light/dark mode)
│   │
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuth.ts       # Authentication hook
│   │   ├── useApi.ts        # API calling with loading states
│   │   └── usePagination.ts # Pagination logic
│   │
│   ├── utils/               # Utility functions
│   │   ├── formatters.ts    # Format dates, currency, phone numbers
│   │   ├── validators.ts    # Form validation functions
│   │   ├── constants.ts     # App constants & enums
│   │   └── helpers.ts       # General helper functions
│   │
│   ├── styles/              # Global styles
│   │   ├── variables.css    # CSS custom properties
│   │   └── global.css       # Global styles
│   │
│   ├── App.tsx              # Main app component with routes
│   └── main.tsx             # Application entry point
│
├── public/                  # Static assets
├── .env.local               # Local environment variables
├── .env.example             # Environment variables template
├── package.json             # Dependencies & scripts
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
└── README.md                # This file
```

## 🚀 Quick Start

### 1. Prerequisites

- **Node.js** 18.x or higher
- **pnpm** (recommended) or npm
- Backend API running on `http://localhost:8000`

### 2. Install Dependencies

```bash
cd frontend
pnpm install
```

Or with npm:

```bash
npm install
```

### 3. Install Additional Dependencies

```bash
# Essential dependencies
pnpm add axios react-router-dom

# UI Framework (choose one)
pnpm add @mui/material @mui/icons-material @emotion/react @emotion/styled
# OR use Ant Design
pnpm add antd
# OR use Chakra UI
pnpm add @chakra-ui/react @chakra-ui/icons @emotion/react @emotion/styled framer-motion

# Form handling
pnpm add react-hook-form zod @hookform/resolvers

# Date handling
pnpm add date-fns

# Charts & visualization
pnpm add recharts

# Notifications
pnpm add react-hot-toast

# State management (optional)
pnpm add zustand
# OR Redux Toolkit
pnpm add @reduxjs/toolkit react-redux

# PDF generation
pnpm add jspdf jspdf-autotable

# Payment processing
pnpm add @stripe/stripe-js @stripe/react-stripe-js

# Utilities
pnpm add clsx

# Dev dependencies
pnpm add -D @types/node
```

### 4. Environment Configuration

Copy `.env.example` to `.env.local`:

```bash
# Windows PowerShell
Copy-Item .env.example .env.local
```

Edit `.env.local`:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_APP_NAME=CleanPay
VITE_APP_VERSION=1.0.0
VITE_ENABLE_ANALYTICS=false
```

### 5. Start Development Server

```bash
pnpm dev
```

Frontend will run at: `http://localhost:5173`

## 📝 Development Guidelines

### Component Architecture

#### 1. Component Structure

```typescript
// components/common/Button/Button.tsx
import React from "react";
import styles from "./Button.module.css";

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  type = "button",
  fullWidth = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${styles.button} 
        ${styles[variant]} 
        ${styles[size]}
        ${fullWidth ? styles.fullWidth : ""}
      `}
    >
      {loading ? "Loading..." : children}
    </button>
  );
};

// components/common/Button/index.ts
export { Button } from "./Button";
export type { ButtonProps } from "./Button";
```

#### 2. Form Component Pattern

```typescript
// components/auth/LoginForm.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { LoginCredentials } from "../../types";
import { Button } from "../common/Button";
import { Input } from "../common/Input";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

interface LoginFormProps {
  onSubmit: (data: LoginCredentials) => Promise<void>;
  loading?: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, loading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Email"
        type="email"
        {...register("email")}
        error={errors.email?.message}
      />
      <Input
        label="Password"
        type="password"
        {...register("password")}
        error={errors.password?.message}
      />
      <Button type="submit" loading={loading} fullWidth>
        Login
      </Button>
    </form>
  );
};
```

### Service Layer Pattern

```typescript
// services/customerService.ts
import api, { handleApiError } from "./api";
import type { Customer, CustomerCreateData, PaginatedResponse } from "../types";

const customerService = {
  // Get all customers with pagination
  getAll: async (
    page = 1,
    pageSize = 10
  ): Promise<PaginatedResponse<Customer>> => {
    try {
      const response = await api.get<PaginatedResponse<Customer>>(
        "/customers/",
        {
          params: { page, page_size: pageSize },
        }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get single customer
  getById: async (id: string): Promise<Customer> => {
    try {
      const response = await api.get<Customer>(`/customers/${id}/`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Create customer
  create: async (data: CustomerCreateData): Promise<Customer> => {
    try {
      const response = await api.post<Customer>("/customers/", data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Update customer
  update: async (id: string, data: Partial<Customer>): Promise<Customer> => {
    try {
      const response = await api.patch<Customer>(`/customers/${id}/`, data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Delete customer
  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/customers/${id}/`);
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

export default customerService;
```

### Custom Hooks Pattern

```typescript
// hooks/useCustomers.ts
import { useState, useEffect } from "react";
import customerService from "../services/customerService";
import type { Customer, ApiError } from "../types";

interface UseCustomersReturn {
  customers: Customer[];
  loading: boolean;
  error: ApiError | null;
  refetch: () => Promise<void>;
  totalCount: number;
  currentPage: number;
  setPage: (page: number) => void;
}

export const useCustomers = (
  initialPage = 1,
  pageSize = 10
): UseCustomersReturn => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalCount, setTotalCount] = useState(0);

  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await customerService.getAll(currentPage, pageSize);
      setCustomers(response.results);
      setTotalCount(response.count);
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [currentPage]);

  return {
    customers,
    loading,
    error,
    refetch: fetchCustomers,
    totalCount,
    currentPage,
    setPage: setCurrentPage,
  };
};
```

### Page Component Pattern

```typescript
// pages/customers/CustomersPage.tsx
import { useState } from "react";
import { useCustomers } from "../../hooks/useCustomers";
import { Button } from "../../components/common/Button";
import { Table } from "../../components/common/Table";
import { CustomerModal } from "../../components/customer/CustomerModal";
import type { Customer } from "../../types";

export const CustomersPage = () => {
  const {
    customers,
    loading,
    error,
    refetch,
    totalCount,
    currentPage,
    setPage,
  } = useCustomers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedCustomer(null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedCustomer(null);
    refetch();
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <div className="page-header">
        <h1>Customers</h1>
        <Button onClick={handleCreate}>Add Customer</Button>
      </div>

      <Table
        data={customers}
        columns={[
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
          { key: "phone", label: "Phone" },
          { key: "status", label: "Status" },
        ]}
        onRowClick={handleEdit}
        totalCount={totalCount}
        currentPage={currentPage}
        onPageChange={setPage}
      />

      {isModalOpen && (
        <CustomerModal customer={selectedCustomer} onClose={handleModalClose} />
      )}
    </div>
  );
};
```

## 🎨 Styling Options

### Option 1: CSS Modules (Recommended)

```css
/* Button.module.css */
.button {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
}

.primary {
  background-color: var(--color-primary);
  color: white;
}

.primary:hover {
  background-color: var(--color-primary-dark);
}

.secondary {
  background-color: var(--color-secondary);
  color: white;
}

.small {
  font-size: 0.875rem;
  padding: 0.375rem 0.75rem;
}

.medium {
  font-size: 1rem;
  padding: 0.5rem 1rem;
}

.large {
  font-size: 1.125rem;
  padding: 0.75rem 1.5rem;
}

.fullWidth {
  width: 100%;
}
```

```typescript
// Button.tsx
import styles from "./Button.module.css";

export const Button = ({ variant, size, fullWidth, children }) => {
  return (
    <button
      className={`
        ${styles.button} 
        ${styles[variant]} 
        ${styles[size]}
        ${fullWidth ? styles.fullWidth : ""}
      `}
    >
      {children}
    </button>
  );
};
```

### Option 2: Tailwind CSS

```typescript
export const Button = ({ variant, size, children }) => {
  const baseClasses = "font-medium rounded-md transition-all";
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-600 text-white hover:bg-gray-700",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };
  const sizeClasses = {
    small: "text-sm px-3 py-1.5",
    medium: "text-base px-4 py-2",
    large: "text-lg px-6 py-3",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
    >
      {children}
    </button>
  );
};
```

## 🔐 Authentication Implementation

### 1. Create AuthContext

```typescript
// contexts/AuthContext.tsx
import React, { createContext, useState, useEffect } from "react";
import authService from "../services/authService";
import type {
  User,
  AuthTokens,
  LoginCredentials,
  RegisterData,
} from "../types";

interface AuthContextType {
  user: User | null;
  tokens: AuthTokens | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user and tokens from localStorage on mount
    const storedUser = localStorage.getItem("user");
    const storedTokens = localStorage.getItem("tokens");

    if (storedUser && storedTokens) {
      setUser(JSON.parse(storedUser));
      setTokens(JSON.parse(storedTokens));
    }
    setLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const response = await authService.login(credentials);
    setUser(response.user);
    setTokens({ access: response.access, refresh: response.refresh });
    localStorage.setItem("user", JSON.stringify(response.user));
    localStorage.setItem(
      "tokens",
      JSON.stringify({
        access: response.access,
        refresh: response.refresh,
      })
    );
  };

  const register = async (data: RegisterData) => {
    const response = await authService.register(data);
    setUser(response.user);
    setTokens({ access: response.access, refresh: response.refresh });
    localStorage.setItem("user", JSON.stringify(response.user));
    localStorage.setItem(
      "tokens",
      JSON.stringify({
        access: response.access,
        refresh: response.refresh,
      })
    );
  };

  const logout = async () => {
    if (tokens?.refresh) {
      await authService.logout(tokens.refresh);
    }
    setUser(null);
    setTokens(null);
    localStorage.removeItem("user");
    localStorage.removeItem("tokens");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        tokens,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user && !!tokens,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
```

### 2. Create useAuth Hook

```typescript
// hooks/useAuth.ts
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
```

### 3. Create Protected Route

```typescript
// components/auth/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
}) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role.name)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};
```

### 4. Setup Routes

```typescript
// App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { LoginPage } from "./pages/auth/LoginPage";
import { DashboardPage } from "./pages/dashboard/DashboardPage";
import { CustomersPage } from "./pages/customers/CustomersPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/invoices" element={<InvoicesPage />} />
            <Route path="/payments" element={<PaymentsPage />} />
          </Route>

          {/* Role-based routes */}
          <Route
            element={
              <ProtectedRoute allowedRoles={["admin", "finance_manager"]} />
            }
          >
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
```

## 📂 File Naming Conventions

| Type                 | Pattern                        | Example                               |
| -------------------- | ------------------------------ | ------------------------------------- |
| **Components**       | PascalCase with folder         | `components/common/Button/Button.tsx` |
| **Component Styles** | ComponentName.module.css       | `Button.module.css`                   |
| **Component Tests**  | ComponentName.test.tsx         | `Button.test.tsx`                     |
| **Component Index**  | index.ts (re-export)           | `index.ts`                            |
| **Pages**            | PascalCase with Page suffix    | `LoginPage.tsx`                       |
| **Services**         | camelCase with Service suffix  | `authService.ts`                      |
| **Types**            | camelCase with .types suffix   | `auth.types.ts`                       |
| **Hooks**            | camelCase with use prefix      | `useAuth.ts`                          |
| **Utils**            | camelCase                      | `formatters.ts`                       |
| **Contexts**         | PascalCase with Context suffix | `AuthContext.tsx`                     |

## 🧪 Testing

### Setup Testing

```bash
pnpm add -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

### Example Test

```typescript
// components/common/Button/Button.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("renders children correctly", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText("Click me"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("is disabled when loading", () => {
    render(<Button loading>Click me</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
```

### Run Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

## 🏗️ Building for Production

```bash
# Build for production
pnpm build

# Preview production build
pnpm preview
```

Output will be in the `dist/` directory.

## 📊 Implementation Status

### ✅ Completed (100%)

- ✅ Project setup (Vite + React + TypeScript)
- ✅ Folder structure created (components, pages, services, types, etc.)
- ✅ TypeScript type definitions (all entities)
- ✅ API service layer (api.ts with interceptors)
- ✅ Auth service (login, register, logout, password reset)
- ✅ User service (CRUD, profile management)
- ✅ Environment configuration (.env.example, .env.local)

### 🚧 In Progress (30%)

- 🚧 Authentication context
- 🚧 Protected routes
- 🚧 Login/Register pages

### ⏸️ Pending (0%)

- ⏸️ Dashboard page
- ⏸️ Customer management UI
- ⏸️ Invoice management UI
- ⏸️ Payment processing UI
- ⏸️ Transaction pages
- ⏸️ Reports & analytics
- ⏸️ Settings pages
- ⏸️ Testing setup
- ⏸️ E2E tests

## 🔗 API Integration

All API calls use the configured Axios instance in `services/api.ts` with:

- Automatic JWT token injection
- Token refresh on 401 errors
- Centralized error handling
- Request/response interceptors

**Backend API**: `http://localhost:8000/api/v1`

See `../CURRENT_STATUS.md` for complete API documentation.

## 🛠️ Development Tools

- **Vite**: Lightning-fast build tool
- **TypeScript**: Type safety & IntelliSense
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **React DevTools**: Browser extension
- **Redux DevTools**: State debugging (if using Redux)

## 📚 Resources

- [React Docs](https://react.dev/)
- [TypeScript Docs](https://www.typescriptlang.org/)
- [Vite Docs](https://vitejs.dev/)
- [React Router Docs](https://reactrouter.com/)
- [Axios Docs](https://axios-http.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)

## 🎯 Next Steps

1. **Install dependencies**:

   ```bash
   pnpm add axios react-router-dom react-hook-form zod @hookform/resolvers date-fns
   ```

2. **Fix TypeScript imports**: Add `type` keyword for type-only imports in service files

3. **Create AuthContext**: Implement authentication state management

4. **Build LoginPage**: Create login UI with form validation

5. **Create Protected Routes**: Implement route guards

6. **Build Dashboard**: Create main dashboard with widgets

---

For detailed implementation plan, see `../IMPLEMENTATION_PLAN.md`  
For current status & progress, see `../CURRENT_STATUS.md`
