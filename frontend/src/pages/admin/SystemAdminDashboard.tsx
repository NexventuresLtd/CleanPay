/**
 * System Admin Dashboard Page
 * Overview of all companies and system-wide statistics
 */

import { useQuery } from '@tanstack/react-query';
import { AppLayout } from '../../components/layout';
import { Card } from '../../components/common';
import { PageLoader } from '../../components/common/LoadingSpinner';
import companyService from '../../services/companyService';
import type { Company } from '../../services/companyService';
import { Link } from 'react-router-dom';
import { Building2, Users, UserCheck, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';

export const SystemAdminDashboard = () => {
  const { data: companies, isLoading: companiesLoading } = useQuery({
    queryKey: ['companies'],
    queryFn: () => companyService.getCompanies(),
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['system-stats'],
    queryFn: () => companyService.getSystemStats(),
  });

  if (companiesLoading || statsLoading) {
    return (
      <AppLayout>
        <PageLoader />
      </AppLayout>
    );
  }

  const getStatusBadge = (status: string) => {
    const configs = {
      active: { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: CheckCircle2 },
      suspended: { bg: 'bg-red-100', text: 'text-red-700', icon: AlertCircle },
      inactive: { bg: 'bg-slate-100', text: 'text-slate-700', icon: AlertCircle },
    };
    const config = configs[status as keyof typeof configs] || configs.inactive;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
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
            <h1 className="text-2xl font-bold text-slate-900">System Administration</h1>
            <p className="text-slate-600 mt-1">Manage waste collection companies across Rwanda</p>
          </div>
          <Link
            to="/system-admin/companies/new"
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
          >
            Add Company
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Companies</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{stats?.total_companies || 0}</p>
                <p className="text-sm text-emerald-600 mt-1">
                  {stats?.active_companies || 0} active
                </p>
              </div>
              <div className="p-3 bg-teal-100 rounded-lg">
                <Building2 className="w-8 h-8 text-teal-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Customers</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{stats?.total_customers || 0}</p>
                <p className="text-sm text-slate-500 mt-1">Across all companies</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Collectors</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{stats?.total_collectors || 0}</p>
                <p className="text-sm text-slate-500 mt-1">Active workforce</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <UserCheck className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Collections Today</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{stats?.total_collections_today || 0}</p>
                <p className="text-sm text-slate-500 mt-1">System-wide</p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-lg">
                <TrendingUp className="w-8 h-8 text-emerald-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Companies List */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900">Companies</h2>
          </div>

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
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    License
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {companies?.results.map((company: Company) => (
                  <tr key={company.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {company.logo ? (
                            <img className="h-10 w-10 rounded-lg object-cover" src={company.logo} alt="" />
                          ) : (
                            <div className="h-10 w-10 rounded-lg bg-teal-100 flex items-center justify-center">
                              <Building2 className="w-5 h-5 text-teal-600" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-slate-900">{company.name}</div>
                          <div className="text-sm text-slate-500">{company.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">
                        {company.service_districts.length > 0 
                          ? company.service_districts.slice(0, 2).join(', ')
                          : 'Not set'}
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
                      <div className="text-sm text-slate-900">{company.customer_count || 0}</div>
                      <div className="text-xs text-slate-500">
                        {company.active_customers || 0} active
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {company.collector_count || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {company.license_end_date ? (
                        <div className="text-sm">
                          <div className="text-slate-900">
                            {new Date(company.license_end_date) > new Date() ? 'Valid' : 'Expired'}
                          </div>
                          <div className="text-xs text-slate-500">
                            Until {new Date(company.license_end_date).toLocaleDateString()}
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-500">Not set</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/system-admin/companies/${company.id}`}
                        className="text-teal-600 hover:text-teal-900"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {companies?.results.length === 0 && (
            <div className="text-center py-12">
              <Building2 className="mx-auto h-12 w-12 text-slate-400" />
              <h3 className="mt-2 text-sm font-medium text-slate-900">No companies</h3>
              <p className="mt-1 text-sm text-slate-500">Get started by creating a new company.</p>
              <div className="mt-6">
                <Link
                  to="/system-admin/companies/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700"
                >
                  Add Company
                </Link>
              </div>
            </div>
          )}
        </Card>
      </div>
    </AppLayout>
  );
};

export default SystemAdminDashboard;
