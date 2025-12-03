/**
 * Customer Portal Invoices Page
 * Shows all invoices for the customer
 */

import { useState } from "react";
import { CustomerPortalLayout } from "../../components/layout/CustomerPortalLayout";
import { Card } from "../../components/common/Card";
import { StatusBadge } from "../../components/common/Badge";
import { PageLoader } from "../../components/common/LoadingSpinner";
import { EmptyState } from "../../components/common/EmptyState";
import { usePortalInvoices } from "../../hooks/useCustomerPortal";

export const CustomerPortalInvoices = () => {
  const [statusFilter, setStatusFilter] = useState<string>("");
  const { data, isLoading, error } = usePortalInvoices(
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
            <p className="text-danger">Failed to load invoices</p>
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
          <h1 className="text-2xl font-bold text-text-primary">My Invoices</h1>
          <p className="text-text-secondary mt-1">
            View and manage your invoices
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
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Invoices List */}
        {data?.results && data.results.length > 0 ? (
          <div className="space-y-4">
            {data.results.map((invoice) => (
              <Card
                key={invoice.id}
                className="hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-text-primary">
                        Invoice #{invoice.invoice_number}
                      </h3>
                      <StatusBadge status={invoice.status} />
                    </div>
                    <p className="text-sm text-text-secondary mt-1">
                      {invoice.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-text-muted">
                      <span>Issued: {formatDate(invoice.issue_date)}</span>
                      <span>Due: {formatDate(invoice.due_date)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-text-primary">
                      RWF {invoice.amount?.toLocaleString()}
                    </p>
                    {invoice.status === "sent" ||
                    invoice.status === "overdue" ? (
                      <button className="mt-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium">
                        Pay Now
                      </button>
                    ) : null}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No invoices found"
            description="You don't have any invoices yet. They will appear here once generated."
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            }
          />
        )}
      </div>
    </CustomerPortalLayout>
  );
};

export default CustomerPortalInvoices;
