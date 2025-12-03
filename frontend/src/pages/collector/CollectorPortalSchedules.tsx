/**
 * CollectorPortalSchedules - List of collector's schedules
 * Shows all assigned pickups with filtering and status management
 */

import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Card } from "../../components/common/Card";
import { StatusBadge } from "../../components/common/Badge";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import {
  useCollectorSchedules,
  useStartSchedule,
} from "../../hooks/useCollectorPortal";
import type { CollectorSchedule } from "../../services/collectorPortalService";

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

const formatTime = (time: string) => {
  if (!time) return "";
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${minutes} ${ampm}`;
};

const isToday = (dateStr: string) => {
  const today = new Date();
  const date = new Date(dateStr);
  return today.toDateString() === date.toDateString();
};

interface ScheduleListItemProps {
  schedule: CollectorSchedule;
  onStart?: (id: string) => void;
  isStarting?: boolean;
}

const ScheduleListItem = ({
  schedule,
  onStart,
  isStarting,
}: ScheduleListItemProps) => {
  const canStart =
    schedule.status === "scheduled" && isToday(schedule.scheduled_date);
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
            : schedule.status === "cancelled"
            ? "bg-gray-400"
            : "bg-primary"
        }`}
      />

      <div className="pl-3">
        <div className="flex items-start justify-between mb-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-text-primary">
                {schedule.route_name}
              </h3>
              {isToday(schedule.scheduled_date) && (
                <span className="text-xs bg-primary-light text-primary px-2 py-0.5 rounded-full font-medium">
                  Today
                </span>
              )}
            </div>
            <p className="text-sm text-text-secondary">
              {schedule.service_area_name}
            </p>
          </div>
          <StatusBadge status={schedule.status} size="sm" />
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-text-secondary mb-3">
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
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {formatDate(schedule.scheduled_date)}
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

        {/* Progress for in-progress/completed */}
        {(isInProgress || schedule.status === "completed") && (
          <div className="flex items-center gap-4 text-sm mb-3">
            <span className="text-success flex items-center gap-1">
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {schedule.customers_collected} collected
            </span>
            {schedule.customers_missed > 0 && (
              <span className="text-danger flex items-center gap-1">
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                {schedule.customers_missed} missed
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
                  Start
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
            className={`${
              canStart || isInProgress ? "" : "flex-1"
            } p-2 text-text-secondary hover:text-text-primary hover:bg-bg-subtle rounded-lg transition-colors flex items-center justify-center gap-1`}
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
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            {!canStart && !isInProgress && <span>View Details</span>}
          </Link>
        </div>
      </div>
    </Card>
  );
};

type DateFilter = "today" | "upcoming" | "past" | "week";
type StatusFilter =
  | "scheduled"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "missed"
  | "";

export const CollectorPortalSchedules = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialDate = (searchParams.get("date") as DateFilter) || "today";
  const initialStatus = (searchParams.get("status") as StatusFilter) || "";

  const [dateFilter, setDateFilter] = useState<DateFilter>(initialDate);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(initialStatus);

  const { data, isLoading, error, refetch } = useCollectorSchedules({
    date: dateFilter,
    status: statusFilter || undefined,
  });

  const startScheduleMutation = useStartSchedule();

  const handleDateFilterChange = (filter: DateFilter) => {
    setDateFilter(filter);
    searchParams.set("date", filter);
    setSearchParams(searchParams);
  };

  const handleStatusFilterChange = (filter: StatusFilter) => {
    setStatusFilter(filter);
    if (filter) {
      searchParams.set("status", filter);
    } else {
      searchParams.delete("status");
    }
    setSearchParams(searchParams);
  };

  const handleStartSchedule = async (scheduleId: string) => {
    try {
      await startScheduleMutation.mutateAsync(scheduleId);
    } catch (err) {
      console.error("Failed to start schedule:", err);
    }
  };

  const schedules = data?.results || [];

  return (
    <div className="p-4 mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">My Schedules</h1>
        <p className="text-text-secondary">Manage your collection schedules</p>
      </div>

      {/* Date Filters */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {[
          { value: "today", label: "Today" },
          { value: "week", label: "This Week" },
          { value: "upcoming", label: "Upcoming" },
          { value: "past", label: "Past" },
        ].map((filter) => (
          <button
            key={filter.value}
            onClick={() => handleDateFilterChange(filter.value as DateFilter)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              dateFilter === filter.value
                ? "bg-success text-white"
                : "bg-bg-base border border-border-base text-text-secondary hover:text-text-primary"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Status Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {[
          { value: "", label: "All" },
          { value: "scheduled", label: "Scheduled" },
          { value: "in_progress", label: "In Progress" },
          { value: "completed", label: "Completed" },
          { value: "missed", label: "Missed" },
        ].map((filter) => (
          <button
            key={filter.value}
            onClick={() =>
              handleStatusFilterChange(filter.value as StatusFilter)
            }
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              statusFilter === filter.value
                ? "bg-primary text-white"
                : "bg-bg-base border border-border-base text-text-secondary hover:text-text-primary"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {/* Error State */}
      {error && (
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
          <p className="text-text-secondary mb-4">Failed to load schedules</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Try Again
          </button>
        </Card>
      )}

      {/* Empty State */}
      {!isLoading && !error && schedules.length === 0 && (
        <Card className="text-center py-12">
          <div className="text-text-secondary mb-4">
            <svg
              className="w-16 h-16 mx-auto opacity-50"
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
          <h3 className="text-lg font-medium text-text-primary mb-2">
            No schedules found
          </h3>
          <p className="text-text-secondary">
            {dateFilter === "today"
              ? "You don't have any schedules for today"
              : dateFilter === "past"
              ? "No past schedules found"
              : "No upcoming schedules found"}
          </p>
        </Card>
      )}

      {/* Schedules List */}
      {!isLoading && !error && schedules.length > 0 && (
        <div className="space-y-3">
          {schedules.map((schedule) => (
            <ScheduleListItem
              key={schedule.id}
              schedule={schedule}
              onStart={handleStartSchedule}
              isStarting={startScheduleMutation.isPending}
            />
          ))}
        </div>
      )}

      {/* Results count */}
      {!isLoading && !error && schedules.length > 0 && (
        <p className="text-center text-sm text-text-secondary mt-4">
          Showing {schedules.length} schedule{schedules.length !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
};

export default CollectorPortalSchedules;
