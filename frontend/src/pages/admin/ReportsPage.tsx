/**
 * System Admin Reports Page
 * System-wide analytics and reports
 */

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "../../components/layout";
import { Card } from "../../components/common";
import { PageLoader } from "../../components/common/LoadingSpinner";
import companyService from "../../services/companyService";
import {
  TrendingUp,
  TrendingDown,
  Building2,
  Users,
  UserCheck,
  Calendar,
  Download,
} from "lucide-react";

export const ReportsPage = () => {
  const [timeRange, setTimeRange] = useState("7days");
  const [selectedCompany, setSelectedCompany] = useState("all");

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["system-stats"],
    queryFn: () => companyService.getSystemStats(),
  });

  const { data: companiesData } = useQuery({
    queryKey: ["companies-list"],
    queryFn: () => companyService.getCompanies(),
  });

  const companies = companiesData?.results || [];

  if (statsLoading) {
    return (
      <AppLayout>
        <PageLoader />
      </AppLayout>
    );
  }

  // Mock data for charts and trends
  const trends = {
    companies: { value: 8.2, isPositive: true },
    customers: { value: 12.5, isPositive: true },
    collectors: { value: 5.3, isPositive: true },
    collections: { value: -2.1, isPositive: false },
  };

  const recentActivity = [
    {
      id: 1,
      type: "company",
      action: "New company registered",
      company: "Green Solutions Ltd",
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "license",
      action: "License renewed",
      company: "CleanGarb Services",
      time: "5 hours ago",
    },
    {
      id: 3,
      type: "customer",
      action: "50 new customers added",
      company: "Green Solutions Ltd",
      time: "1 day ago",
    },
    {
      id: 4,
      type: "collector",
      action: "5 new collectors hired",
      company: "CleanGarb Services",
      time: "2 days ago",
    },
  ];

  const topCompanies = companies.slice(0, 5).map((company, idx) => ({
    ...company,
    rank: idx + 1,
    growth: Math.random() * 20 - 5,
  }));

  const getTrendIcon = (isPositive: boolean) => {
    return isPositive ? (
      <TrendingUp className="w-4 h-4 text-emerald-600" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-600" />
    );
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              System Reports
            </h1>
            <p className="text-slate-600 mt-1">
              Analytics and insights across all companies
            </p>
          </div>
          <div className="flex gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
            >
              <option value="7days">Last 7 days</option>
              <option value="30days">Last 30 days</option>
              <option value="90days">Last 90 days</option>
              <option value="year">This year</option>
            </select>
            <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Total Companies
                </p>
                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {stats?.total_companies || 0}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  {getTrendIcon(trends.companies.isPositive)}
                  <span
                    className={`text-sm font-medium ${
                      trends.companies.isPositive
                        ? "text-emerald-600"
                        : "text-red-600"
                    }`}
                  >
                    {Math.abs(trends.companies.value)}%
                  </span>
                  <span className="text-xs text-slate-500">vs last period</span>
                </div>
              </div>
              <div className="p-3 bg-teal-100 rounded-lg">
                <Building2 className="w-8 h-8 text-teal-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Total Customers
                </p>
                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {stats?.total_customers || 0}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  {getTrendIcon(trends.customers.isPositive)}
                  <span
                    className={`text-sm font-medium ${
                      trends.customers.isPositive
                        ? "text-emerald-600"
                        : "text-red-600"
                    }`}
                  >
                    {Math.abs(trends.customers.value)}%
                  </span>
                  <span className="text-xs text-slate-500">vs last period</span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Total Collectors
                </p>
                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {stats?.total_collectors || 0}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  {getTrendIcon(trends.collectors.isPositive)}
                  <span
                    className={`text-sm font-medium ${
                      trends.collectors.isPositive
                        ? "text-emerald-600"
                        : "text-red-600"
                    }`}
                  >
                    {Math.abs(trends.collectors.value)}%
                  </span>
                  <span className="text-xs text-slate-500">vs last period</span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <UserCheck className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Collections Today
                </p>
                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {stats?.total_collections_today || 0}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  {getTrendIcon(trends.collections.isPositive)}
                  <span
                    className={`text-sm font-medium ${
                      trends.collections.isPositive
                        ? "text-emerald-600"
                        : "text-red-600"
                    }`}
                  >
                    {Math.abs(trends.collections.value)}%
                  </span>
                  <span className="text-xs text-slate-500">vs last period</span>
                </div>
              </div>
              <div className="p-3 bg-emerald-100 rounded-lg">
                <Calendar className="w-8 h-8 text-emerald-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Performing Companies */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-900">
                Top Performing Companies
              </h2>
              <button className="text-sm text-teal-600 hover:text-teal-700">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {topCompanies.map((company) => (
                <div
                  key={company.id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 font-bold text-sm">
                      {company.rank}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">
                        {company.name}
                      </p>
                      <p className="text-sm text-slate-500">
                        {company.customer_count || 0} customers
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      {getTrendIcon(company.growth > 0)}
                      <span
                        className={`text-sm font-medium ${
                          company.growth > 0
                            ? "text-emerald-600"
                            : "text-red-600"
                        }`}
                      >
                        {Math.abs(company.growth).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-900">
                Recent Activity
              </h2>
              <button className="text-sm text-teal-600 hover:text-teal-700">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 pb-4 border-b border-slate-100 last:border-0"
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === "company"
                        ? "bg-blue-500"
                        : activity.type === "license"
                        ? "bg-purple-500"
                        : activity.type === "customer"
                        ? "bg-emerald-500"
                        : "bg-orange-500"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">
                      {activity.action}
                    </p>
                    <p className="text-sm text-slate-600">{activity.company}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Company Breakdown */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Company Performance Breakdown
            </h2>
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">All Companies</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">
                    Company
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">
                    Status
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-slate-700">
                    Customers
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-slate-700">
                    Collectors
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-slate-700">
                    Collections
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-slate-700">
                    Growth
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {companies.map((company) => (
                  <tr key={company.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center">
                          <Building2 className="w-4 h-4 text-teal-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            {company.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {company.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          company.status === "active"
                            ? "bg-emerald-100 text-emerald-700"
                            : company.status === "suspended"
                            ? "bg-red-100 text-red-700"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {company.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center text-sm text-slate-900">
                      {company.customer_count || 0}
                    </td>
                    <td className="py-3 px-4 text-center text-sm text-slate-900">
                      {company.collector_count || 0}
                    </td>
                    <td className="py-3 px-4 text-center text-sm text-slate-900">
                      {Math.floor(Math.random() * 100)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {getTrendIcon(Math.random() > 0.5)}
                        <span className="text-sm font-medium text-slate-900">
                          {(Math.random() * 20 - 5).toFixed(1)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
};

export default ReportsPage;
