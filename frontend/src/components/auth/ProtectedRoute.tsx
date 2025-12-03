import React from "react";
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-subtle)]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[var(--color-border-base)] border-t-[var(--color-primary)]"></div>
          <p className="mt-4 text-[var(--color-text-secondary)]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && user.role && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-subtle)] px-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[var(--color-danger-light)] text-[var(--color-danger)] mb-4">
            <svg
              className="w-10 h-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
            Access Denied
          </h2>
          <p className="text-[var(--color-text-secondary)] mb-6">
            You don't have permission to access this page.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-[var(--color-primary)] text-[var(--color-text-inverse)] rounded-[var(--radius-lg)] hover:bg-[var(--color-primary-hover)] transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return <Outlet />;
};
