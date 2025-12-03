/**
 * Collectors Page
 * List and manage waste collection personnel
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCollectors,
  useActivateCollector,
  useSuspendCollector,
  useSetCollectorOnLeave,
  useDeleteCollector,
} from "../../hooks/useOperations";
import { AppLayout } from "../../components/layout";
import { PageHeader, Card, Button, EmptyState } from "../../components/common";
import { PageLoader } from "../../components/common/LoadingSpinner";
import { StatusBadge } from "../../components/common/Badge";

const CollectorsPage = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [search, setSearch] = useState("");

  // Fetch data
  const {
    data: collectorsData,
    isLoading,
    error,
  } = useCollectors({
    status: statusFilter || undefined,
    search: search || undefined,
  });

  // Mutations
  const activateCollector = useActivateCollector();
  const suspendCollector = useSuspendCollector();
  const setOnLeave = useSetCollectorOnLeave();
  const deleteCollector = useDeleteCollector();

  const collectors = collectorsData?.results || [];

  const handleStatusAction = async (
    id: string,
    action: "activate" | "suspend" | "leave"
  ) => {
    try {
      switch (action) {
        case "activate":
          await activateCollector.mutateAsync(id);
          break;
        case "suspend":
          await suspendCollector.mutateAsync(id);
          break;
        case "leave":
          await setOnLeave.mutateAsync(id);
          break;
      }
    } catch {
      alert("Failed to change collector status");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await deleteCollector.mutateAsync(id);
      } catch {
        alert("Failed to delete collector");
      }
    }
  };

  const getEmploymentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      full_time: "Full Time",
      part_time: "Part Time",
      contractor: "Contractor",
      temporary: "Temporary",
    };
    return labels[type] || type;
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
            Failed to load collectors. Please try again.
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageHeader
        title="Collectors"
        subtitle="Manage waste collection personnel"
        actions={
          <Button
            onClick={() => navigate("/operations/collectors/new")}
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
            Add Collector
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
                placeholder="Search collectors..."
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
              <option value="on_leave">On Leave</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </Card>

        {/* Collectors Grid */}
        {collectors.length === 0 ? (
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            }
            title="No collectors found"
            description="Get started by adding your first collector."
            action={
              <Button
                onClick={() => navigate("/operations/collectors/new")}
                variant="primary"
              >
                Add Collector
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collectors.map((collector) => (
              <Card
                key={collector.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() =>
                  navigate(`/operations/collectors/${collector.id}`)
                }
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="shrink-0">
                    {collector.photo ? (
                      <img
                        src={collector.photo}
                        alt={collector.full_name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center">
                        <span className="text-2xl font-bold text-primary">
                          {collector.first_name.charAt(0)}
                          {collector.last_name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-text-primary truncate">
                        {collector.full_name}
                      </h3>
                      <StatusBadge status={collector.status} size="sm" />
                    </div>
                    <p className="text-sm text-text-secondary">
                      {collector.employee_id}
                    </p>
                    <p className="text-sm text-text-tertiary">
                      {getEmploymentTypeLabel(collector.employment_type)}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="mt-4 pt-4 border-t border-border-base grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xl font-bold text-text-primary">
                      {collector.assigned_routes_count}
                    </p>
                    <p className="text-xs text-text-secondary">Routes</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-text-primary">
                      {collector.total_collections}
                    </p>
                    <p className="text-xs text-text-secondary">Collections</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-text-primary">
                      {parseFloat(collector.rating).toFixed(1)}
                    </p>
                    <p className="text-xs text-text-secondary">Rating</p>
                  </div>
                </div>

                {/* Contact & Actions */}
                <div className="mt-4 pt-4 border-t border-border-base">
                  <div className="flex items-center gap-2 text-sm text-text-secondary mb-3">
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
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <span>{collector.phone}</span>
                  </div>

                  <div
                    className="flex gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() =>
                        navigate(`/operations/collectors/${collector.id}/edit`)
                      }
                      className="flex-1 px-3 py-1.5 text-sm font-medium text-primary bg-primary-light rounded-lg hover:bg-primary hover:text-white transition-colors"
                    >
                      Edit
                    </button>
                    {collector.status === "active" && (
                      <button
                        onClick={() =>
                          handleStatusAction(collector.id, "leave")
                        }
                        className="px-3 py-1.5 text-sm font-medium text-warning bg-warning-light rounded-lg hover:bg-warning hover:text-white transition-colors"
                      >
                        Leave
                      </button>
                    )}
                    {collector.status !== "active" &&
                      collector.status !== "suspended" && (
                        <button
                          onClick={() =>
                            handleStatusAction(collector.id, "activate")
                          }
                          className="px-3 py-1.5 text-sm font-medium text-success bg-success-light rounded-lg hover:bg-success hover:text-white transition-colors"
                        >
                          Activate
                        </button>
                      )}
                    <button
                      onClick={() =>
                        handleDelete(collector.id, collector.full_name)
                      }
                      className="px-3 py-1.5 text-sm font-medium text-danger bg-danger-light rounded-lg hover:bg-danger hover:text-white transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default CollectorsPage;
