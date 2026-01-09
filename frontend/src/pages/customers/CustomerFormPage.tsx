/**
 * Customer Form Page
 * Create and edit customer records
 */

import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  useCustomer,
  useCreateCustomer,
  useUpdateCustomer,
} from "../../hooks/useCustomers";
import { AppLayout } from "../../components/layout";
import { PageHeader, Card, Button } from "../../components/common";
import { PageLoader } from "../../components/common/LoadingSpinner";
import { Input } from "../../components/common/Input";
import type {
  CreateCustomerData,
  UpdateCustomerData,
} from "../../services/customerService";

// Validation schema - simplified for IsukuPay
const customerSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  company_name: z.string().optional(),
  phone: z.string().min(1, "Phone number is required"),
  district: z.string().optional(),
  sector: z.string().optional(),
  cell: z.string().optional(),
  village: z.string().optional(),
  street: z.string().optional(),
  notes: z.string().optional(),
  tags: z.string().optional(), // Comma-separated tags
});

type CustomerFormData = z.infer<typeof customerSchema>;

const CustomerFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  // Fetch customer if editing
  const { data: customer, isLoading: loadingCustomer } = useCustomer(id!, !!id);

  // Mutations
  const createCustomer = useCreateCustomer();
  const updateCustomer = useUpdateCustomer();

  // Form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {},
  });

  // Populate form when customer data loads
  useEffect(() => {
    if (customer && isEditMode) {
      reset({
        full_name: customer.full_name,
        company_name: customer.company_name || "",
        phone: customer.phone || "",
        district: customer.billing_address?.district || "",
        sector: customer.billing_address?.sector || "",
        cell: customer.billing_address?.cell || "",
        village: customer.billing_address?.village || "",
        street: customer.billing_address?.street || "",
        notes: customer.notes || "",
        tags: customer.tags?.join(", ") || "",
      });
    }
  }, [customer, isEditMode, reset]);

  const onSubmit = async (data: CustomerFormData) => {
    try {
      // Build address for Rwanda structure
      const billingAddress = {
        district: data.district || "",
        sector: data.sector || "",
        cell: data.cell || "",
        village: data.village || "",
        street: data.street || "",
      };

      // Parse tags
      const tags = data.tags
        ? data.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        : [];

      // Split full name into first and last name
      const nameParts = data.full_name.trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || nameParts[0];

      if (isEditMode && id) {
        // Update existing customer
        const updateData: UpdateCustomerData = {
          first_name: firstName,
          last_name: lastName,
          company_name: data.company_name || undefined,
          phone: data.phone || undefined,
          billing_address: billingAddress,
          notes: data.notes || undefined,
          tags: tags.length > 0 ? tags : undefined,
        };

        await updateCustomer.mutateAsync({ id, data: updateData });
        alert("Customer updated successfully");
        navigate(`/customers/${id}`);
      } else {
        // Create new customer
        const createData: CreateCustomerData = {
          first_name: firstName,
          last_name: lastName,
          company_name: data.company_name || undefined,
          phone: data.phone || undefined,
          billing_address: billingAddress,
          notes: data.notes || undefined,
          tags: tags.length > 0 ? tags : undefined,
        };

        const newCustomer = await createCustomer.mutateAsync(createData);
        alert("Customer created successfully");
        navigate(`/customers/${newCustomer.id}`);
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to save customer");
    }
  };

  if (loadingCustomer && isEditMode) {
    return (
      <AppLayout>
        <PageLoader />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageHeader
        title={isEditMode ? "Edit Customer" : "New Customer"}
        backHref={isEditMode ? `/customers/${id}` : "/customers"}
      />

      {/* Form */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <h2 className="text-xl font-bold text-text-primary mb-6">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label
                  htmlFor="full_name"
                  className="block text-sm font-medium text-text-primary mb-2"
                >
                  Full Name <span className="text-danger">*</span>
                </label>
                <Input
                  id="full_name"
                  {...register("full_name")}
                  error={errors.full_name?.message}
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-text-primary mb-2"
                >
                  Phone <span className="text-danger">*</span>
                </label>
                <Input
                  id="phone"
                  {...register("phone")}
                  error={errors.phone?.message}
                  placeholder="+250..."
                />
              </div>

              <div>
                <label
                  htmlFor="company_name"
                  className="block text-sm font-medium text-text-primary mb-2"
                >
                  Company Name
                </label>
                <Input
                  id="company_name"
                  {...register("company_name")}
                  error={errors.company_name?.message}
                />
              </div>
            </div>
          </Card>

          {/* Customer Address */}
          <Card>
            <h2 className="text-xl font-bold text-text-primary mb-6">
              Customer Address
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="district"
                  className="block text-sm font-medium text-text-primary mb-2"
                >
                  District
                </label>
                <Input
                  id="district"
                  {...register("district")}
                  error={errors.district?.message}
                  placeholder="e.g., Gasabo"
                />
              </div>

              <div>
                <label
                  htmlFor="sector"
                  className="block text-sm font-medium text-text-primary mb-2"
                >
                  Sector
                </label>
                <Input
                  id="sector"
                  {...register("sector")}
                  error={errors.sector?.message}
                  placeholder="e.g., Remera"
                />
              </div>

              <div>
                <label
                  htmlFor="cell"
                  className="block text-sm font-medium text-text-primary mb-2"
                >
                  Cell
                </label>
                <Input
                  id="cell"
                  {...register("cell")}
                  error={errors.cell?.message}
                />
              </div>

              <div>
                <label
                  htmlFor="village"
                  className="block text-sm font-medium text-text-primary mb-2"
                >
                  Village
                </label>
                <Input
                  id="village"
                  {...register("village")}
                  error={errors.village?.message}
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="street"
                  className="block text-sm font-medium text-text-primary mb-2"
                >
                  Street Address (Optional)
                </label>
                <Input
                  id="street"
                  {...register("street")}
                  error={errors.street?.message}
                  placeholder="House number, building name, etc."
                />
              </div>
            </div>
          </Card>

          {/* Additional Information */}
          <Card>
            <h2 className="text-xl font-bold text-text-primary mb-6">
              Additional Information
            </h2>
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="tags"
                  className="block text-sm font-medium text-text-primary mb-2"
                >
                  Tags
                </label>
                <Input
                  id="tags"
                  {...register("tags")}
                  error={errors.tags?.message}
                  placeholder="VIP, Premium, etc. (comma-separated)"
                />
                <p className="mt-1 text-sm text-text-secondary">
                  Separate multiple tags with commas
                </p>
              </div>

              <div>
                <label
                  htmlFor="notes"
                  className="block text-sm font-medium text-text-primary mb-2"
                >
                  Notes
                </label>
                <textarea
                  id="notes"
                  {...register("notes")}
                  rows={4}
                  className="w-full px-3 py-2 border border-border-base rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-bg-base text-text-primary"
                  placeholder="Add any additional notes about this customer..."
                />
                {errors.notes && (
                  <p className="mt-1 text-sm text-danger">
                    {errors.notes.message}
                  </p>
                )}
              </div>
            </div>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-6">
            <Button
              type="button"
              onClick={() =>
                navigate(isEditMode ? `/customers/${id}` : "/customers")
              }
              variant="outline"
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : isEditMode
                ? "Update Customer"
                : "Create Customer"}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
};

export default CustomerFormPage;
