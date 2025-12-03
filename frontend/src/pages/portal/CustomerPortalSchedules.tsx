/**
 * Customer Portal Schedules Page
 * Shows collection schedules for the customer
 */

import { useState } from "react";
import { CustomerPortalLayout } from "../../components/layout/CustomerPortalLayout";
import { Card } from "../../components/common/Card";
import { StatusBadge } from "../../components/common/Badge";
import { PageLoader } from "../../components/common/LoadingSpinner";
import { EmptyState } from "../../components/common/EmptyState";
import { usePortalSchedules } from "../../hooks/useCustomerPortal";

type DateFilter = "upcoming" | "today" | "past" | "";

export const CustomerPortalSchedules = () => {
  const [dateFilter, setDateFilter] = useState<DateFilter>("upcoming");
  const [statusFilter, setStatusFilter] = useState<string>("");

  const { data, isLoading, error } = usePortalSchedules({
    date: dateFilter || undefined,
    status: statusFilter || undefined,
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(":");
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (isLoading) {
    return (
      <CustomerPortalLayout>
        <PageLoader />
      </CustomerPortalLayout>
    );
  }

  if (error) {
    return (
      <CustomerPortalLayout>
        <div className="p-6">
          <div className="text-center py-12">
            <p className="text-danger">Failed to load schedules</p>
          </div>
        </div>
      </CustomerPortalLayout>
    );
  }

  return (
    <CustomerPortalLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            Collection Schedules
          </h1>
          <p className="text-text-secondary mt-1">
            View your upcoming and past waste collection schedules
          </p>
        </div>

        {/* Filters */}
        <Card>
          <div className="flex flex-wrap gap-4">
            {/* Date Filter Tabs */}
            <div className="flex gap-2">
              {[
                { key: "", label: "All" },
                { key: "today", label: "Today" },
                { key: "upcoming", label: "Upcoming" },
                { key: "past", label: "Past" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setDateFilter(tab.key as DateFilter)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    dateFilter === tab.key
                      ? "bg-primary text-white"
                      : "bg-bg-subtle text-text-secondary hover:bg-bg-muted"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <div className="ml-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-bg-subtle border border-border-base rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All Statuses</option>
                <option value="scheduled">Scheduled</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="missed">Missed</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Schedules List */}
        {data?.results && data.results.length > 0 ? (
          <div className="space-y-4">
            {data.results.map((schedule) => (
              <Card
                key={schedule.id}
                className="hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Date Badge */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-primary-light rounded-xl flex flex-col items-center justify-center">
                      <span className="text-lg font-bold text-primary">
                        {new Date(schedule.scheduled_date).getDate()}
                      </span>
                      <span className="text-xs text-primary uppercase">
                        {new Date(schedule.scheduled_date).toLocaleDateString(
                          "en-US",
                          { month: "short" }
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Schedule Details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-text-primary">
                        {formatDate(schedule.scheduled_date)}
                      </h3>
                      <StatusBadge status={schedule.status} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-text-muted">Scheduled Time</p>
                        <p className="text-text-primary font-medium">
                          {formatTime(schedule.scheduled_time_start)} -{" "}
                          {formatTime(schedule.scheduled_time_end)}
                        </p>
                      </div>

                      {schedule.actual_start_time && (
                        <div>
                          <p className="text-text-muted">Actual Time</p>
                          <p className="text-text-primary font-medium">
                            {formatTime(schedule.actual_start_time)}
                            {schedule.actual_end_time &&
                              ` - ${formatTime(schedule.actual_end_time)}`}
                          </p>
                        </div>
                      )}

                      <div>
                        <p className="text-text-muted">Route / Area</p>
                        <p className="text-text-primary font-medium">
                          {schedule.route_name || "N/A"}
                        </p>
                        {schedule.service_area_name && (
                          <p className="text-text-secondary text-xs">
                            {schedule.service_area_name}
                          </p>
                        )}
                      </div>

                      {schedule.collector_name && (
                        <div>
                          <p className="text-text-muted">Collector</p>
                          <p className="text-text-primary font-medium">
                            {schedule.collector_name}
                          </p>
                        </div>
                      )}
                    </div>

                    {schedule.notes && (
                      <div className="mt-3 p-3 bg-bg-subtle rounded-lg">
                        <p className="text-sm text-text-secondary">
                          {schedule.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No schedules found"
            description={
              dateFilter === "upcoming"
                ? "You don't have any upcoming collection schedules."
                : dateFilter === "today"
                ? "No collections scheduled for today."
                : "No collection schedules found matching your filters."
            }
            icon={
              <svg
                className="w-12 h-12"
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
            }
          />
        )}
      </div>
    </CustomerPortalLayout>
  );
};

export default CustomerPortalSchedules;
