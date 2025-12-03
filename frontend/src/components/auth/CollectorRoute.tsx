/**
 * CollectorRoute - Protected route wrapper for collector portal
 * Redirects non-collectors to appropriate dashboard
 */

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { CollectorPortalLayout } from "../layout/CollectorPortalLayout";

export const CollectorRoute = () => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-subtle">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Get user role from role string or role_details object
  const userRole = user?.role_details?.name || user?.role;
  
  // Allow access if user has 'collector' role or is admin
  if (userRole !== "collector" && userRole !== "admin") {
    // Redirect customers to portal
    if (userRole === "customer") {
      return <Navigate to="/portal" replace />;
    }
    // Redirect staff to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <CollectorPortalLayout>
      <Outlet />
    </CollectorPortalLayout>
  );
};

export default CollectorRoute;
