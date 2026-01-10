/**
 * Companies Management Page
 * List and manage all waste collection companies
 */

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { AppLayout } from "../../components/layout";
import { Card } from "../../components/common";
import { PageLoader } from "../../components/common/LoadingSpinner";
import companyService from "../../services/companyService";
import type { Company } from "../../services/companyService";
import {
  Building2,
  Search,
  Filter,
  Plus,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export const CompaniesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: companies, isLoading } = useQuery({
    queryKey: ["companies"],
    queryFn: () => companyService.getCompanies(),
  });

  const filteredCompanies = companies?.results.filter((company: Company) => {
    const matchesSearch =
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || company.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <AppLayout>
        <PageLoader />
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
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Companies</h1>
            <p className="text-slate-600 mt-1">
              Manage waste collection companies
            </p>
          </div>
          <Link
            to="/system-admin/companies/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Company
          </Link>
        </div>

        {/* Filters */}
        <Card>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search companies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        </Card>

        {/* Companies List */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Districts
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Customers
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Collectors
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredCompanies?.map((company: Company) => (
                  <tr key={company.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {company.logo ? (
                            <img
                              className="h-10 w-10 rounded-lg object-cover"
                              src={company.logo}
                              alt=""
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-lg bg-teal-100 flex items-center justify-center">
                              <Building2 className="w-5 h-5 text-teal-600" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-slate-900">
                            {company.name}
                          </div>
                          <div className="text-sm text-slate-500">
                            {company.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-900">
                        {company.service_districts.length > 0
                          ? company.service_districts.slice(0, 2).join(", ")
                          : "Not set"}
                      </div>
                      {company.service_districts.length > 2 && (
                        <div className="text-xs text-slate-500">
                          +{company.service_districts.length - 2} more
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(company.status)}
                      {company.is_verified && (
                        <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          Verified
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">
                        {company.customer_count || 0}
                      </div>
                      <div className="text-xs text-slate-500">
                        {company.active_customers || 0} active
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {company.collector_count || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                      <Link
                        to={`/system-admin/companies/${company.id}`}
                        className="text-teal-600 hover:text-teal-900"
                      >
                        View
                      </Link>
                      <Link
                        to={`/system-admin/companies/${company.id}/edit`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredCompanies?.length === 0 && (
            <div className="text-center py-12">
              <Building2 className="mx-auto h-12 w-12 text-slate-400" />
              <h3 className="mt-2 text-sm font-medium text-slate-900">
                No companies found
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                {searchQuery
                  ? "Try adjusting your search"
                  : "Get started by creating a new company."}
              </p>
            </div>
          )}
        </Card>
      </div>
    </AppLayout>
  );
};

export default CompaniesPage;
