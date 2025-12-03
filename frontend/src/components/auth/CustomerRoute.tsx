/**
 * CustomerRoute - Protects routes for customer users only
 * Redirects staff/admin to the main dashboard
 */

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const STAFF_ROLES = [
  "admin",
  "finance_manager",
  "accountant",
  "customer_service",
];

export const CustomerRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-subtle">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Check if user has a staff role
  const userRole = user?.role_details?.name || user?.role;
  const isStaff = userRole && STAFF_ROLES.includes(userRole);

  if (isStaff) {
    // Redirect staff to their dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default CustomerRoute;
