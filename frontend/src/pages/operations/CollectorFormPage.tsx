/**
 * Collector Form Page
 * Create and edit waste collectors
 */

import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import {
  useCollector,
  useCreateCollector,
  useUpdateCollector,
  useServiceAreas,
} from "../../hooks/useOperations";
import type { CreateCollectorData } from "../../services/operationsService";
import { AppLayout } from "../../components/layout";
import { PageHeader, Card, Button } from "../../components/common";
import { PageLoader } from "../../components/common/LoadingSpinner";

interface CollectorFormData {
  employee_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  national_id: string;
  address: string;
  employment_type: "full_time" | "part_time" | "contractor" | "temporary";
  hire_date: string;
  termination_date: string;
  status: "active" | "on_leave" | "inactive" | "suspended";
  device_id: string;
  nfc_reader_id: string;
  service_areas: string[];
}

const CollectorFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  // Fetch existing data if editing
  const { data: collector, isLoading: isLoadingCollector } = useCollector(
    id || "",
    isEditing
  );

  // Fetch service areas for dropdown
  const { data: serviceAreasData } = useServiceAreas({ status: "active" });

  // Mutations
  const createMutation = useCreateCollector();
  const updateMutation = useUpdateCollector();

  const serviceAreas = serviceAreasData?.results || [];

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CollectorFormData>({
    defaultValues: {
      employee_id: "",
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      national_id: "",
      address: "",
      employment_type: "full_time",
      hire_date: new Date().toISOString().split("T")[0],
      termination_date: "",
      status: "active",
      device_id: "",
      nfc_reader_id: "",
      service_areas: [],
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (collector) {
      reset({
        employee_id: collector.employee_id,
        first_name: collector.first_name,
        last_name: collector.last_name,
        email: collector.email || "",
        phone: collector.phone || "",
        national_id: collector.national_id || "",
        address: collector.address || "",
        employment_type: collector.employment_type,
        hire_date: collector.hire_date || "",
        termination_date: collector.termination_date || "",
        status: collector.status,
        device_id: collector.device_id || "",
        nfc_reader_id: collector.nfc_reader_id || "",
        service_areas: collector.service_areas || [],
      });
    }
  }, [collector, reset]);

  const onSubmit = async (data: CollectorFormData) => {
    try {
      const payload: CreateCollectorData = {
        employee_id: data.employee_id,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
        national_id: data.national_id || undefined,
        address: data.address || undefined,
        employment_type: data.employment_type,
        hire_date: data.hire_date,
        termination_date: data.termination_date || undefined,
        status: data.status,
        device_id: data.device_id || undefined,
        nfc_reader_id: data.nfc_reader_id || undefined,
        service_areas:
          data.service_areas.length > 0 ? data.service_areas : undefined,
      };

      if (isEditing && id) {
        await updateMutation.mutateAsync({ id, data: payload });
      } else {
        await createMutation.mutateAsync(payload);
      }

      navigate("/operations/collectors");
    } catch (error) {
      console.error("Failed to save collector:", error);
      alert("Failed to save collector. Please try again.");
    }
  };

  if (isEditing && isLoadingCollector) {
    return (
      <AppLayout>
        <PageLoader />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageHeader
        title={isEditing ? "Edit Collector" : "New Collector"}
        subtitle={
          isEditing
            ? `Editing ${collector?.full_name || "collector"}`
            : "Register a new waste collector"
        }
        actions={
          <Button
            variant="outline"
            onClick={() => navigate("/operations/collectors")}
          >
            Cancel
          </Button>
        }
      />

      <div className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl">
          <Card className="p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employee ID <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  {...register("employee_id", {
                    required: "Employee ID is required",
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="e.g., COL-001"
                />
                {errors.employee_id && (
                  <p className="mt-1 text-sm text-danger">
                    {errors.employee_id.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  National ID
                </label>
                <input
                  type="text"
                  {...register("national_id")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Enter national ID number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  {...register("first_name", {
                    required: "First name is required",
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Enter first name"
                />
                {errors.first_name && (
                  <p className="mt-1 text-sm text-danger">
                    {errors.first_name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  {...register("last_name", {
                    required: "Last name is required",
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Enter last name"
                />
                {errors.last_name && (
                  <p className="mt-1 text-sm text-danger">
                    {errors.last_name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-danger">*</span>
                </label>
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="email@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-danger">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone <span className="text-danger">*</span>
                </label>
                <input
                  type="tel"
                  {...register("phone", { required: "Phone is required" })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="+250 7XX XXX XXX"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-danger">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  {...register("address")}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Enter full address"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Employment Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employment Type <span className="text-danger">*</span>
                </label>
                <select
                  {...register("employment_type", {
                    required: "Employment type is required",
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="full_time">Full Time</option>
                  <option value="part_time">Part Time</option>
                  <option value="contractor">Contractor</option>
                  <option value="temporary">Temporary</option>
                </select>
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
                  <option value="on_leave">On Leave</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hire Date <span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  {...register("hire_date", {
                    required: "Hire date is required",
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
                {errors.hire_date && (
                  <p className="mt-1 text-sm text-danger">
                    {errors.hire_date.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Termination Date
                </label>
                <input
                  type="date"
                  {...register("termination_date")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Equipment & Devices
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Device ID
                </label>
                <input
                  type="text"
                  {...register("device_id")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Mobile device ID"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NFC Reader ID
                </label>
                <input
                  type="text"
                  {...register("nfc_reader_id")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="NFC reader device ID"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Service Areas Assignment
            </h3>
            <Controller
              name="service_areas"
              control={control}
              render={({ field }) => (
                <div className="space-y-2">
                  {serviceAreas.length === 0 ? (
                    <p className="text-gray-500 text-sm">
                      No active service areas available. Create a service area
                      first.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {serviceAreas.map((area) => (
                        <label
                          key={area.id}
                          className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                            field.value.includes(area.id)
                              ? "bg-primary-light border-primary"
                              : "bg-white border-gray-300 hover:border-primary"
                          }`}
                        >
                          <input
                            type="checkbox"
                            value={area.id}
                            checked={field.value.includes(area.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                field.onChange([...field.value, area.id]);
                              } else {
                                field.onChange(
                                  field.value.filter((id) => id !== area.id)
                                );
                              }
                            }}
                            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                          />
                          <div>
                            <p className="font-medium text-gray-900">
                              {area.name}
                            </p>
                            <p className="text-xs text-gray-500">{area.code}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}
            />
          </Card>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/operations/collectors")}
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
                ? "Update Collector"
                : "Create Collector"}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
};

export default CollectorFormPage;
