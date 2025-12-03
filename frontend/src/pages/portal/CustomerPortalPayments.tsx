/**
 * Customer Portal Payments Page
 * Shows payment history for the customer
 */

import { useState } from "react";
import { CustomerPortalLayout } from "../../components/layout/CustomerPortalLayout";
import { Card } from "../../components/common/Card";
import { StatusBadge } from "../../components/common/Badge";
import { PageLoader } from "../../components/common/LoadingSpinner";
import { EmptyState } from "../../components/common/EmptyState";
import { usePortalPayments } from "../../hooks/useCustomerPortal";

export const CustomerPortalPayments = () => {
  const [statusFilter, setStatusFilter] = useState<string>("");
  const { data, isLoading, error } = usePortalPayments(
    statusFilter ? { status: statusFilter } : undefined
  );

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
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
            <p className="text-danger">Failed to load payment history</p>
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
            Payment History
          </h1>
          <p className="text-text-secondary mt-1">
            View your past payments and transactions
          </p>
        </div>

        {/* Filters */}
        <Card>
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-bg-subtle border border-border-base rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Payments List */}
        {data?.results && data.results.length > 0 ? (
          <Card padding="none">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border-base bg-bg-subtle">
                    <th className="text-left py-4 px-6 text-sm font-medium text-text-secondary">
                      Date
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-text-secondary">
                      Reference
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-text-secondary">
                      Payment Method
                    </th>
                    <th className="text-right py-4 px-6 text-sm font-medium text-text-secondary">
                      Amount
                    </th>
                    <th className="text-center py-4 px-6 text-sm font-medium text-text-secondary">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.results.map((payment) => (
                    <tr
                      key={payment.id}
                      className="border-b border-border-base last:border-0 hover:bg-bg-subtle transition-colors"
                    >
                      <td className="py-4 px-6 text-sm text-text-primary">
                        {formatDate(payment.payment_date)}
                      </td>
                      <td className="py-4 px-6 text-sm text-text-primary font-mono">
                        {payment.reference_number}
                      </td>
                      <td className="py-4 px-6 text-sm text-text-secondary capitalize">
                        {payment.payment_method?.replace("_", " ")}
                      </td>
                      <td className="py-4 px-6 text-sm text-text-primary text-right font-semibold">
                        RWF {payment.amount?.toLocaleString()}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <StatusBadge status={payment.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ) : (
          <EmptyState
            title="No payments found"
            description="Your payment history will appear here once you make your first payment."
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
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
            }
          />
        )}
      </div>
    </CustomerPortalLayout>
  );
};

export default CustomerPortalPayments;
