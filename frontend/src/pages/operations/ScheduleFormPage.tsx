/**
 * Schedule Form Page
 * Create and edit collection schedules
 */

import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  useSchedule,
  useCreateSchedule,
  useUpdateSchedule,
  useRoutes,
  useCollectors,
} from "../../hooks/useOperations";
import type { CreateScheduleData } from "../../services/operationsService";
import { AppLayout } from "../../components/layout";
import { PageHeader, Card, Button } from "../../components/common";
import { PageLoader } from "../../components/common/LoadingSpinner";

interface ScheduleFormData {
  route: string;
  collector: string;
  scheduled_date: string;
  scheduled_time_start: string;
  scheduled_time_end: string;
  customers_scheduled: string;
  notes: string;
  status: "scheduled" | "in_progress" | "completed" | "cancelled" | "missed";
  cancellation_reason: string;
}

const ScheduleFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  // Fetch existing data if editing
  const { data: schedule, isLoading: isLoadingSchedule } = useSchedule(
    id || "",
    isEditing
  );

  // Fetch routes and collectors for dropdowns
  const { data: routesData } = useRoutes({ status: "active" });
  const { data: collectorsData } = useCollectors({ status: "active" });

  // Mutations
  const createMutation = useCreateSchedule();
  const updateMutation = useUpdateSchedule();

  const routes = routesData?.results || [];
  const collectors = collectorsData?.results || [];

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ScheduleFormData>({
    defaultValues: {
      route: "",
      collector: "",
      scheduled_date: new Date().toISOString().split("T")[0],
      scheduled_time_start: "08:00",
      scheduled_time_end: "17:00",
      customers_scheduled: "",
      notes: "",
      status: "scheduled",
      cancellation_reason: "",
    },
  });

  const watchStatus = watch("status");
  const watchRoute = watch("route");

  // Auto-fill collector when route is selected
  useEffect(() => {
    if (watchRoute && !isEditing) {
      const selectedRoute = routes.find((r) => r.id === watchRoute);
      if (selectedRoute?.default_collector) {
        reset((prev) => ({
          ...prev,
          collector: selectedRoute.default_collector || "",
          scheduled_time_start: selectedRoute.collection_time_start || "08:00",
          scheduled_time_end: selectedRoute.collection_time_end || "17:00",
        }));
      }
    }
  }, [watchRoute, routes, reset, isEditing]);

  // Populate form when editing
  useEffect(() => {
    if (schedule) {
      reset({
        route: schedule.route,
        collector: schedule.collector || "",
        scheduled_date: schedule.scheduled_date,
        scheduled_time_start: schedule.scheduled_time_start || "08:00",
        scheduled_time_end: schedule.scheduled_time_end || "17:00",
        customers_scheduled: schedule.customers_scheduled?.toString() || "",
        notes: schedule.notes || "",
        status: schedule.status,
        cancellation_reason: schedule.cancellation_reason || "",
      });
    }
  }, [schedule, reset]);

  const onSubmit = async (data: ScheduleFormData) => {
    try {
      const payload: CreateScheduleData = {
        route: data.route,
        collector: data.collector || undefined,
        scheduled_date: data.scheduled_date,
        scheduled_time_start: data.scheduled_time_start,
        scheduled_time_end: data.scheduled_time_end,
        customers_scheduled: data.customers_scheduled
          ? parseInt(data.customers_scheduled)
          : undefined,
        notes: data.notes || undefined,
      };

      if (isEditing && id) {
        await updateMutation.mutateAsync({
          id,
          data: {
            ...payload,
            status: data.status,
            cancellation_reason:
              data.status === "cancelled"
                ? data.cancellation_reason
                : undefined,
          },
        });
      } else {
        await createMutation.mutateAsync(payload);
      }

      navigate("/operations/schedules");
    } catch (error) {
      console.error("Failed to save schedule:", error);
      alert("Failed to save schedule. Please try again.");
    }
  };

  if (isEditing && isLoadingSchedule) {
    return (
      <AppLayout>
        <PageLoader />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageHeader
        title={isEditing ? "Edit Schedule" : "New Schedule"}
        subtitle={
          isEditing
            ? `Editing schedule for ${schedule?.route_name || "route"}`
            : "Create a new collection schedule"
        }
        actions={
          <Button
            variant="outline"
            onClick={() => navigate("/operations/schedules")}
          >
            Cancel
          </Button>
        }
      />

      <div className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl">
          <Card className="p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Schedule Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Route <span className="text-danger">*</span>
                </label>
                <select
                  {...register("route", { required: "Route is required" })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  disabled={isEditing}
                >
                  <option value="">Select a route</option>
                  {routes.map((route) => (
                    <option key={route.id} value={route.id}>
                      {route.name} ({route.code}) - {route.service_area_name}
                    </option>
                  ))}
                </select>
                {errors.route && (
                  <p className="mt-1 text-sm text-danger">
                    {errors.route.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Collector
                </label>
                <select
                  {...register("collector")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="">Select a collector</option>
                  {collectors.map((collector) => (
                    <option key={collector.id} value={collector.id}>
                      {collector.full_name} ({collector.employee_id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Scheduled Date <span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  {...register("scheduled_date", {
                    required: "Date is required",
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
                {errors.scheduled_date && (
                  <p className="mt-1 text-sm text-danger">
                    {errors.scheduled_date.message}
                  </p>
                )}
              </div>

              {isEditing && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    {...register("status")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="missed">Missed</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  {...register("scheduled_time_start")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  {...register("scheduled_time_end")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customers Scheduled
                </label>
                <input
                  type="number"
                  {...register("customers_scheduled")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Number of customers"
                  min="0"
                />
              </div>
            </div>
          </Card>

          {isEditing && watchStatus === "cancelled" && (
            <Card className="p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Cancellation Details
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cancellation Reason
                </label>
                <textarea
                  {...register("cancellation_reason")}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Reason for cancellation..."
                />
              </div>
            </Card>
          )}

          <Card className="p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Additional Notes
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                {...register("notes")}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Any additional notes or instructions for this schedule..."
              />
            </div>
          </Card>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/operations/schedules")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={
                isSubmitting ||
                createMutation.isPending ||
                updateMutation.isPending
              }
            >
              {isSubmitting ||
              createMutation.isPending ||
              updateMutation.isPending
                ? "Saving..."
                : isEditing
                ? "Update Schedule"
                : "Create Schedule"}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
};

export default ScheduleFormPage;
