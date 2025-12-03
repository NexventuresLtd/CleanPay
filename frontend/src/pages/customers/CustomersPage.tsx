/**
 * Customer List Page
 * Displays a table of all customers with search, filters, and actions
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  useCustomers,
  useDeleteCustomer,
  useCustomerStats,
} from "../../hooks/useCustomers";
import type { CustomerListParams } from "../../services/customerService";
import { AppLayout } from "../../components/layout/AppLayout";
import { PageHeader } from "../../components/common/PageHeader";
import { Card } from "../../components/common/Card";
import { StatCard } from "../../components/common/StatCard";
import { StatusBadge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { EmptyState } from "../../components/common/EmptyState";
import { Alert } from "../../components/common/Alert";
import { format } from "date-fns";

// Icons for stat cards
const icons = {
  users: (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  ),
  active: (
    <svg
      className="w-6 h-6"
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
  ),
  trending: (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
      />
    </svg>
  ),
  currency: (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
};

const CustomersPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<CustomerListParams>({
    page: 1,
    page_size: 10,
    ordering: "-created_at",
  });

  const {
    data: customersData,
    isLoading,
    error,
  } = useCustomers({ ...filters, search: searchQuery });
  const { data: stats } = useCustomerStats();
  const deleteCustomer = useDeleteCustomer();

  const customers = customersData?.results || [];
  const totalCount = customersData?.count || 0;
  const totalPages = Math.ceil(totalCount / (filters.page_size || 10));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, page: 1 }));
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to archive ${name}?`)) {
      try {
        await deleteCustomer.mutateAsync(id);
      } catch {
        alert("Failed to archive customer");
      }
    }
  };

  const handleFilterChange = (
    key: keyof CustomerListParams,
    value: string | number | undefined
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  return (
    <AppLayout>
      <PageHeader
        title="Customers"
        subtitle="Manage your customer database"
        actions={
          <Button onClick={() => navigate("/customers/new")} variant="primary">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Customer
          </Button>
        }
      />

      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Customers"
              value={stats.total_customers}
              icon={icons.users}
              iconBgClass="bg-primary-light"
              iconColorClass="text-primary"
            />
            <StatCard
              title="Active"
              value={stats.active_customers}
              icon={icons.active}
              iconBgClass="bg-success-light"
              iconColorClass="text-success"
            />
            <StatCard
              title="New This Month"
              value={stats.new_customers_this_month}
              icon={icons.trending}
              iconBgClass="bg-info-light"
              iconColorClass="text-info"
            />
            <StatCard
              title="Total Credit Limit"
              value={`RWF ${parseFloat(
                stats.total_credit_limit
              ).toLocaleString()}`}
              icon={icons.currency}
              iconBgClass="bg-secondary-light"
              iconColorClass="text-secondary"
            />
          </div>
        )}

        {/* Filters and Search */}
        <Card>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Input
                  type="text"
                  placeholder="Search by name, email, phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  fullWidth
                />
              </div>
              <select
                className="w-full px-3 py-2 border border-border-base rounded-lg text-text-primary bg-bg-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={filters.status || ""}
                onChange={(e) =>
                  handleFilterChange("status", e.target.value || undefined)
                }
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="archived">Archived</option>
              </select>
              <select
                className="w-full px-3 py-2 border border-border-base rounded-lg text-text-primary bg-bg-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={filters.ordering || "-created_at"}
                onChange={(e) => handleFilterChange("ordering", e.target.value)}
              >
                <option value="-created_at">Newest First</option>
                <option value="created_at">Oldest First</option>
                <option value="full_name">Name A-Z</option>
                <option value="-full_name">Name Z-A</option>
              </select>
            </div>
          </form>
        </Card>

        {/* Error State */}
        {error && (
          <Alert
            type="error"
            title="Error loading customers"
            message={error instanceof Error ? error.message : "Unknown error"}
          />
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && customers.length === 0 && (
          <EmptyState
            icon={icons.users}
            title="No customers found"
            description={
              searchQuery
                ? "Try adjusting your search or filters"
                : "Get started by adding your first customer"
            }
            action={
              !searchQuery && (
                <Button
                  onClick={() => navigate("/customers/new")}
                  variant="primary"
                >
                  Add Customer
                </Button>
              )
            }
          />
        )}

        {/* Customers Table */}
        {!isLoading && !error && customers.length > 0 && (
          <Card padding="none">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-bg-subtle border-b border-border-base">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      Service Area
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      Balance
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-base">
                  {customers.map((customer) => (
                    <tr
                      key={customer.id}
                      className="hover:bg-bg-subtle transition-colors"
                    >
                      <td className="px-6 py-4">
                        <Link
                          to={`/customers/${customer.id}`}
                          className="group"
                        >
                          <div className="font-medium text-text-primary group-hover:text-primary transition-colors">
                            {customer.full_name}
                          </div>
                          {customer.company_name && (
                            <div className="text-sm text-text-secondary">
                              {customer.company_name}
                            </div>
                          )}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-text-primary">
                          {customer.email}
                        </div>
                        {customer.phone && (
                          <div className="text-sm text-text-secondary">
                            {customer.phone}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-text-primary">
                          {customer.service_area?.name || "Not assigned"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={customer.status} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-text-primary">
                          {customer.prepaid_balance} collections
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-text-secondary">
                        {format(new Date(customer.created_at), "MMM d, yyyy")}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/customers/${customer.id}`}
                            className="p-2 text-text-secondary hover:text-primary hover:bg-primary-light rounded-lg transition-colors"
                            title="View"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          </Link>
                          <Link
                            to={`/customers/${customer.id}/edit`}
                            className="p-2 text-text-secondary hover:text-info hover:bg-info-light rounded-lg transition-colors"
                            title="Edit"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </Link>
                          <button
                            onClick={() =>
                              handleDelete(customer.id, customer.full_name)
                            }
                            className="p-2 text-text-secondary hover:text-danger hover:bg-danger-light rounded-lg transition-colors"
                            title="Archive"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-border-base flex items-center justify-between">
                <div className="text-sm text-text-secondary">
                  Showing{" "}
                  {((filters.page || 1) - 1) * (filters.page_size || 10) + 1} to{" "}
                  {Math.min(
                    (filters.page || 1) * (filters.page_size || 10),
                    totalCount
                  )}{" "}
                  of {totalCount} results
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={(filters.page || 1) <= 1}
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        page: (prev.page || 1) - 1,
                      }))
                    }
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={(filters.page || 1) >= totalPages}
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        page: (prev.page || 1) + 1,
                      }))
                    }
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default CustomersPage;
