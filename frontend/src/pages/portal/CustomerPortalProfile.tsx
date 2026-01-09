/**
 * Customer Portal Profile Page
 * Allows customers to view and update their profile information
 */

import { useState } from "react";
import { CustomerPortalLayout } from "../../components/layout/CustomerPortalLayout";
import { Card, CardHeader } from "../../components/common/Card";
import { PageLoader } from "../../components/common/LoadingSpinner";
import { CustomerCard } from "../../components/customer/CustomerCard";
import {
  usePortalProfile,
  usePortalPaymentMethods,
  useUpdatePortalProfile,
} from "../../hooks/useCustomerPortal";

export const CustomerPortalProfile = () => {
  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
  } = usePortalProfile();
  const { data: paymentMethods, isLoading: pmLoading } =
    usePortalPaymentMethods();
  const updateProfile = useUpdatePortalProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    billing_address: {
      street: "",
      city: "",
      state: "",
      postal_code: "",
      country: "Rwanda",
    },
    shipping_address: {
      street: "",
      city: "",
      state: "",
      postal_code: "",
      country: "Rwanda",
    },
  });

  // Initialize form data when profile loads
  const initForm = () => {
    if (profile) {
      setFormData({
        phone: profile.phone || "",
        billing_address: {
          street: profile.billing_address?.street || "",
          city: profile.billing_address?.city || "",
          state: profile.billing_address?.state || "",
          postal_code: profile.billing_address?.postal_code || "",
          country: profile.billing_address?.country || "Rwanda",
        },
        shipping_address: {
          street: profile.shipping_address?.street || "",
          city: profile.shipping_address?.city || "",
          state: profile.shipping_address?.state || "",
          postal_code: profile.shipping_address?.postal_code || "",
          country: profile.shipping_address?.country || "Rwanda",
        },
      });
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    try {
      await updateProfile.mutateAsync(formData);
      setIsEditing(false);
    } catch {
      alert("Failed to update profile");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (profileLoading) {
    return (
      <CustomerPortalLayout>
        <PageLoader />
      </CustomerPortalLayout>
    );
  }

  if (profileError) {
    return (
      <CustomerPortalLayout>
        <div className="p-6">
          <div className="text-center py-12">
            <p className="text-danger">Failed to load profile</p>
          </div>
        </div>
      </CustomerPortalLayout>
    );
  }

  return (
    <CustomerPortalLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">My Profile</h1>
            <p className="text-text-secondary mt-1">
              Manage your account information
            </p>
          </div>
          {!isEditing && (
            <button
              onClick={initForm}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
            >
              Edit Profile
            </button>
          )}
        </div>

        {/* Customer Card */}
        {profile && (
          <CustomerCard
            customerName={profile.full_name || ""}
            cardNumber={profile.card_number || "N/A"}
            location={profile.location_display || "N/A"}
            serviceProvider={profile.service_provider || "N/A"}
            accountStatus={profile.status || "active"}
            prepaidBalance={profile.prepaid_balance || 0}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader title="Basic Information" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Full Name
                  </label>
                  <p className="text-text-primary font-medium">
                    {profile?.full_name}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Company
                  </label>
                  <p className="text-text-primary font-medium">
                    {profile?.company_name || "-"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Email
                  </label>
                  <p className="text-text-primary font-medium">
                    {profile?.email}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Phone
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-bg-subtle border border-border-base rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  ) : (
                    <p className="text-text-primary font-medium">
                      {profile?.phone || "-"}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Payment Terms
                  </label>
                  <p className="text-text-primary font-medium capitalize">
                    {profile?.payment_terms?.replace("_", " ") || "-"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Account Status
                  </label>
                  <span
                    className={`inline-flex px-2 py-1 text-sm rounded-full font-medium ${
                      profile?.status === "active"
                        ? "bg-success-light text-success"
                        : profile?.status === "suspended"
                        ? "bg-warning-light text-warning"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {profile?.status
                      ? profile.status.charAt(0).toUpperCase() +
                        profile.status.slice(1)
                      : "-"}
                  </span>
                </div>
              </div>
            </Card>

            {/* Billing Address */}
            <Card>
              <CardHeader title="Billing Address" />
              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={formData.billing_address.street}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          billing_address: {
                            ...formData.billing_address,
                            street: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 bg-bg-subtle border border-border-base rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={formData.billing_address.city}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          billing_address: {
                            ...formData.billing_address,
                            city: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 bg-bg-subtle border border-border-base rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      Province/State
                    </label>
                    <input
                      type="text"
                      value={formData.billing_address.state}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          billing_address: {
                            ...formData.billing_address,
                            state: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 bg-bg-subtle border border-border-base rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      value={formData.billing_address.postal_code}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          billing_address: {
                            ...formData.billing_address,
                            postal_code: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 bg-bg-subtle border border-border-base rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      value={formData.billing_address.country}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          billing_address: {
                            ...formData.billing_address,
                            country: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 bg-bg-subtle border border-border-base rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              ) : (
                <div className="mt-4">
                  {profile?.billing_address?.street ? (
                    <address className="text-text-primary not-italic">
                      {profile.billing_address.street}
                      <br />
                      {profile.billing_address.city},{" "}
                      {profile.billing_address.state}{" "}
                      {profile.billing_address.postal_code}
                      <br />
                      {profile.billing_address.country}
                    </address>
                  ) : (
                    <p className="text-text-muted">
                      No billing address on file
                    </p>
                  )}
                </div>
              )}
            </Card>

            {/* Save/Cancel Buttons */}
            {isEditing && (
              <div className="flex justify-end gap-3">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-bg-subtle text-text-primary rounded-lg hover:bg-bg-muted transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={updateProfile.isPending}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium disabled:opacity-50"
                >
                  {updateProfile.isPending ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Payment Methods */}
            <Card>
              <CardHeader title="Payment Methods" />
              <div className="mt-4 space-y-3">
                {pmLoading ? (
                  <p className="text-text-muted text-sm">Loading...</p>
                ) : paymentMethods && paymentMethods.length > 0 ? (
                  paymentMethods.map((pm) => (
                    <div
                      key={pm.id}
                      className="flex items-center gap-3 p-3 bg-bg-subtle rounded-lg"
                    >
                      <div className="w-10 h-10 bg-bg-muted rounded-lg flex items-center justify-center">
                        {pm.type === "card" ? (
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
                              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                            />
                          </svg>
                        ) : (
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
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-text-primary">
                          {pm.type === "card"
                            ? `${pm.card_brand} •••• ${pm.card_last_four}`
                            : pm.type === "bank_account"
                            ? `${pm.bank_name} •••• ${pm.account_last_four}`
                            : pm.nickname || pm.type}
                        </p>
                        {pm.is_default && (
                          <span className="text-xs text-primary">Default</span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-text-muted text-sm">
                    No payment methods on file
                  </p>
                )}
              </div>
            </Card>

            {/* Account Info */}
            <Card>
              <CardHeader title="Account Info" />
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Customer ID</span>
                  <span className="text-text-primary font-mono text-xs">
                    {profile?.id?.slice(0, 8)}...
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Member Since</span>
                  <span className="text-text-primary">
                    {profile?.created_at
                      ? new Date(profile.created_at).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            year: "numeric",
                          }
                        )
                      : "-"}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </CustomerPortalLayout>
  );
};

export default CustomerPortalProfile;
