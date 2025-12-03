/**
 * Service Area Form Page
 * Create and edit service areas for waste collection operations
 */

import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  useServiceArea,
  useCreateServiceArea,
  useUpdateServiceArea,
} from "../../hooks/useOperations";
import type { CreateServiceAreaData } from "../../services/operationsService";
import { AppLayout } from "../../components/layout";
import { PageHeader, Card, Button } from "../../components/common";
import { PageLoader } from "../../components/common/LoadingSpinner";

interface ServiceAreaFormData {
  code: string;
  name: string;
  description: string;
  status: "active" | "inactive" | "planned";
  province: string;
  district: string;
  sector: string;
  cell: string;
  village: string;
  latitude: string;
  longitude: string;
  estimated_households: string;
  estimated_customers: string;
}

const ServiceAreaFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  // Fetch existing data if editing
  const { data: serviceArea, isLoading: isLoadingArea } = useServiceArea(
    id || "",
    isEditing
  );

  // Mutations
  const createMutation = useCreateServiceArea();
  const updateMutation = useUpdateServiceArea();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ServiceAreaFormData>({
    defaultValues: {
      code: "",
      name: "",
      description: "",
      status: "active",
      province: "",
      district: "",
      sector: "",
      cell: "",
      village: "",
      latitude: "",
      longitude: "",
      estimated_households: "0",
      estimated_customers: "0",
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (serviceArea) {
      reset({
        code: serviceArea.code,
        name: serviceArea.name,
        description: serviceArea.description || "",
        status: serviceArea.status,
        province: serviceArea.province || "",
        district: serviceArea.district || "",
        sector: serviceArea.sector || "",
        cell: serviceArea.cell || "",
        village: serviceArea.village || "",
        latitude: serviceArea.latitude?.toString() || "",
        longitude: serviceArea.longitude?.toString() || "",
        estimated_households:
          serviceArea.estimated_households?.toString() || "0",
        estimated_customers: serviceArea.estimated_customers?.toString() || "0",
      });
    }
  }, [serviceArea, reset]);

  const onSubmit = async (data: ServiceAreaFormData) => {
    try {
      const payload: CreateServiceAreaData = {
        code: data.code,
        name: data.name,
        description: data.description || undefined,
        status: data.status,
        province: data.province,
        district: data.district,
        sector: data.sector,
        cell: data.cell || undefined,
        village: data.village || undefined,
        latitude: data.latitude ? parseFloat(data.latitude) : undefined,
        longitude: data.longitude ? parseFloat(data.longitude) : undefined,
        estimated_households: parseInt(data.estimated_households) || 0,
        estimated_customers: parseInt(data.estimated_customers) || 0,
      };

      if (isEditing && id) {
        await updateMutation.mutateAsync({ id, data: payload });
      } else {
        await createMutation.mutateAsync(payload);
      }

      navigate("/operations/service-areas");
    } catch (error) {
      console.error("Failed to save service area:", error);
      alert("Failed to save service area. Please try again.");
    }
  };

  if (isEditing && isLoadingArea) {
    return (
      <AppLayout>
        <PageLoader />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageHeader
        title={isEditing ? "Edit Service Area" : "New Service Area"}
        subtitle={
          isEditing
            ? `Editing ${serviceArea?.name || "service area"}`
            : "Create a new geographic area for waste collection"
        }
        actions={
          <Button
            variant="outline"
            onClick={() => navigate("/operations/service-areas")}
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
                  placeholder="e.g., SA-001"
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
                  placeholder="e.g., Kimironko Cell"
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
                  placeholder="Additional details about the service area..."
                />
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
                  <option value="planned">Planned</option>
                </select>
              </div>
            </div>
          </Card>

          <Card className="p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Geographic Location
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Province <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  {...register("province", {
                    required: "Province is required",
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="e.g., Kigali City"
                />
                {errors.province && (
                  <p className="mt-1 text-sm text-danger">
                    {errors.province.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  District <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  {...register("district", {
                    required: "District is required",
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="e.g., Gasabo"
                />
                {errors.district && (
                  <p className="mt-1 text-sm text-danger">
                    {errors.district.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sector <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  {...register("sector", { required: "Sector is required" })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="e.g., Kimironko"
                />
                {errors.sector && (
                  <p className="mt-1 text-sm text-danger">
                    {errors.sector.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cell
                </label>
                <input
                  type="text"
                  {...register("cell")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="e.g., Bibare"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Village
                </label>
                <input
                  type="text"
                  {...register("village")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="e.g., Umujyi"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Latitude
                </label>
                <input
                  type="text"
                  {...register("latitude", {
                    pattern: {
                      value: /^-?\d+\.?\d*$/,
                      message: "Invalid latitude format",
                    },
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="e.g., -1.9403"
                />
                {errors.latitude && (
                  <p className="mt-1 text-sm text-danger">
                    {errors.latitude.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Longitude
                </label>
                <input
                  type="text"
                  {...register("longitude", {
                    pattern: {
                      value: /^-?\d+\.?\d*$/,
                      message: "Invalid longitude format",
                    },
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="e.g., 30.1078"
                />
                {errors.longitude && (
                  <p className="mt-1 text-sm text-danger">
                    {errors.longitude.message}
                  </p>
                )}
              </div>
            </div>
          </Card>

          <Card className="p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Operational Estimates
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estimated Households
                </label>
                <input
                  type="number"
                  {...register("estimated_households")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="0"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estimated Customers
                </label>
                <input
                  type="number"
                  {...register("estimated_customers")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>
          </Card>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/operations/service-areas")}
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
                ? "Update Service Area"
                : "Create Service Area"}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
};

export default ServiceAreaFormPage;
