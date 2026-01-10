import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { LoginPage } from "./pages/auth/LoginPage";
import { ForgotPasswordPage } from "./pages/auth/ForgotPasswordPage";
import { DashboardPage } from "./pages/dashboard/DashboardPage";

// Customer Pages (Admin/Staff)
import CustomersPage from "./pages/customers/CustomersPage";
import CustomerDetailPage from "./pages/customers/CustomerDetailPage";
import CustomerFormPage from "./pages/customers/CustomerFormPage";

// Operations Pages (Admin/Staff)
import {
  ServiceAreasPage,
  ServiceAreaDetailPage,
  ServiceAreaFormPage,
  RoutesPage,
  RouteFormPage,
  CollectorsPage,
  CollectorDetailPage,
  CollectorFormPage,
  SchedulesPage,
  ScheduleFormPage,
} from "./pages/operations";

// System Admin Pages
import SystemAdminDashboard from "./pages/admin/SystemAdminDashboard";
import CompaniesPage from "./pages/admin/CompaniesPage";
import CompanyFormPage from "./pages/admin/CompanyFormPage";
import CompanyDetailPage from "./pages/admin/CompanyDetailPage";
import UsersManagementPage from "./pages/admin/UsersManagementPage";
import ReportsPage from "./pages/admin/ReportsPage";

// Dashboard Pages
import CompanyReportsPage from "./pages/dashboard/CompanyReportsPage";
import SettingsPage from "./pages/dashboard/SettingsPage";
import TransactionsPage from "./pages/transactions/TransactionsPage";

// System Admin Pages (continued)
import SystemAdminSettingsPage from "./pages/admin/SystemAdminSettingsPage";

// Customer Portal Pages
import { CustomerPortalDashboard } from "./pages/portal/CustomerPortalDashboard";
import { CustomerPortalTopUp } from "./pages/portal/CustomerPortalTopUp";
import { CustomerPortalPayments } from "./pages/portal/CustomerPortalPayments";
import { CustomerPortalSchedules } from "./pages/portal/CustomerPortalSchedules";
import { CustomerPortalProfile } from "./pages/portal/CustomerPortalProfile";
import CustomerPortalSettings from "./pages/portal/CustomerPortalSettings";

// Collector Portal Pages
import {
  CollectorPortalDashboard,
  CollectorPortalSchedules as CollectorSchedulesPage,
  CollectorPortalRoutes,
  CollectorPortalProfile,
} from "./pages/collector";

// Role-based route protection
import { StaffRoute } from "./components/auth/StaffRoute";
import { CustomerRoute } from "./components/auth/CustomerRoute";
import { CollectorRoute } from "./components/auth/CollectorRoute";
import LandingPage from "./pages/LandingPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          {/* <Route path="/register" element={<RegisterPage />} /> */}
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Staff/Admin Protected routes */}
          <Route element={<ProtectedRoute />}>
            {/* System Admin Routes */}
            <Route path="/system-admin" element={<SystemAdminDashboard />} />
            <Route path="/system-admin/companies" element={<CompaniesPage />} />
            <Route
              path="/system-admin/companies/new"
              element={<CompanyFormPage />}
            />
            <Route
              path="/system-admin/companies/:id"
              element={<CompanyDetailPage />}
            />
            <Route
              path="/system-admin/companies/:id/edit"
              element={<CompanyFormPage />}
            />
            <Route
              path="/system-admin/users"
              element={<UsersManagementPage />}
            />
            <Route path="/system-admin/reports" element={<ReportsPage />} />
            <Route
              path="/system-admin/settings"
              element={<SystemAdminSettingsPage />}
            />

            <Route element={<StaffRoute />}>
              {/* Dashboard */}
              <Route path="/dashboard" element={<DashboardPage />} />

              {/* Transactions */}
              <Route path="/transactions" element={<TransactionsPage />} />

              {/* Reports */}
              <Route path="/reports" element={<CompanyReportsPage />} />

              {/* Settings */}
              <Route path="/settings" element={<SettingsPage />} />

              {/* Customer Management */}
              <Route path="/customers" element={<CustomersPage />} />
              <Route path="/customers/new" element={<CustomerFormPage />} />
              <Route path="/customers/:id" element={<CustomerDetailPage />} />
              <Route
                path="/customers/:id/edit"
                element={<CustomerFormPage />}
              />

              {/* Operations */}
              <Route
                path="/operations/service-areas"
                element={<ServiceAreasPage />}
              />
              <Route
                path="/operations/service-areas/new"
                element={<ServiceAreaFormPage />}
              />
              <Route
                path="/operations/service-areas/:id"
                element={<ServiceAreaDetailPage />}
              />
              <Route
                path="/operations/service-areas/:id/edit"
                element={<ServiceAreaFormPage />}
              />
              <Route path="/operations/routes" element={<RoutesPage />} />
              <Route
                path="/operations/routes/new"
                element={<RouteFormPage />}
              />
              <Route
                path="/operations/routes/:id/edit"
                element={<RouteFormPage />}
              />
              <Route
                path="/operations/collectors"
                element={<CollectorsPage />}
              />
              <Route
                path="/operations/collectors/new"
                element={<CollectorFormPage />}
              />
              <Route
                path="/operations/collectors/:id"
                element={<CollectorDetailPage />}
              />
              <Route
                path="/operations/collectors/:id/edit"
                element={<CollectorFormPage />}
              />
              <Route path="/operations/schedules" element={<SchedulesPage />} />
              <Route
                path="/operations/schedules/new"
                element={<ScheduleFormPage />}
              />
              <Route
                path="/operations/schedules/:id/edit"
                element={<ScheduleFormPage />}
              />
            </Route>

            {/* Customer Portal Routes */}
            <Route element={<CustomerRoute />}>
              <Route path="/portal" element={<CustomerPortalDashboard />} />
              <Route path="/portal/topup" element={<CustomerPortalTopUp />} />
              <Route
                path="/portal/payments"
                element={<CustomerPortalPayments />}
              />
              <Route
                path="/portal/schedules"
                element={<CustomerPortalSchedules />}
              />
              <Route
                path="/portal/profile"
                element={<CustomerPortalProfile />}
              />
              <Route
                path="/portal/settings"
                element={<CustomerPortalSettings />}
              />
            </Route>

            {/* Collector Portal Routes */}
            <Route element={<CollectorRoute />}>
              <Route path="/collector" element={<CollectorPortalDashboard />} />
              <Route
                path="/collector/schedules"
                element={<CollectorSchedulesPage />}
              />
              <Route
                path="/collector/schedules/:id"
                element={<CollectorSchedulesPage />}
              />
              <Route
                path="/collector/routes"
                element={<CollectorPortalRoutes />}
              />
              <Route
                path="/collector/profile"
                element={<CollectorPortalProfile />}
              />
            </Route>
          </Route>

          {/* 404 - Not Found */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center bg-bg-subtle px-4">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-text-primary mb-4">
                    404
                  </h1>
                  <p className="text-xl text-text-secondary mb-6">
                    Page not found
                  </p>
                  <a
                    href="/dashboard"
                    className="inline-block px-6 py-3 bg-primary text-text-inverse rounded-lg hover:bg-primary-hover transition-colors"
                  >
                    Go to Dashboard
                  </a>
                </div>
              </div>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
