/**
 * Company Admin Reports Page
 * Company-specific analytics and reports
 */

import { useState } from "react";
import { AppLayout } from "../../components/layout";
import { Card } from "../../components/common";
import {
  TrendingUp,
  TrendingDown,
  Users,
  UserCheck,
  DollarSign,
  Download,
  MapPin,
  Package,
} from "lucide-react";

export const CompanyReportsPage = () => {
  const [timeRange, setTimeRange] = useState("30days");
  const [reportType, setReportType] = useState("overview");

  // Mock data - replace with actual API calls
  const stats = {
    total_customers: 156,
    active_customers: 142,
    total_collectors: 12,
    collections_today: 45,
    collections_this_month: 1234,
    revenue_this_month: 2468000,
    service_areas: 8,
  };

  const trends = {
    customers: { value: 8.5, isPositive: true },
    collectors: { value: 2.1, isPositive: true },
    collections: { value: 12.3, isPositive: true },
    revenue: { value: 15.7, isPositive: true },
  };

  const collectionsByArea = [
    { area: "Nyarugenge", collections: 234, revenue: 468000, growth: 12.5 },
    { area: "Gasabo", collections: 189, revenue: 378000, growth: 8.3 },
    { area: "Kicukiro", collections: 156, revenue: 312000, growth: -3.2 },
    { area: "Rwamagana", collections: 145, revenue: 290000, growth: 15.8 },
    { area: "Muhanga", collections: 123, revenue: 246000, growth: 6.4 },
  ];

  const topCollectors = [
    { name: "Paul Bizimana", collections: 156, rating: 4.8, efficiency: 95 },
    {
      name: "Joseph Hakizimana",
      collections: 142,
      rating: 4.7,
      efficiency: 92,
    },
    {
      name: "Patrick Nsengimana",
      collections: 138,
      rating: 4.6,
      efficiency: 90,
    },
    {
      name: "Emmanuel Nkurunziza",
      collections: 125,
      rating: 4.5,
      efficiency: 88,
    },
    { name: "Claude Mugisha", collections: 118, rating: 4.4, efficiency: 85 },
  ];

  const recentTransactions = [
    {
      date: "2026-01-10",
      customer: "Jean Uwimana",
      amount: 2000,
      method: "Mobile Money",
      status: "completed",
    },
    {
      date: "2026-01-10",
      customer: "Marie Mukamana",
      amount: 2000,
      method: "Cash",
      status: "completed",
    },
    {
      date: "2026-01-09",
      customer: "Pierre Habimana",
      amount: 2000,
      method: "Mobile Money",
      status: "completed",
    },
    {
      date: "2026-01-09",
      customer: "Grace Uwase",
      amount: 2000,
      method: "Cash",
      status: "pending",
    },
    {
      date: "2026-01-08",
      customer: "David Ntare",
      amount: 2000,
      method: "Mobile Money",
      status: "completed",
    },
  ];

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
              Company Reports
            </h1>
            <p className="text-slate-600 mt-1">
              Analytics and performance insights for your company
            </p>
          </div>
          <div className="flex gap-3">
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
            >
              <option value="overview">Overview</option>
              <option value="collections">Collections</option>
              <option value="revenue">Revenue</option>
              <option value="customers">Customers</option>
            </select>
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
              Export
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Total Customers
                </p>
                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {stats.total_customers}
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
                  Active Collectors
                </p>
                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {stats.total_collectors}
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
                  Collections This Month
                </p>
                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {stats.collections_this_month}
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
                  <span className="text-xs text-slate-500">vs last month</span>
                </div>
              </div>
              <div className="p-3 bg-emerald-100 rounded-lg">
                <Package className="w-8 h-8 text-emerald-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Revenue This Month
                </p>
                <p className="text-2xl font-bold text-slate-900 mt-2">
                  {(stats.revenue_this_month / 1000).toFixed(0)}K RWF
                </p>
                <div className="flex items-center gap-1 mt-2">
                  {getTrendIcon(trends.revenue.isPositive)}
                  <span
                    className={`text-sm font-medium ${
                      trends.revenue.isPositive
                        ? "text-emerald-600"
                        : "text-red-600"
                    }`}
                  >
                    {Math.abs(trends.revenue.value)}%
                  </span>
                  <span className="text-xs text-slate-500">vs last month</span>
                </div>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <DollarSign className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Collections by Service Area */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-900">
                Collections by Service Area
              </h2>
              <MapPin className="w-5 h-5 text-slate-400" />
            </div>
            <div className="space-y-4">
              {collectionsByArea.map((area, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-900">
                        {area.area}
                      </span>
                      <span className="text-xs text-slate-500">
                        {area.collections} collections
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-900">
                        {(area.revenue / 1000).toFixed(0)}K RWF
                      </span>
                      <div className="flex items-center gap-1">
                        {getTrendIcon(area.growth > 0)}
                        <span
                          className={`text-xs font-medium ${
                            area.growth > 0
                              ? "text-emerald-600"
                              : "text-red-600"
                          }`}
                        >
                          {Math.abs(area.growth).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-teal-500 h-2 rounded-full transition-all"
                      style={{ width: `${(area.collections / 234) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Top Collectors */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-900">
                Top Performing Collectors
              </h2>
              <UserCheck className="w-5 h-5 text-slate-400" />
            </div>
            <div className="space-y-4">
              {topCollectors.map((collector, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 font-bold text-sm">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">
                        {collector.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {collector.collections} collections
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm font-medium text-slate-900">
                        {collector.rating}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500">
                      {collector.efficiency}% efficiency
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Recent Transactions
            </h2>
            <button className="text-sm text-teal-600 hover:text-teal-700">
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">
                    Customer
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">
                    Amount
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">
                    Method
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-slate-700">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentTransactions.map((transaction, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-3 px-4 text-sm text-slate-900">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-900">
                      {transaction.customer}
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-slate-900">
                      {transaction.amount.toLocaleString()} RWF
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600">
                      {transaction.method}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.status === "completed"
                            ? "bg-emerald-100 text-emerald-700"
                            : transaction.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {transaction.status}
                      </span>
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

export default CompanyReportsPage;
