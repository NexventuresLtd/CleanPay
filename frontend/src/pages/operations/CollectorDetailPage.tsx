import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "../../components/layout";
import { Card, Button } from "../../components/common";
import { PageLoader } from "../../components/common/LoadingSpinner";
import {
  ArrowLeft,
  Edit,
  Phone,
  Mail,
  Calendar,
  Route as RouteIcon,
  CheckCircle2,
  Trash2,
  IdCard,
  Briefcase,
} from "lucide-react";

interface Collector {
  id: string;
  employee_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  national_id: string;
  employment_type: "full_time" | "part_time" | "contractor" | "temporary";
  status: "active" | "on_leave" | "inactive" | "suspended";
  hire_date: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  created_at: string;
  updated_at: string;
}

export const CollectorDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: collector, isLoading } = useQuery<Collector>({
    queryKey: ["collector", id],
    queryFn: async () => {
      // Mock data - replace with actual API call
      return {
        id: id!,
        employee_id: "COL-001",
        first_name: "Jean",
        last_name: "Mugabo",
        email: "jean.mugabo@cleanpay.rw",
        phone: "+250788123456",
        national_id: "1199012345678901",
        employment_type: "full_time",
        status: "active",
        hire_date: "2025-06-01",
        emergency_contact_name: "Marie Mugabo",
        emergency_contact_phone: "+250788999888",
        created_at: "2025-06-01T00:00:00Z",
        updated_at: "2026-01-10T00:00:00Z",
      };
    },
  });

  const { data: routes } = useQuery({
    queryKey: ["collector-routes", id],
    queryFn: async () => {
      // Mock data - replace with actual API call
      return [
        {
          id: "1",
          name: "Kimironko Cell A - Route 1",
          code: "KIM-A-R1",
          service_area: "Kimironko Cell A",
          status: "active",
          frequency: "twice_weekly",
          collection_days: ["Monday", "Thursday"],
          customers_count: 90,
        },
        {
          id: "2",
          name: "Kimironko Cell B - Route 1",
          code: "KIM-B-R1",
          service_area: "Kimironko Cell B",
          status: "active",
          frequency: "weekly",
          collection_days: ["Wednesday"],
          customers_count: 110,
        },
      ];
    },
  });

  const { data: recentCollections } = useQuery({
    queryKey: ["collector-collections", id],
    queryFn: async () => {
      // Mock data - replace with actual API call
      return [
        {
          id: "1",
          date: "2026-01-10",
          route_name: "Kimironko Cell A - Route 1",
          customers_serviced: 85,
          total_customers: 90,
          status: "completed",
          duration_minutes: 120,
        },
        {
          id: "2",
          date: "2026-01-08",
          route_name: "Kimironko Cell B - Route 1",
          customers_serviced: 108,
          total_customers: 110,
          status: "completed",
          duration_minutes: 135,
        },
        {
          id: "3",
          date: "2026-01-06",
          route_name: "Kimironko Cell A - Route 1",
          customers_serviced: 88,
          total_customers: 90,
          status: "completed",
          duration_minutes: 115,
        },
      ];
    },
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      active: "bg-success-light text-success",
      on_leave: "bg-warning-light text-warning",
      inactive: "bg-slate-100 text-slate-600",
      suspended: "bg-danger-light text-danger",
    };

    const labels = {
      active: "Active",
      on_leave: "On Leave",
      inactive: "Inactive",
      suspended: "Suspended",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${
          styles[status as keyof typeof styles] || "bg-slate-100 text-slate-600"
        }`}
      >
        {labels[status as keyof typeof labels] || status}
      </span>
    );
  };

  const getEmploymentTypeBadge = (type: string) => {
    const labels = {
      full_time: "Full Time",
      part_time: "Part Time",
      contractor: "Contractor",
      temporary: "Temporary",
    };

    return (
      <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary-light text-primary">
        {labels[type as keyof typeof labels] || type}
      </span>
    );
  };

  if (isLoading) {
    return (
      <AppLayout>
        <PageLoader />
      </AppLayout>
    );
  }

  if (!collector) {
    return (
      <AppLayout>
        <div className="p-6">
          <p className="text-text-secondary">Collector not found</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/operations/collectors")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-text-primary">
                  {collector.first_name} {collector.last_name}
                </h1>
                {getStatusBadge(collector.status)}
                {getEmploymentTypeBadge(collector.employment_type)}
              </div>
              <p className="text-text-secondary mt-1">
                Employee ID: {collector.employee_id}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => navigate(`/operations/collectors/${id}/edit`)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="outline"
              className="text-danger hover:bg-danger-light"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        {/* Performance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center">
                <RouteIcon className="w-5 h-5 text-primary" />
              </div>
              <p className="text-sm text-text-secondary">Assigned Routes</p>
            </div>
            <p className="text-2xl font-bold text-text-primary">
              {routes?.length || 0}
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-success-light flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-success" />
              </div>
              <p className="text-sm text-text-secondary">Collections (7d)</p>
            </div>
            <p className="text-2xl font-bold text-text-primary">
              {recentCollections?.length || 0}
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-info-light flex items-center justify-center">
                <Calendar className="w-5 h-5 text-info" />
              </div>
              <p className="text-sm text-text-secondary">Avg Completion</p>
            </div>
            <p className="text-2xl font-bold text-text-primary">96%</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-warning-light flex items-center justify-center">
                <Calendar className="w-5 h-5 text-warning" />
              </div>
              <p className="text-sm text-text-secondary">Service Time</p>
            </div>
            <p className="text-2xl font-bold text-text-primary">7 months</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
              <IdCard className="w-5 h-5" />
              Personal Information
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-text-secondary">Full Name</label>
                <p className="text-text-primary font-medium">
                  {collector.first_name} {collector.last_name}
                </p>
              </div>
              <div>
                <label className="text-sm text-text-secondary">
                  Employee ID
                </label>
                <p className="text-text-primary font-medium">
                  {collector.employee_id}
                </p>
              </div>
              <div>
                <label className="text-sm text-text-secondary">
                  National ID
                </label>
                <p className="text-text-primary font-medium">
                  {collector.national_id}
                </p>
              </div>
              <div>
                <label className="text-sm text-text-secondary flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                <p className="text-text-primary">{collector.email}</p>
              </div>
              <div>
                <label className="text-sm text-text-secondary flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone
                </label>
                <p className="text-text-primary">{collector.phone}</p>
              </div>
            </div>
          </Card>

          {/* Employment Information */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Employment Information
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-text-secondary">
                  Employment Type
                </label>
                <div className="mt-1">
                  {getEmploymentTypeBadge(collector.employment_type)}
                </div>
              </div>
              <div>
                <label className="text-sm text-text-secondary">Status</label>
                <div className="mt-1">{getStatusBadge(collector.status)}</div>
              </div>
              <div>
                <label className="text-sm text-text-secondary">Hire Date</label>
                <p className="text-text-primary font-medium">
                  {new Date(collector.hire_date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="pt-3 border-t border-border-base">
                <label className="text-sm text-text-secondary">
                  Emergency Contact
                </label>
                <p className="text-text-primary font-medium">
                  {collector.emergency_contact_name}
                </p>
                <p className="text-text-secondary text-sm">
                  {collector.emergency_contact_phone}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Assigned Routes */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
              <RouteIcon className="w-5 h-5" />
              Assigned Routes
            </h2>
          </div>
          <div className="space-y-3">
            {routes && routes.length > 0 ? (
              routes.map((route) => (
                <div
                  key={route.id}
                  className="p-4 border border-border-base rounded-lg hover:bg-bg-subtle transition-colors cursor-pointer"
                  onClick={() => navigate(`/operations/routes/${route.id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-text-primary">
                        {route.name}
                      </h3>
                      <p className="text-sm text-text-secondary mt-1">
                        {route.code} • {route.service_area} •{" "}
                        {route.collection_days.join(", ")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-text-primary">
                        {route.customers_count} customers
                      </p>
                      <span className="inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 bg-success-light text-success">
                        {route.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-text-secondary">
                <RouteIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No routes assigned</p>
              </div>
            )}
          </div>
        </Card>

        {/* Recent Collections */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Recent Collections
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-base">
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">
                    Route
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-text-secondary">
                    Customers
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-text-secondary">
                    Duration
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-text-secondary">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentCollections && recentCollections.length > 0 ? (
                  recentCollections.map((collection) => (
                    <tr
                      key={collection.id}
                      className="border-b border-border-base hover:bg-bg-subtle"
                    >
                      <td className="py-3 px-4 text-sm text-text-primary">
                        {new Date(collection.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="py-3 px-4 text-sm text-text-primary">
                        {collection.route_name}
                      </td>
                      <td className="py-3 px-4 text-sm text-text-primary text-right">
                        {collection.customers_serviced}/
                        {collection.total_customers}
                      </td>
                      <td className="py-3 px-4 text-sm text-text-primary text-right">
                        {collection.duration_minutes} min
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-success-light text-success">
                          {collection.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-12 text-center text-text-secondary"
                    >
                      No recent collections
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
};

export default CollectorDetailPage;
