import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { ForgotPasswordPage } from "./pages/auth/ForgotPasswordPage";
import { DashboardPage } from "./pages/dashboard/DashboardPage";

// Customer Pages (Admin/Staff)
import CustomersPage from "./pages/customers/CustomersPage";
import CustomerDetailPage from "./pages/customers/CustomerDetailPage";
import CustomerFormPage from "./pages/customers/CustomerFormPage";

// Operations Pages (Admin/Staff)
import {
  ServiceAreasPage,
  ServiceAreaFormPage,
  RoutesPage,
  RouteFormPage,
  CollectorsPage,
  CollectorFormPage,
  SchedulesPage,
  ScheduleFormPage,
} from "./pages/operations";

// Customer Portal Pages
import { CustomerPortalDashboard } from "./pages/portal/CustomerPortalDashboard";
import { CustomerPortalInvoices } from "./pages/portal/CustomerPortalInvoices";
import { CustomerPortalPayments } from "./pages/portal/CustomerPortalPayments";
import { CustomerPortalSchedules } from "./pages/portal/CustomerPortalSchedules";
import { CustomerPortalProfile } from "./pages/portal/CustomerPortalProfile";

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

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Staff/Admin Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<StaffRoute />}>
              {/* Dashboard */}
              <Route path="/dashboard" element={<DashboardPage />} />

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
              <Route
                path="/portal/invoices"
                element={<CustomerPortalInvoices />}
              />
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
