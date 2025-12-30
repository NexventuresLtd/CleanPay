/**
 * CollectorPortalProfile - Collector profile view
 * Shows collector info, stats, and account details
 */

import { Card } from "../../components/common/Card";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { StatusBadge } from "../../components/common/Badge";
import { useCollectorProfile } from "../../hooks/useCollectorPortal";
import { useAuth } from "../../hooks/useAuth";

const formatDate = (dateStr: string | undefined) => {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const CollectorPortalProfile = () => {
  const { data: profile, isLoading, error } = useCollectorProfile();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Card className="text-center py-8">
          <div className="text-danger mb-4">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-text-secondary">Failed to load profile</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 mx-auto space-y-4">
      {/* Profile Header */}
      <div className="bg-linear-to-r from-success to-success/80 rounded-xl p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
            {profile?.photo ? (
              <img
                src={profile.photo}
                alt={profile.full_name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-3xl font-bold">
                {profile?.first_name?.[0]}
                {profile?.last_name?.[0]}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{profile?.full_name}</h1>
            <p className="text-white/80">
              {profile?.employee_id
                ? `ID: ${profile.employee_id}`
                : "Collector"}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <StatusBadge status={profile?.status || "active"} size="sm" />
              {profile?.employment_type && (
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                  {profile.employment_type.replace(/_/g, " ")}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="text-center p-4">
          <div className="flex items-center justify-center gap-1 mb-1">
            <svg
              className="w-5 h-5 text-yellow-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-xl font-bold text-text-primary">
              {profile?.rating?.toFixed(1) || "5.0"}
            </span>
          </div>
          <div className="text-xs text-text-secondary">Rating</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-xl font-bold text-success">
            {profile?.total_collections || 0}
          </div>
          <div className="text-xs text-text-secondary">Collections</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-xl font-bold text-primary">
            {profile?.assigned_routes_count || 0}
          </div>
          <div className="text-xs text-text-secondary">Routes</div>
        </Card>
      </div>

      {/* Contact Information */}
      <Card>
        <h2 className="text-lg font-semibold text-text-primary mb-4">
          Contact Information
        </h2>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center shrink-0">
              <svg
                className="w-5 h-5 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs text-text-secondary">Email</p>
              <p className="text-text-primary">
                {profile?.email || "Not provided"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-success-light rounded-lg flex items-center justify-center shrink-0">
              <svg
                className="w-5 h-5 text-success"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs text-text-secondary">Phone</p>
              <p className="text-text-primary">
                {profile?.phone || "Not provided"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-warning-light rounded-lg flex items-center justify-center shrink-0">
              <svg
                className="w-5 h-5 text-warning"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs text-text-secondary">Address</p>
              <p className="text-text-primary">
                {profile?.address || "Not provided"}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Service Areas */}
      {profile?.service_areas && profile.service_areas.length > 0 && (
        <Card>
          <h2 className="text-lg font-semibold text-text-primary mb-4">
            Service Areas
          </h2>
          <div className="flex flex-wrap gap-2">
            {profile.service_areas.map((area) => (
              <span
                key={area.id}
                className="px-3 py-1.5 bg-bg-subtle rounded-lg text-sm text-text-primary"
              >
                {area.name}
              </span>
            ))}
          </div>
        </Card>
      )}

      {/* Employment Details */}
      <Card>
        <h2 className="text-lg font-semibold text-text-primary mb-4">
          Employment Details
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-text-secondary mb-1">Employment Type</p>
            <p className="text-text-primary capitalize">
              {profile?.employment_type?.replace(/_/g, " ") || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-xs text-text-secondary mb-1">Hire Date</p>
            <p className="text-text-primary">
              {formatDate(profile?.hire_date)}
            </p>
          </div>
          <div>
            <p className="text-xs text-text-secondary mb-1">Employee ID</p>
            <p className="text-text-primary">{profile?.employee_id || "N/A"}</p>
          </div>
          <div>
            <p className="text-xs text-text-secondary mb-1">Status</p>
            <StatusBadge status={profile?.status || "active"} size="sm" />
          </div>
        </div>
      </Card>

      {/* Sign Out Button */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-danger-light text-danger rounded-lg font-medium hover:bg-danger hover:text-white transition-colors"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
        Sign Out
      </button>

      {/* App Info */}
      <div className="text-center text-xs text-text-secondary py-4">
        <p>IsukuPay Collector Hub v1.0</p>
        <p className="mt-1">© 2024 IsukuPay. All rights reserved.</p>
      </div>
    </div>
  );
};

export default CollectorPortalProfile;
