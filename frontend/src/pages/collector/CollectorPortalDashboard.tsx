/**
 * CollectorPortalDashboard - Main dashboard for collectors
 * Shows today's schedule summary, pending pickups, and quick actions
 */

import { Card } from "../../components/common/Card";
import { StatusBadge } from "../../components/common/Badge";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import {
  useCollectorDashboard,
  useStartSchedule,
} from "../../hooks/useCollectorPortal";
import { Link } from "react-router-dom";
import type { CollectorSchedule } from "../../services/collectorPortalService";

const formatTime = (time: string) => {
  if (!time) return "";
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${minutes} ${ampm}`;
};

interface ScheduleCardProps {
  schedule: CollectorSchedule;
  onStart?: (id: string) => void;
  isStarting?: boolean;
}

const ScheduleCard = ({ schedule, onStart, isStarting }: ScheduleCardProps) => {
  const canStart = schedule.status === "scheduled";
  const isInProgress = schedule.status === "in_progress";

  return (
    <Card className="relative">
      {/* Status indicator bar */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-lg ${
          schedule.status === "in_progress"
            ? "bg-warning"
            : schedule.status === "completed"
            ? "bg-success"
            : schedule.status === "missed"
            ? "bg-danger"
            : "bg-primary"
        }`}
      />

      <div className="pl-3">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-text-primary">
              {schedule.route_name}
            </h3>
            <p className="text-sm text-text-secondary">
              {schedule.service_area_name}
            </p>
          </div>
          <StatusBadge status={schedule.status} size="sm" />
        </div>

        <div className="flex items-center gap-4 text-sm text-text-secondary mb-3">
          <div className="flex items-center gap-1">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {formatTime(schedule.scheduled_time_start)} -{" "}
            {formatTime(schedule.scheduled_time_end)}
          </div>
          <div className="flex items-center gap-1">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {schedule.customers_scheduled} customers
          </div>
        </div>

        {isInProgress && (
          <div className="flex items-center gap-4 text-sm mb-3">
            <span className="text-success">
              ✓ {schedule.customers_collected} collected
            </span>
            {schedule.customers_missed > 0 && (
              <span className="text-danger">
                ✗ {schedule.customers_missed} missed
              </span>
            )}
          </div>
        )}

        <div className="flex gap-2">
          {canStart && (
            <button
              onClick={() => onStart?.(schedule.id)}
              disabled={isStarting}
              className="flex-1 bg-success text-white py-2 px-4 rounded-lg font-medium hover:bg-success/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isStarting ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
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
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Start Collection
                </>
              )}
            </button>
          )}
          {isInProgress && (
            <Link
              to={`/collector/schedules/${schedule.id}`}
              className="flex-1 bg-warning text-white py-2 px-4 rounded-lg font-medium hover:bg-warning/90 transition-colors flex items-center justify-center gap-2"
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
              Continue
            </Link>
          )}
          <Link
            to={`/collector/schedules/${schedule.id}`}
            className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-subtle rounded-lg transition-colors"
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
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export const CollectorPortalDashboard = () => {
  const { data, isLoading, error, refetch } = useCollectorDashboard();
  const startScheduleMutation = useStartSchedule();

  const handleStartSchedule = async (scheduleId: string) => {
    try {
      await startScheduleMutation.mutateAsync(scheduleId);
    } catch (err) {
      console.error("Failed to start schedule:", err);
    }
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
          <p className="text-text-secondary mb-4">
            Failed to load dashboard data
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Try Again
          </button>
        </Card>
      </div>
    );
  }

  const collector = data?.collector;
  const summary = data?.summary;
  const todaySchedules = data?.today_schedules || [];
  const upcomingSchedules = data?.upcoming_schedules || [];

  // Find the next pending schedule
  const nextPending = todaySchedules.find(
    (s) => s.status === "scheduled" || s.status === "in_progress"
  );

  return (
    <div className="p-4 space-y-4 mx-auto">
      {/* Welcome Header */}
      <div className="bg-linear-to-r from-success to-success/80 rounded-xl p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-success-light text-sm">Welcome back,</p>
            <h1 className="text-xl font-bold">{collector?.full_name}</h1>
          </div>
          <div className="text-right">
            <p className="text-success-light text-sm">Rating</p>
            <div className="flex items-center gap-1">
              <svg
                className="w-5 h-5 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-bold">
                {collector?.rating?.toFixed(1) || "5.0"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-primary">
            {summary?.pending_pickups || 0}
          </div>
          <div className="text-sm text-text-secondary">Pending Today</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-success">
            {summary?.completed_today || 0}
          </div>
          <div className="text-sm text-text-secondary">Completed</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-warning">
            {summary?.today_schedules || 0}
          </div>
          <div className="text-sm text-text-secondary">Total Today</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-info">
            {summary?.assigned_routes || 0}
          </div>
          <div className="text-sm text-text-secondary">Assigned Routes</div>
        </Card>
      </div>

      {/* Next Up / In Progress */}
      {nextPending && (
        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
            {nextPending.status === "in_progress" ? (
              <>
                <span className="w-2 h-2 bg-warning rounded-full animate-pulse"></span>
                In Progress
              </>
            ) : (
              <>
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                Next Up
              </>
            )}
          </h2>
          <ScheduleCard
            schedule={nextPending}
            onStart={handleStartSchedule}
            isStarting={startScheduleMutation.isPending}
          />
        </div>
      )}

      {/* Today's Schedules */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-text-primary">
            Today's Schedule
          </h2>
          <Link
            to="/collector/schedules"
            className="text-sm text-primary font-medium"
          >
            View All
          </Link>
        </div>

        {todaySchedules.length === 0 ? (
          <Card className="text-center py-8">
            <div className="text-text-secondary mb-2">
              <svg
                className="w-12 h-12 mx-auto opacity-50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="text-text-secondary">No schedules for today</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {todaySchedules
              .filter((s) => s.id !== nextPending?.id)
              .slice(0, 3)
              .map((schedule) => (
                <ScheduleCard
                  key={schedule.id}
                  schedule={schedule}
                  onStart={handleStartSchedule}
                  isStarting={startScheduleMutation.isPending}
                />
              ))}
          </div>
        )}
      </div>

      {/* Upcoming Schedules */}
      {upcomingSchedules && upcomingSchedules.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-3">
            Coming Up
          </h2>
          <div className="space-y-2">
            {upcomingSchedules.map((schedule) => (
              <Card key={schedule.id} className="flex items-center gap-4">
                <div className="shrink-0 w-12 h-12 bg-primary-light rounded-lg flex flex-col items-center justify-center">
                  <span className="text-xs text-primary font-medium">
                    {new Date(schedule.scheduled_date).toLocaleDateString(
                      "en-US",
                      { weekday: "short" }
                    )}
                  </span>
                  <span className="text-lg font-bold text-primary">
                    {new Date(schedule.scheduled_date).getDate()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-text-primary truncate">
                    {schedule.route_name}
                  </p>
                  <p className="text-sm text-text-secondary">
                    {formatTime(schedule.scheduled_time_start)} -{" "}
                    {schedule.service_area_name}
                  </p>
                </div>
                <svg
                  className="w-5 h-5 text-text-secondary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-text-primary mb-3">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <Link
            to="/collector/routes"
            className="flex flex-col items-center gap-2 p-4 bg-bg-base rounded-xl border border-border-base hover:border-primary transition-colors"
          >
            <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
            </div>
            <span className="text-sm font-medium text-text-primary">
              View Routes
            </span>
          </Link>
          <Link
            to="/collector/schedules?date=week"
            className="flex flex-col items-center gap-2 p-4 bg-bg-base rounded-xl border border-border-base hover:border-primary transition-colors"
          >
            <div className="w-12 h-12 bg-warning-light rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-warning"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <span className="text-sm font-medium text-text-primary">
              This Week
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CollectorPortalDashboard;
