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

// Validation schema
const customerSchema = z.object({
  email: z.string().email("Invalid email address"),
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  company_name: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  tax_id: z.string().optional(),
  industry: z.string().optional(),
  payment_terms: z.enum(["immediate", "net_15", "net_30", "net_60", "net_90"]),
  credit_limit: z.number().min(0, "Credit limit must be positive").optional(),
  preferred_payment_method: z.string().optional(),
  billing_street: z.string().optional(),
  billing_city: z.string().optional(),
  billing_state: z.string().optional(),
  billing_postal_code: z.string().optional(),
  billing_country: z.string().optional(),
  shipping_street: z.string().optional(),
  shipping_city: z.string().optional(),
  shipping_state: z.string().optional(),
  shipping_postal_code: z.string().optional(),
  shipping_country: z.string().optional(),
  notes: z.string().optional(),
  tags: z.string().optional(), // Comma-separated tags
  create_user: z.boolean().optional(),
  password: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.create_user && (!data.password || data.password.length < 8)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Password must be at least 8 characters when creating a user account",
      path: ["password"],
    });
  }
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
    watch,
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      payment_terms: "net_30",
      credit_limit: 0,
    },
  });

  // Copy billing to shipping
  const copyBillingToShipping = () => {
    const billing = watch();
    reset({
      ...billing,
      shipping_street: billing.billing_street,
      shipping_city: billing.billing_city,
      shipping_state: billing.billing_state,
      shipping_postal_code: billing.billing_postal_code,
      shipping_country: billing.billing_country,
    });
  };

  // Populate form when customer data loads
  useEffect(() => {
    if (customer && isEditMode) {
      reset({
        email: customer.email,
        full_name: customer.full_name,
        company_name: customer.company_name || "",
        phone: customer.phone || "",
        website: customer.website || "",
        tax_id: customer.tax_id || "",
        industry: customer.industry || "",
        payment_terms: customer.payment_terms,
        credit_limit: parseFloat(customer.credit_limit),
        preferred_payment_method: customer.preferred_payment_method || "",
        billing_street: customer.billing_address?.street || "",
        billing_city: customer.billing_address?.city || "",
        billing_state: customer.billing_address?.state || "",
        billing_postal_code: customer.billing_address?.postal_code || "",
        billing_country: customer.billing_address?.country || "",
        shipping_street: customer.shipping_address?.street || "",
        shipping_city: customer.shipping_address?.city || "",
        shipping_state: customer.shipping_address?.state || "",
        shipping_postal_code: customer.shipping_address?.postal_code || "",
        shipping_country: customer.shipping_address?.country || "",
        notes: customer.notes || "",
        tags: customer.tags?.join(", ") || "",
      });
    }
  }, [customer, isEditMode, reset]);

  const onSubmit = async (data: CustomerFormData) => {
    try {
      // Build addresses
      const billingAddress =
        data.billing_street || data.billing_city
          ? {
              street: data.billing_street || "",
              city: data.billing_city || "",
              state: data.billing_state || "",
              postal_code: data.billing_postal_code || "",
              country: data.billing_country || "",
            }
          : undefined;

      const shippingAddress =
        data.shipping_street || data.shipping_city
          ? {
              street: data.shipping_street || "",
              city: data.shipping_city || "",
              state: data.shipping_state || "",
              postal_code: data.shipping_postal_code || "",
              country: data.shipping_country || "",
            }
          : undefined;

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
          email: data.email,
          first_name: firstName,
          last_name: lastName,
          company_name: data.company_name || undefined,
          phone: data.phone || undefined,
          website: data.website || undefined,
          tax_id: data.tax_id || undefined,
          industry: data.industry || undefined,
          payment_terms: data.payment_terms,
          credit_limit: data.credit_limit?.toString() || "0",
          preferred_payment_method: data.preferred_payment_method || undefined,
          billing_address: billingAddress,
          shipping_address: shippingAddress,
          notes: data.notes || undefined,
          tags: tags.length > 0 ? tags : undefined,
        };

        await updateCustomer.mutateAsync({ id, data: updateData });
        alert("Customer updated successfully");
        navigate(`/customers/${id}`);
      } else {
        // Create new customer
        const createData: CreateCustomerData = {
          email: data.email,
          first_name: firstName,
          last_name: lastName,
          company_name: data.company_name || undefined,
          phone: data.phone || undefined,
          website: data.website || undefined,
          tax_id: data.tax_id || undefined,
          industry: data.industry || undefined,
          payment_terms: data.payment_terms,
          credit_limit: data.credit_limit?.toString() || "0",
          preferred_payment_method: data.preferred_payment_method || undefined,
          billing_address: billingAddress,
          shipping_address: shippingAddress,
          notes: data.notes || undefined,
          tags: tags.length > 0 ? tags : undefined,
          create_user: data.create_user,
          password: data.password,
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

              <div className="md:col-span-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-text-primary mb-2"
                >
                  Email <span className="text-danger">*</span>
                </label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  error={errors.email?.message}
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-text-primary mb-2"
                >
                  Phone
                </label>
                <Input
                  id="phone"
                  {...register("phone")}
                  error={errors.phone?.message}
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

              <div>
                <label
                  htmlFor="industry"
                  className="block text-sm font-medium text-text-primary mb-2"
                >
                  Industry
                </label>
                <Input
                  id="industry"
                  {...register("industry")}
                  error={errors.industry?.message}
                />
              </div>

              <div>
                <label
                  htmlFor="website"
                  className="block text-sm font-medium text-text-primary mb-2"
                >
                  Website
                </label>
                <Input
                  id="website"
                  type="url"
                  {...register("website")}
                  error={errors.website?.message}
                  placeholder="https://example.com"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="tax_id"
                  className="block text-sm font-medium text-text-primary mb-2"
                >
                  Tax ID
                </label>
                <Input
                  id="tax_id"
                  {...register("tax_id")}
                  error={errors.tax_id?.message}
                />
              </div>
            </div>
          </Card>

          {/* Payment Settings */}
          <Card>
            <h2 className="text-xl font-bold text-text-primary mb-6">
              Payment Settings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="payment_terms"
                  className="block text-sm font-medium text-text-primary mb-2"
                >
                  Payment Terms <span className="text-danger">*</span>
                </label>
                <select
                  id="payment_terms"
                  {...register("payment_terms")}
                  className="w-full px-3 py-2 border border-border-base rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-bg-base text-text-primary"
                >
                  <option value="immediate">Immediate</option>
                  <option value="net_15">Net 15</option>
                  <option value="net_30">Net 30</option>
                  <option value="net_60">Net 60</option>
                  <option value="net_90">Net 90</option>
                </select>
                {errors.payment_terms && (
                  <p className="mt-1 text-sm text-danger">
                    {errors.payment_terms.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="credit_limit"
                  className="block text-sm font-medium text-text-primary mb-2"
                >
                  Credit Limit
                </label>
                <Input
                  id="credit_limit"
                  type="number"
                  step="0.01"
                  {...register("credit_limit", { valueAsNumber: true })}
                  error={errors.credit_limit?.message}
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="preferred_payment_method"
                  className="block text-sm font-medium text-text-primary mb-2"
                >
                  Preferred Payment Method
                </label>
                <Input
                  id="preferred_payment_method"
                  {...register("preferred_payment_method")}
                  error={errors.preferred_payment_method?.message}
                  placeholder="e.g., Credit Card, Bank Transfer"
                />
              </div>
            </div>
          </Card>

          {/* Billing Address */}
          <Card>
            <h2 className="text-xl font-bold text-text-primary mb-6">
              Billing Address
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label
                  htmlFor="billing_street"
                  className="block text-sm font-medium text-text-primary mb-2"
                >
                  Street Address
                </label>
                <Input
                  id="billing_street"
                  {...register("billing_street")}
                  error={errors.billing_street?.message}
                />
              </div>

              <div>
                <label
                  htmlFor="billing_city"
                  className="block text-sm font-medium text-text-primary mb-2"
                >
                  City
                </label>
                <Input
                  id="billing_city"
                  {...register("billing_city")}
                  error={errors.billing_city?.message}
                />
              </div>

              <div>
                <label
                  htmlFor="billing_state"
                  className="block text-sm font-medium text-text-primary mb-2"
                >
                  State/Province
                </label>
                <Input
                  id="billing_state"
                  {...register("billing_state")}
                  error={errors.billing_state?.message}
                />
              </div>

              <div>
                <label
                  htmlFor="billing_postal_code"
                  className="block text-sm font-medium text-text-primary mb-2"
                >
                  Postal Code
                </label>
                <Input
                  id="billing_postal_code"
                  {...register("billing_postal_code")}
                  error={errors.billing_postal_code?.message}
                />
              </div>

              <div>
                <label
                  htmlFor="billing_country"
                  className="block text-sm font-medium text-text-primary mb-2"
                >
                  Country
                </label>
                <Input
                  id="billing_country"
                  {...register("billing_country")}
                  error={errors.billing_country?.message}
                />
              </div>
            </div>
          </Card>

          {/* Shipping Address */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-text-primary">
                Shipping Address
              </h2>
              <Button
                type="button"
                onClick={copyBillingToShipping}
                variant="outline"
                size="sm"
              >
                Copy from Billing
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label
                  htmlFor="shipping_street"
                  className="block text-sm font-medium text-text-primary mb-2"
                >
                  Street Address
                </label>
                <Input
                  id="shipping_street"
                  {...register("shipping_street")}
                  error={errors.shipping_street?.message}
                />
              </div>

              <div>
                <label
                  htmlFor="shipping_city"
                  className="block text-sm font-medium text-text-primary mb-2"
                >
                  City
                </label>
                <Input
                  id="shipping_city"
                  {...register("shipping_city")}
                  error={errors.shipping_city?.message}
                />
              </div>

              <div>
                <label
                  htmlFor="shipping_state"
                  className="block text-sm font-medium text-text-primary mb-2"
                >
                  State/Province
                </label>
                <Input
                  id="shipping_state"
                  {...register("shipping_state")}
                  error={errors.shipping_state?.message}
                />
              </div>

              <div>
                <label
                  htmlFor="shipping_postal_code"
                  className="block text-sm font-medium text-text-primary mb-2"
                >
                  Postal Code
                </label>
                <Input
                  id="shipping_postal_code"
                  {...register("shipping_postal_code")}
                  error={errors.shipping_postal_code?.message}
                />
              </div>

              <div>
                <label
                  htmlFor="shipping_country"
                  className="block text-sm font-medium text-text-primary mb-2"
                >
                  Country
                </label>
                <Input
                  id="shipping_country"
                  {...register("shipping_country")}
                  error={errors.shipping_country?.message}
                />
              </div>
            </div>
          </Card>

          {/* User Account */}
          {!isEditMode && (
            <Card>
              <h2 className="text-xl font-bold text-text-primary mb-6">
                User Account
              </h2>
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="create_user"
                    {...register("create_user")}
                    className="w-4 h-4 text-primary border-border-base rounded focus:ring-primary"
                  />
                  <label
                    htmlFor="create_user"
                    className="text-sm font-medium text-text-primary"
                  >
                    Create user account for this customer
                  </label>
                </div>

                {watch("create_user") && (
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-text-primary mb-2"
                    >
                      Password <span className="text-danger">*</span>
                    </label>
                    <Input
                      id="password"
                      type="password"
                      {...register("password")}
                      error={errors.password?.message}
                      placeholder="Enter password for the user"
                    />
                    <p className="mt-1 text-sm text-text-secondary">
                      The user will be able to log in with their email address.
                    </p>
                  </div>
                )}
              </div>
            </Card>
          )}

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
