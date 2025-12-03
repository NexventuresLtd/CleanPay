import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "../../components/layout/AppLayout";
import { PageHeader } from "../../components/common/PageHeader";
import { Card } from "../../components/common/Card";
import { EmptyState } from "../../components/common/EmptyState";
import { PageLoader } from "../../components/common/LoadingSpinner";
import { StatCard } from "../../components/common/StatCard";
import { StatusBadge } from "../../components/common/Badge";
import {
  useSchedules,
  useTodaySchedules,
  useUpcomingSchedules,
  useOverdueSchedules,
  useStartSchedule,
  useCompleteSchedule,
  useCancelSchedule,
} from "../../hooks/useOperations";
import type { Schedule } from "../../services/operationsService";

type ScheduleFilter = "all" | "today" | "upcoming" | "overdue" | "completed";

export const SchedulesPage = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<ScheduleFilter>("today");
  const [searchTerm, setSearchTerm] = useState("");

  // Queries - fetch based on filter
  const {
    data: allSchedulesData,
    isLoading: loadingAll,
    error: errorAll,
  } = useSchedules();
  const { data: todaySchedules, isLoading: loadingToday } = useTodaySchedules();
  const { data: upcomingSchedules, isLoading: loadingUpcoming } =
    useUpcomingSchedules();
  const { data: overdueSchedules, isLoading: loadingOverdue } =
    useOverdueSchedules();

  // Extract results from paginated response
  const allSchedules = allSchedulesData?.results || [];

  // Mutations
  const startSchedule = useStartSchedule();
  const completeSchedule = useCompleteSchedule();
  const cancelSchedule = useCancelSchedule();

  // Get filtered schedules
  const filteredSchedules = useMemo(() => {
    let schedules: Schedule[] = [];

    switch (filter) {
      case "today":
        schedules = todaySchedules || [];
        break;
      case "upcoming":
        schedules = upcomingSchedules || [];
        break;
      case "overdue":
        schedules = overdueSchedules || [];
        break;
      case "completed":
        schedules = allSchedules.filter((s) => s.status === "completed");
        break;
      default:
        schedules = allSchedules;
    }

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return schedules.filter(
        (schedule) =>
          schedule.route_name?.toLowerCase().includes(search) ||
          schedule.collector_name?.toLowerCase().includes(search) ||
          schedule.service_area_name?.toLowerCase().includes(search)
      );
    }

    return schedules;
  }, [
    filter,
    allSchedules,
    todaySchedules,
    upcomingSchedules,
    overdueSchedules,
    searchTerm,
  ]);

  const isLoading =
    loadingAll || loadingToday || loadingUpcoming || loadingOverdue;

  const handleStart = async (id: string) => {
    try {
      await startSchedule.mutateAsync(id);
    } catch {
      alert("Failed to start schedule");
    }
  };

  const handleComplete = async (
    id: string,
    customersCollected: number,
    customersMissed: number
  ) => {
    try {
      await completeSchedule.mutateAsync({
        id,
        data: {
          customers_collected: customersCollected,
          customers_missed: customersMissed,
        },
      });
    } catch {
      alert("Failed to complete schedule");
    }
  };

  const handleCancel = async (id: string) => {
    const reason = window.prompt("Please enter a reason for cancellation:");
    if (reason) {
      try {
        await cancelSchedule.mutateAsync({ id, reason });
      } catch {
        alert("Failed to cancel schedule");
      }
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
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
      <AppLayout>
        <PageLoader />
      </AppLayout>
    );
  }

  if (errorAll) {
    return (
      <AppLayout>
        <div className="p-6">
          <div className="text-center py-12">
            <p className="text-danger">Failed to load schedules</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  const todayCount = todaySchedules?.length || 0;
  const upcomingCount = upcomingSchedules?.length || 0;
  const overdueCount = overdueSchedules?.length || 0;
  const completedCount = (allSchedules || []).filter(
    (s) => s.status === "completed"
  ).length;

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <PageHeader
          title="Collection Schedules"
          subtitle="Manage daily and weekly collection schedules"
          actions={
            <button
              onClick={() => navigate("/operations/schedules/new")}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
            >
              Create Schedule
            </button>
          }
        />

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            title="Today"
            value={todayCount}
            icon={
              <svg
                className="w-6 h-6"
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
            iconColorClass="text-primary"
          />
          <StatCard
            title="Upcoming"
            value={upcomingCount}
            icon={
              <svg
                className="w-6 h-6"
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
            }
            iconColorClass="text-info"
          />
          <StatCard
            title="Overdue"
            value={overdueCount}
            icon={
              <svg
                className="w-6 h-6"
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
            }
            iconColorClass="text-danger"
          />
          <StatCard
            title="Completed"
            value={completedCount}
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
            iconColorClass="text-success"
          />
        </div>

        {/* Filters */}
        <Card>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Filter Tabs */}
            <div className="flex gap-2 flex-wrap">
              {[
                { key: "today", label: "Today", count: todayCount },
                { key: "upcoming", label: "Upcoming", count: upcomingCount },
                { key: "overdue", label: "Overdue", count: overdueCount },
                { key: "completed", label: "Completed", count: completedCount },
                { key: "all", label: "All" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key as ScheduleFilter)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === tab.key
                      ? "bg-primary text-white"
                      : "bg-bg-subtle text-text-secondary hover:bg-bg-muted"
                  }`}
                >
                  {tab.label}
                  {tab.count !== undefined && (
                    <span
                      className={`ml-2 px-1.5 py-0.5 rounded text-xs ${
                        filter === tab.key ? "bg-white/20" : "bg-bg-muted"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search schedules..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-bg-subtle border border-border-base rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Schedule List */}
        {filteredSchedules.length === 0 ? (
          <EmptyState
            title="No schedules found"
            description={
              filter === "today"
                ? "No schedules for today. Create a new schedule to get started."
                : filter === "overdue"
                ? "Great! No overdue schedules."
                : "Try adjusting your search or filter."
            }
            action={
              <button
                onClick={() => navigate("/operations/schedules/new")}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
              >
                Create Schedule
              </button>
            }
          />
        ) : (
          <div className="space-y-4">
            {filteredSchedules.map((schedule) => (
              <Card
                key={schedule.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() =>
                  navigate(`/operations/schedules/${schedule.id}/edit`)
                }
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Date & Time */}
                  <div className="flex items-center gap-4">
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
                    <div>
                      <p className="font-medium text-text-primary">
                        {formatDate(schedule.scheduled_date)}
                      </p>
                      <p className="text-sm text-text-secondary">
                        {formatTime(schedule.scheduled_time_start)} -{" "}
                        {formatTime(schedule.scheduled_time_end)}
                      </p>
                    </div>
                  </div>

                  {/* Route & Collector Info */}
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-text-muted uppercase tracking-wide">
                        Route
                      </p>
                      <p className="font-medium text-text-primary">
                        {schedule.route_name}
                      </p>
                      <p className="text-sm text-text-secondary">
                        {schedule.service_area_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-text-muted uppercase tracking-wide">
                        Collector
                      </p>
                      <p className="font-medium text-text-primary">
                        {schedule.collector_name || "Unassigned"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-text-muted uppercase tracking-wide">
                        Customers
                      </p>
                      <p className="font-medium text-text-primary">
                        {schedule.customers_scheduled || 0}
                      </p>
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div
                    className="flex items-center gap-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <StatusBadge status={schedule.status} />

                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          navigate(`/operations/schedules/${schedule.id}/edit`)
                        }
                        className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Edit
                      </button>
                      {schedule.status === "scheduled" && (
                        <button
                          onClick={() => handleStart(schedule.id)}
                          className="px-3 py-1.5 text-sm font-medium text-primary bg-primary-light rounded-lg hover:bg-primary hover:text-white transition-colors"
                        >
                          Start
                        </button>
                      )}
                      {schedule.status === "in_progress" && (
                        <button
                          onClick={() =>
                            handleComplete(
                              schedule.id,
                              schedule.customers_collected,
                              schedule.customers_missed
                            )
                          }
                          className="px-3 py-1.5 text-sm font-medium text-success bg-success-light rounded-lg hover:bg-success hover:text-white transition-colors"
                        >
                          Complete
                        </button>
                      )}
                      {(schedule.status === "scheduled" ||
                        schedule.status === "in_progress") && (
                        <button
                          onClick={() => handleCancel(schedule.id)}
                          className="px-3 py-1.5 text-sm font-medium text-danger bg-danger-light rounded-lg hover:bg-danger hover:text-white transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default SchedulesPage;
