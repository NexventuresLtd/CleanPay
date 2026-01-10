/**
 * Customer Portal Dashboard
 * Main dashboard view for customer users showing their account summary
 */

import { CustomerPortalLayout } from "../../components/layout/CustomerPortalLayout";
import { Card } from "../../components/common/Card";
import { StatusBadge } from "../../components/common/Badge";
import { PageLoader } from "../../components/common/LoadingSpinner";
import { CustomerCard } from "../../components/customer/CustomerCard";
import {
  usePortalDashboard,
  usePortalProfile,
} from "../../hooks/useCustomerPortal";

export const CustomerPortalDashboard = () => {
  const { data: dashboard, isLoading, error } = usePortalDashboard();
  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
  } = usePortalProfile();

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
            <p className="text-danger">Failed to load dashboard</p>
          </div>
        </div>
      </CustomerPortalLayout>
    );
  }

  return (
    <CustomerPortalLayout>
      <div className="p-6 space-y-6">
        {/* Welcome Header */}
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            Welcome back, {dashboard?.customer.full_name}!
          </h1>
          <p className="text-text-secondary mt-1">
            Here's an overview of your account
          </p>
        </div>

        {/* Customer Card */}
        {dashboard && (
          <CustomerCard
            customerName={profile.full_name || ""}
            cardNumber={profile.card_number || "N/A"}
            location={profile.location_display || "N/A"}
            serviceProvider={profile.service_provider || "N/A"}
            accountStatus={profile.status || "active"}
            prepaidBalance={profile.prepaid_balance || 0}
          />
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-6">
          {/* Upcoming Collections */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-text-primary">
                Upcoming Collections
              </h2>
              <a
                href="/portal/schedules"
                className="text-sm text-primary hover:underline"
              >
                View all
              </a>
            </div>
            {dashboard?.upcoming_schedules &&
            dashboard.upcoming_schedules.length > 0 ? (
              <div className="space-y-3">
                {dashboard.upcoming_schedules.map((schedule) => (
                  <div
                    key={schedule.id}
                    className="flex items-center gap-4 p-3 bg-bg-subtle rounded-lg"
                  >
                    <div className="w-12 h-12 bg-primary-light rounded-lg flex flex-col items-center justify-center">
                      <span className="text-sm font-bold text-primary">
                        {new Date(schedule.scheduled_date).getDate()}
                      </span>
                      <span className="text-xs text-primary uppercase">
                        {new Date(schedule.scheduled_date).toLocaleDateString(
                          "en-US",
                          { month: "short" }
                        )}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-text-primary">
                        {formatDate(schedule.scheduled_date)}
                      </p>
                      <p className="text-sm text-text-secondary">
                        {formatTime(schedule.scheduled_time_start)} -{" "}
                        {formatTime(schedule.scheduled_time_end)}
                      </p>
                    </div>
                    <StatusBadge status={schedule.status} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-text-secondary">
                <svg
                  className="w-12 h-12 mx-auto mb-3 text-text-muted"
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
                <p>No upcoming collections scheduled</p>
              </div>
            )}
          </Card>

          {/* Pending Invoices */}
          {/* <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-text-primary">
                Pending Invoices
              </h2>
              <a
                href="/portal/invoices"
                className="text-sm text-primary hover:underline"
              >
                View all
              </a>
            </div>
            {dashboard?.pending_invoices &&
            dashboard.pending_invoices.length > 0 ? (
              <div className="space-y-3">
                {dashboard.pending_invoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between p-3 bg-bg-subtle rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-text-primary">
                        Invoice #{invoice.invoice_number}
                      </p>
                      <p className="text-sm text-text-secondary">
                        Due {formatDate(invoice.due_date)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-text-primary">
                        RWF {invoice.amount?.toLocaleString()}
                      </p>
                      <StatusBadge status={invoice.status} size="sm" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-text-secondary">
                <svg
                  className="w-12 h-12 mx-auto mb-3 text-text-muted"
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
                <p>No pending invoices</p>
              </div>
            )}
          </Card> */}
        </div>

        {/* Recent Payments */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-text-primary">
              Recent Payments
            </h2>
            <a
              href="/portal/payments"
              className="text-sm text-primary hover:underline"
            >
              View all
            </a>
          </div>
          {dashboard?.recent_payments &&
          dashboard.recent_payments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border-base">
                    <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">
                      Reference
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">
                      Method
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-text-secondary">
                      Amount
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-text-secondary">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.recent_payments.map((payment) => (
                    <tr
                      key={payment.id}
                      className="border-b border-border-base last:border-0"
                    >
                      <td className="py-3 px-4 text-sm text-text-primary">
                        {formatDate(payment.payment_date)}
                      </td>
                      <td className="py-3 px-4 text-sm text-text-primary">
                        {payment.reference_number}
                      </td>
                      <td className="py-3 px-4 text-sm text-text-secondary capitalize">
                        {payment.payment_method}
                      </td>
                      <td className="py-3 px-4 text-sm text-text-primary text-right font-medium">
                        RWF {payment.amount?.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <StatusBadge status={payment.status} size="sm" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-text-secondary">
              <svg
                className="w-12 h-12 mx-auto mb-3 text-text-muted"
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
              <p>No payment history yet</p>
            </div>
          )}
        </Card>
      </div>
    </CustomerPortalLayout>
  );
};

export default CustomerPortalDashboard;
