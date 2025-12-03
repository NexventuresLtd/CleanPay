/**
 * Route Form Page
 * Create and edit collection routes within service areas
 */

import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import {
  useRoute,
  useCreateRoute,
  useUpdateRoute,
  useServiceAreas,
  useCollectors,
} from "../../hooks/useOperations";
import type { CreateRouteData } from "../../services/operationsService";
import { AppLayout } from "../../components/layout";
import { PageHeader, Card, Button } from "../../components/common";
import { PageLoader } from "../../components/common/LoadingSpinner";

interface RouteFormData {
  code: string;
  name: string;
  description: string;
  status: "active" | "inactive" | "archived";
  service_area: string;
  default_collector: string;
  sequence_number: string;
  estimated_distance_km: string;
  estimated_duration_minutes: string;
  frequency: "daily" | "twice_weekly" | "weekly" | "biweekly" | "monthly";
  collection_days: string[];
  collection_time_start: string;
  collection_time_end: string;
}

const DAYS_OF_WEEK = [
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" },
];

const RouteFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  // Fetch existing data if editing
  const { data: route, isLoading: isLoadingRoute } = useRoute(
    id || "",
    isEditing
  );

  // Fetch service areas and collectors for dropdowns
  const { data: serviceAreasData } = useServiceAreas({ status: "active" });
  const { data: collectorsData } = useCollectors({ status: "active" });

  // Mutations
  const createMutation = useCreateRoute();
  const updateMutation = useUpdateRoute();

  const serviceAreas = serviceAreasData?.results || [];
  const collectors = collectorsData?.results || [];

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RouteFormData>({
    defaultValues: {
      code: "",
      name: "",
      description: "",
      status: "active",
      service_area: "",
      default_collector: "",
      sequence_number: "1",
      estimated_distance_km: "",
      estimated_duration_minutes: "",
      frequency: "weekly",
      collection_days: [],
      collection_time_start: "08:00",
      collection_time_end: "17:00",
    },
  });

  const watchFrequency = watch("frequency");

  // Populate form when editing
  useEffect(() => {
    if (route) {
      reset({
        code: route.code,
        name: route.name,
        description: route.description || "",
        status: route.status,
        service_area: route.service_area,
        default_collector: route.default_collector || "",
        sequence_number: route.sequence_number?.toString() || "1",
        estimated_distance_km: route.estimated_distance_km?.toString() || "",
        estimated_duration_minutes:
          route.estimated_duration_minutes?.toString() || "",
        frequency: route.frequency,
        collection_days: route.collection_days || [],
        collection_time_start: route.collection_time_start || "08:00",
        collection_time_end: route.collection_time_end || "17:00",
      });
    }
  }, [route, reset]);

  const onSubmit = async (data: RouteFormData) => {
    try {
      const payload: CreateRouteData = {
        code: data.code,
        name: data.name,
        description: data.description || undefined,
        status: data.status,
        service_area: data.service_area,
        default_collector: data.default_collector || undefined,
        sequence_number: parseInt(data.sequence_number) || 1,
        estimated_distance_km: data.estimated_distance_km
          ? parseFloat(data.estimated_distance_km)
          : undefined,
        estimated_duration_minutes: data.estimated_duration_minutes
          ? parseInt(data.estimated_duration_minutes)
          : undefined,
        frequency: data.frequency,
        collection_days: data.collection_days,
        collection_time_start: data.collection_time_start,
        collection_time_end: data.collection_time_end,
      };

      if (isEditing && id) {
        await updateMutation.mutateAsync({ id, data: payload });
      } else {
        await createMutation.mutateAsync(payload);
      }

      navigate("/operations/routes");
    } catch (error) {
      console.error("Failed to save route:", error);
      alert("Failed to save route. Please try again.");
    }
  };

  if (isEditing && isLoadingRoute) {
    return (
      <AppLayout>
        <PageLoader />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageHeader
        title={isEditing ? "Edit Route" : "New Route"}
        subtitle={
          isEditing
            ? `Editing ${route?.name || "route"}`
            : "Create a new collection route"
        }
        actions={
          <Button
            variant="outline"
            onClick={() => navigate("/operations/routes")}
          >
            Cancel
          </Button>
        }
      />

      <div className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl">
          <Card className="p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Code <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  {...register("code", { required: "Code is required" })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="e.g., RT-001"
                />
                {errors.code && (
                  <p className="mt-1 text-sm text-danger">
                    {errors.code.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  {...register("name", { required: "Name is required" })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="e.g., Route A - Kimironko North"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-danger">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  {...register("description")}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Additional details about the route..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Area <span className="text-danger">*</span>
                </label>
                <select
                  {...register("service_area", {
                    required: "Service area is required",
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="">Select a service area</option>
                  {serviceAreas.map((area) => (
                    <option key={area.id} value={area.id}>
                      {area.name} ({area.code})
                    </option>
                  ))}
                </select>
                {errors.service_area && (
                  <p className="mt-1 text-sm text-danger">
                    {errors.service_area.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  {...register("status")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Default Collector
                </label>
                <select
                  {...register("default_collector")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="">Select a collector (optional)</option>
                  {collectors.map((collector) => (
                    <option key={collector.id} value={collector.id}>
                      {collector.full_name} ({collector.employee_id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sequence Number
                </label>
                <input
                  type="number"
                  {...register("sequence_number")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="1"
                  min="1"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Route Estimates
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estimated Distance (km)
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register("estimated_distance_km")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="e.g., 5.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estimated Duration (minutes)
                </label>
                <input
                  type="number"
                  {...register("estimated_duration_minutes")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="e.g., 120"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Collection Schedule
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Frequency <span className="text-danger">*</span>
                </label>
                <select
                  {...register("frequency", {
                    required: "Frequency is required",
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="daily">Daily</option>
                  <option value="twice_weekly">Twice Weekly</option>
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Biweekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Collection Time Start
                </label>
                <input
                  type="time"
                  {...register("collection_time_start")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Collection Time End
                </label>
                <input
                  type="time"
                  {...register("collection_time_end")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>

            {watchFrequency !== "daily" && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Collection Days
                </label>
                <Controller
                  name="collection_days"
                  control={control}
                  render={({ field }) => (
                    <div className="flex flex-wrap gap-2">
                      {DAYS_OF_WEEK.map((day) => (
                        <label
                          key={day.value}
                          className={`flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer transition-colors ${
                            field.value.includes(day.value)
                              ? "bg-primary text-white border-primary"
                              : "bg-white text-gray-700 border-gray-300 hover:border-primary"
                          }`}
                        >
                          <input
                            type="checkbox"
                            value={day.value}
                            checked={field.value.includes(day.value)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                field.onChange([...field.value, day.value]);
                              } else {
                                field.onChange(
                                  field.value.filter((d) => d !== day.value)
                                );
                              }
                            }}
                            className="sr-only"
                          />
                          {day.label}
                        </label>
                      ))}
                    </div>
                  )}
                />
              </div>
            )}
          </Card>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/operations/routes")}
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
                ? "Update Route"
                : "Create Route"}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
};

export default RouteFormPage;
