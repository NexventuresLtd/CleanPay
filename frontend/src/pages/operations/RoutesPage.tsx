/**
 * Routes Page
 * List and manage collection routes
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRoutes, useDeleteRoute } from "../../hooks/useOperations";
import { AppLayout } from "../../components/layout";
import { PageHeader, Card, Button, EmptyState } from "../../components/common";
import { PageLoader } from "../../components/common/LoadingSpinner";
import { StatusBadge } from "../../components/common/Badge";

const RoutesPage = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [search, setSearch] = useState("");

  // Fetch data
  const {
    data: routesData,
    isLoading,
    error,
  } = useRoutes({
    status: statusFilter || undefined,
    search: search || undefined,
  });

  // Mutations
  const deleteRoute = useDeleteRoute();

  const routes = routesData?.results || [];

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await deleteRoute.mutateAsync(id);
      } catch {
        alert("Failed to delete route");
      }
    }
  };

  const getFrequencyLabel = (frequency: string) => {
    const labels: Record<string, string> = {
      daily: "Daily",
      twice_weekly: "Twice Weekly",
      weekly: "Weekly",
      biweekly: "Bi-Weekly",
      monthly: "Monthly",
    };
    return labels[frequency] || frequency;
  };

  if (isLoading) {
    return (
      <AppLayout>
        <PageLoader />
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="p-6">
          <div className="bg-danger-light text-danger-dark p-4 rounded-lg">
            Failed to load routes. Please try again.
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageHeader
        title="Routes"
        subtitle="Manage collection routes and schedules"
        actions={
          <Button
            onClick={() => navigate("/operations/routes/new")}
            variant="primary"
          >
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
            Add Route
          </Button>
        }
      />

      <div className="p-6 space-y-6">
        {/* Filters */}
        <Card>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search routes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 border border-border-base rounded-lg bg-bg-base text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-border-base rounded-lg bg-bg-base text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </Card>

        {/* Routes Table */}
        {routes.length === 0 ? (
          <EmptyState
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
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
            }
            title="No routes found"
            description="Get started by creating your first collection route."
            action={
              <Button
                onClick={() => navigate("/operations/routes/new")}
                variant="primary"
              >
                Add Route
              </Button>
            }
          />
        ) : (
          <Card className="overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-bg-subtle border-b border-border-base">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Code / Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Service Area
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Frequency
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Collector
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Customers
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-base">
                  {routes.map((route) => (
                    <tr
                      key={route.id}
                      className="hover:bg-bg-subtle transition-colors cursor-pointer"
                      onClick={() => navigate(`/operations/routes/${route.id}`)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-text-primary">
                            {route.code}
                          </div>
                          <div className="text-sm text-text-secondary">
                            {route.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                        {route.service_area_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={route.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-text-primary">
                          {getFrequencyLabel(route.frequency)}
                        </div>
                        <div className="text-xs text-text-secondary">
                          {route.collection_schedule_display}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                        {route.default_collector_name || (
                          <span className="text-text-tertiary italic">
                            Not assigned
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                        {route.customers_count}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div
                          className="flex items-center justify-end gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() =>
                              navigate(`/operations/routes/${route.id}/edit`)
                            }
                            className="text-primary hover:text-primary-hover"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(route.id, route.name)}
                            className="text-danger hover:text-danger-dark"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default RoutesPage;
