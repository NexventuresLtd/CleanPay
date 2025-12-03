/**
 * Service Areas Page
 * List and manage service areas for waste collection operations
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useServiceAreas,
  useServiceAreaStats,
  useActivateServiceArea,
  useDeactivateServiceArea,
  useDeleteServiceArea,
} from "../../hooks/useOperations";
import { AppLayout } from "../../components/layout";
import {
  PageHeader,
  StatCard,
  Card,
  Button,
  EmptyState,
} from "../../components/common";
import { PageLoader } from "../../components/common/LoadingSpinner";
import { StatusBadge } from "../../components/common/Badge";

const ServiceAreasPage = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [search, setSearch] = useState("");

  // Fetch data
  const {
    data: areasData,
    isLoading,
    error,
  } = useServiceAreas({
    status: statusFilter || undefined,
    search: search || undefined,
  });
  const { data: stats } = useServiceAreaStats();

  // Mutations
  const activateArea = useActivateServiceArea();
  const deactivateArea = useDeactivateServiceArea();
  const deleteArea = useDeleteServiceArea();

  const areas = areasData?.results || [];

  const handleStatusChange = async (id: string, currentStatus: string) => {
    try {
      if (currentStatus === "active") {
        await deactivateArea.mutateAsync(id);
      } else {
        await activateArea.mutateAsync(id);
      }
    } catch {
      alert("Failed to change service area status");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await deleteArea.mutateAsync(id);
      } catch {
        alert("Failed to delete service area");
      }
    }
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
            Failed to load service areas. Please try again.
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageHeader
        title="Service Areas"
        subtitle="Manage geographic areas for waste collection"
        actions={
          <Button
            onClick={() => navigate("/operations/service-areas/new")}
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
            Add Service Area
          </Button>
        }
      />

      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Areas"
              value={stats.total_areas}
              icon={
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
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
              }
              iconBgClass="bg-primary-light"
              iconColorClass="text-primary"
            />
            <StatCard
              title="Active Areas"
              value={stats.active_areas}
              icon={
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
              }
              iconBgClass="bg-success-light"
              iconColorClass="text-success"
            />
            <StatCard
              title="Total Households"
              value={stats.total_households.toLocaleString()}
              icon={
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
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              }
              iconBgClass="bg-info-light"
              iconColorClass="text-info"
            />
            <StatCard
              title="Total Routes"
              value={stats.total_routes}
              icon={
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
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
              }
              iconBgClass="bg-warning-light"
              iconColorClass="text-warning"
            />
          </div>
        )}

        {/* Filters */}
        <Card>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search service areas..."
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
              <option value="planned">Planned</option>
            </select>
          </div>
        </Card>

        {/* Areas Table */}
        {areas.length === 0 ? (
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
            title="No service areas found"
            description="Get started by creating your first service area."
            action={
              <Button
                onClick={() => navigate("/operations/service-areas/new")}
                variant="primary"
              >
                Add Service Area
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
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Households
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Routes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Collectors
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-base">
                  {areas.map((area) => (
                    <tr
                      key={area.id}
                      className="hover:bg-bg-subtle transition-colors cursor-pointer"
                      onClick={() =>
                        navigate(`/operations/service-areas/${area.id}`)
                      }
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-text-primary">
                            {area.code}
                          </div>
                          <div className="text-sm text-text-secondary">
                            {area.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-text-primary">
                          {area.district}, {area.province}
                        </div>
                        <div className="text-sm text-text-secondary">
                          {area.sector}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={area.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                        {area.estimated_households.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                        {area.active_routes_count}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                        {area.assigned_collectors_count}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div
                          className="flex items-center justify-end gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() =>
                              navigate(
                                `/operations/service-areas/${area.id}/edit`
                              )
                            }
                            className="text-primary hover:text-primary-hover"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() =>
                              handleStatusChange(area.id, area.status)
                            }
                            className="text-warning hover:text-warning-dark"
                          >
                            {area.status === "active"
                              ? "Deactivate"
                              : "Activate"}
                          </button>
                          <button
                            onClick={() => handleDelete(area.id, area.name)}
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

export default ServiceAreasPage;
