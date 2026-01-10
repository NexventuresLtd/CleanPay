/**
 * Company Detail Page
 * View and manage a specific company
 */

import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AppLayout } from "../../components/layout";
import { Card, Button } from "../../components/common";
import { PageLoader } from "../../components/common/LoadingSpinner";
import companyService from "../../services/companyService";
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Users,
  UserCheck,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Edit,
  Ban,
  PlayCircle,
} from "lucide-react";

export const CompanyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: company, isLoading } = useQuery({
    queryKey: ["company", id],
    queryFn: () => companyService.getCompany(id!),
  });

  const { data: stats } = useQuery({
    queryKey: ["company-stats", id],
    queryFn: () => companyService.getCompanyStats(id!),
  });

  const activateMutation = useMutation({
    mutationFn: () => companyService.activateCompany(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company", id] });
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });

  const suspendMutation = useMutation({
    mutationFn: () => companyService.suspendCompany(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company", id] });
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });

  if (isLoading) {
    return (
      <AppLayout>
        <PageLoader />
      </AppLayout>
    );
  }

  if (!company) {
    return (
      <AppLayout>
        <div className="p-6">
          <div className="text-center py-12">
            <AlertCircle className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-2 text-sm font-medium text-slate-900">
              Company not found
            </h3>
          </div>
        </div>
      </AppLayout>
    );
  }

  const getStatusBadge = (status: string) => {
    const configs = {
      active: {
        bg: "bg-emerald-100",
        text: "text-emerald-700",
        icon: CheckCircle2,
      },
      suspended: { bg: "bg-red-100", text: "text-red-700", icon: AlertCircle },
      inactive: {
        bg: "bg-slate-100",
        text: "text-slate-700",
        icon: AlertCircle,
      },
    };
    const config = configs[status as keyof typeof configs] || configs.inactive;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}
      >
        <Icon className="w-4 h-4" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <button
              onClick={() => navigate("/system-admin/companies")}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-slate-900">
                  {company.name}
                </h1>
                {getStatusBadge(company.status)}
                {company.is_verified && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Verified
                  </span>
                )}
              </div>
              <p className="text-slate-600">Company Details and Statistics</p>
            </div>
          </div>

          <div className="flex gap-2">
            {company.status === "suspended" && (
              <Button
                variant="secondary"
                onClick={() => activateMutation.mutate()}
                loading={activateMutation.isPending}
              >
                <PlayCircle className="w-4 h-4 mr-2" />
                Activate
              </Button>
            )}
            {company.status === "active" && (
              <Button
                variant="secondary"
                onClick={() => suspendMutation.mutate()}
                loading={suspendMutation.isPending}
              >
                <Ban className="w-4 h-4 mr-2" />
                Suspend
              </Button>
            )}
            <Link to={`/system-admin/companies/${id}/edit`}>
              <Button variant="primary">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Total Customers
                </p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {stats?.total_customers || 0}
                </p>
                <p className="text-sm text-emerald-600 mt-1">
                  {stats?.active_customers || 0} active
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Total Collectors
                </p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {stats?.total_collectors || 0}
                </p>
                <p className="text-sm text-slate-500 mt-1">Active workforce</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <UserCheck className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Collections Today
                </p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {stats?.collections_today || 0}
                </p>
                <p className="text-sm text-slate-500 mt-1">Scheduled</p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Service Areas
                </p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {stats?.service_areas || 0}
                </p>
                <p className="text-sm text-slate-500 mt-1">Defined zones</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <MapPin className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Company Information */}
          <Card>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Company Information
            </h2>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-slate-500">Email</dt>
                <dd className="mt-1 flex items-center gap-2 text-sm text-slate-900">
                  <Mail className="w-4 h-4 text-slate-400" />
                  {company.email}
                </dd>
              </div>

              {company.phone && (
                <div>
                  <dt className="text-sm font-medium text-slate-500">Phone</dt>
                  <dd className="mt-1 flex items-center gap-2 text-sm text-slate-900">
                    <Phone className="w-4 h-4 text-slate-400" />
                    {company.phone}
                  </dd>
                </div>
              )}

              {company.website && (
                <div>
                  <dt className="text-sm font-medium text-slate-500">
                    Website
                  </dt>
                  <dd className="mt-1 flex items-center gap-2 text-sm text-slate-900">
                    <Globe className="w-4 h-4 text-slate-400" />
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-600 hover:text-teal-700"
                    >
                      {company.website}
                    </a>
                  </dd>
                </div>
              )}

              {company.registration_number && (
                <div>
                  <dt className="text-sm font-medium text-slate-500">
                    Registration Number
                  </dt>
                  <dd className="mt-1 text-sm text-slate-900">
                    {company.registration_number}
                  </dd>
                </div>
              )}

              {company.tax_id && (
                <div>
                  <dt className="text-sm font-medium text-slate-500">Tax ID</dt>
                  <dd className="mt-1 text-sm text-slate-900">
                    {company.tax_id}
                  </dd>
                </div>
              )}
            </dl>
          </Card>

          {/* Address & Service Areas */}
          <Card>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Address & Service Areas
            </h2>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-slate-500">
                  Company Address
                </dt>
                <dd className="mt-1 flex items-start gap-2 text-sm text-slate-900">
                  <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div>
                    {company.address.street && (
                      <div>{company.address.street}</div>
                    )}
                    <div>
                      {[
                        company.address.village,
                        company.address.cell,
                        company.address.sector,
                        company.address.district,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </div>
                  </div>
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-slate-500">
                  Service Districts
                </dt>
                <dd className="mt-2 flex flex-wrap gap-2">
                  {company.service_districts.map((district) => (
                    <span
                      key={district}
                      className="px-2 py-1 bg-teal-100 text-teal-700 text-xs rounded-full"
                    >
                      {district}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
          </Card>

          {/* Operational Settings */}
          <Card>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Operational Settings
            </h2>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-slate-500">
                  Max Customers
                </dt>
                <dd className="mt-1 text-sm text-slate-900">
                  {company.max_customers}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500">
                  Max Collectors
                </dt>
                <dd className="mt-1 text-sm text-slate-900">
                  {company.max_collectors}
                </dd>
              </div>
              <div className="col-span-2">
                <dt className="text-sm font-medium text-slate-500">
                  Collection Price
                </dt>
                <dd className="mt-1 text-sm text-slate-900">
                  {company.prepaid_collection_price} RWF
                </dd>
              </div>
            </dl>
          </Card>

          {/* License Information */}
          <Card>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              License Information
            </h2>
            <dl className="space-y-4">
              {company.license_start_date && (
                <div>
                  <dt className="text-sm font-medium text-slate-500">
                    License Start Date
                  </dt>
                  <dd className="mt-1 text-sm text-slate-900">
                    {new Date(company.license_start_date).toLocaleDateString()}
                  </dd>
                </div>
              )}
              {company.license_end_date && (
                <div>
                  <dt className="text-sm font-medium text-slate-500">
                    License End Date
                  </dt>
                  <dd className="mt-1 text-sm text-slate-900">
                    {new Date(company.license_end_date).toLocaleDateString()}
                  </dd>
                </div>
              )}
              {!company.license_start_date && !company.license_end_date && (
                <div className="text-sm text-slate-500">
                  No license dates set
                </div>
              )}
            </dl>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default CompanyDetailPage;
