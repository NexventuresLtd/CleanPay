import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "../../components/layout";
import { Card, Button } from "../../components/common";
import { PageLoader } from "../../components/common/LoadingSpinner";
import {
  ArrowLeft,
  Edit,
  MapPin,
  Users,
  Route as RouteIcon,
  Building2,
  Trash2,
  MapPinned,
} from "lucide-react";

interface ServiceArea {
  id: string;
  name: string;
  code: string;
  description: string;
  province: string;
  district: string;
  sector: string;
  cell: string;
  village: string;
  status: "active" | "inactive" | "planned";
  estimated_households: number;
  estimated_customers: number;
  created_at: string;
  updated_at: string;
}

export const ServiceAreaDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: serviceArea, isLoading } = useQuery<ServiceArea>({
    queryKey: ["service-area", id],
    queryFn: async () => {
      // Mock data - replace with actual API call
      return {
        id: id!,
        name: "Kimironko Cell A",
        code: "KIM-A",
        description: "Kimironko residential area - Section A",
        province: "Kigali City",
        district: "Gasabo",
        sector: "Remera",
        cell: "Kimironko",
        village: "Kimironko A",
        status: "active",
        estimated_households: 250,
        estimated_customers: 180,
        created_at: "2026-01-01T00:00:00Z",
        updated_at: "2026-01-10T00:00:00Z",
      };
    },
  });

  const { data: routes } = useQuery({
    queryKey: ["routes", id],
    queryFn: async () => {
      // Mock data - replace with actual API call
      return [
        {
          id: "1",
          name: "Kimironko Cell A - Route 1",
          code: "KIM-A-R1",
          status: "active",
          frequency: "twice_weekly",
          collection_days: ["Monday", "Thursday"],
          estimated_distance_km: 5.2,
          customers_count: 90,
        },
        {
          id: "2",
          name: "Kimironko Cell A - Route 2",
          code: "KIM-A-R2",
          status: "active",
          frequency: "weekly",
          collection_days: ["Wednesday"],
          estimated_distance_km: 4.8,
          customers_count: 90,
        },
      ];
    },
  });

  const { data: collectors } = useQuery({
    queryKey: ["collectors", id],
    queryFn: async () => {
      // Mock data - replace with actual API call
      return [
        {
          id: "1",
          first_name: "Jean",
          last_name: "Mugabo",
          employee_id: "COL-001",
          status: "active",
          phone: "+250788123456",
        },
        {
          id: "2",
          first_name: "Marie",
          last_name: "Uwase",
          employee_id: "COL-002",
          status: "active",
          phone: "+250788234567",
        },
      ];
    },
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      active: "bg-success-light text-success",
      inactive: "bg-slate-100 text-slate-600",
      planned: "bg-info-light text-info",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${
          styles[status as keyof typeof styles] || "bg-slate-100 text-slate-600"
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
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

  if (!serviceArea) {
    return (
      <AppLayout>
        <div className="p-6">
          <p className="text-text-secondary">Service area not found</p>
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
              onClick={() => navigate("/operations/service-areas")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-text-primary">
                  {serviceArea.name}
                </h1>
                {getStatusBadge(serviceArea.status)}
              </div>
              <p className="text-text-secondary mt-1">
                Code: {serviceArea.code}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => navigate(`/operations/service-areas/${id}/edit`)}
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

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <p className="text-sm text-text-secondary">Households</p>
            </div>
            <p className="text-2xl font-bold text-text-primary">
              {serviceArea.estimated_households}
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-success-light flex items-center justify-center">
                <Users className="w-5 h-5 text-success" />
              </div>
              <p className="text-sm text-text-secondary">Customers</p>
            </div>
            <p className="text-2xl font-bold text-text-primary">
              {serviceArea.estimated_customers}
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-info-light flex items-center justify-center">
                <RouteIcon className="w-5 h-5 text-info" />
              </div>
              <p className="text-sm text-text-secondary">Active Routes</p>
            </div>
            <p className="text-2xl font-bold text-text-primary">
              {routes?.length || 0}
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-warning-light flex items-center justify-center">
                <Users className="w-5 h-5 text-warning" />
              </div>
              <p className="text-sm text-text-secondary">Collectors</p>
            </div>
            <p className="text-2xl font-bold text-text-primary">
              {collectors?.length || 0}
            </p>
          </Card>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Basic Information
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-text-secondary">Name</label>
                <p className="text-text-primary font-medium">
                  {serviceArea.name}
                </p>
              </div>
              <div>
                <label className="text-sm text-text-secondary">Code</label>
                <p className="text-text-primary font-medium">
                  {serviceArea.code}
                </p>
              </div>
              <div>
                <label className="text-sm text-text-secondary">
                  Description
                </label>
                <p className="text-text-primary">
                  {serviceArea.description || "N/A"}
                </p>
              </div>
              <div>
                <label className="text-sm text-text-secondary">Status</label>
                <div className="mt-1">{getStatusBadge(serviceArea.status)}</div>
              </div>
            </div>
          </Card>

          {/* Location Information */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Location
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-text-secondary">Province</label>
                <p className="text-text-primary font-medium">
                  {serviceArea.province}
                </p>
              </div>
              <div>
                <label className="text-sm text-text-secondary">District</label>
                <p className="text-text-primary font-medium">
                  {serviceArea.district}
                </p>
              </div>
              <div>
                <label className="text-sm text-text-secondary">Sector</label>
                <p className="text-text-primary font-medium">
                  {serviceArea.sector}
                </p>
              </div>
              <div>
                <label className="text-sm text-text-secondary">Cell</label>
                <p className="text-text-primary font-medium">
                  {serviceArea.cell}
                </p>
              </div>
              <div>
                <label className="text-sm text-text-secondary">Village</label>
                <p className="text-text-primary font-medium">
                  {serviceArea.village}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Routes */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
              <RouteIcon className="w-5 h-5" />
              Collection Routes
            </h2>
            <Button
              size="sm"
              onClick={() => navigate("/operations/routes/new")}
            >
              Add Route
            </Button>
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
                        {route.code} • {route.collection_days.join(", ")} •{" "}
                        {route.estimated_distance_km} km
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-text-primary">
                        {route.customers_count} customers
                      </p>
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                          route.status === "active"
                            ? "bg-success-light text-success"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {route.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-text-secondary">
                <MapPinned className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No routes found for this service area</p>
              </div>
            )}
          </div>
        </Card>

        {/* Assigned Collectors */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Assigned Collectors
          </h2>
          <div className="space-y-3">
            {collectors && collectors.length > 0 ? (
              collectors.map((collector) => (
                <div
                  key={collector.id}
                  className="p-4 border border-border-base rounded-lg hover:bg-bg-subtle transition-colors cursor-pointer"
                  onClick={() =>
                    navigate(`/operations/collectors/${collector.id}`)
                  }
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-text-primary">
                        {collector.first_name} {collector.last_name}
                      </h3>
                      <p className="text-sm text-text-secondary mt-1">
                        {collector.employee_id} • {collector.phone}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        collector.status === "active"
                          ? "bg-success-light text-success"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {collector.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-text-secondary">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No collectors assigned to this service area</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </AppLayout>
  );
};

export default ServiceAreaDetailPage;
