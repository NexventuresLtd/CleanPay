/**
 * Users Management Page
 * System admin can view and manage all users across all companies
 */

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { AppLayout } from "../../components/layout";
import { Card, Button, Input } from "../../components/common";
import { PageLoader } from "../../components/common/LoadingSpinner";
import userService from "../../services/userService";
import companyService from "../../services/companyService";
import {
  Search,
  Filter,
  UserPlus,
  Edit,
  Ban,
  PlayCircle,
  Mail,
  Building2,
  Shield,
  Users,
  UserCheck,
  User,
} from "lucide-react";

export const UsersManagementPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [companyFilter, setCompanyFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const queryClient = useQueryClient();

  const { data: usersData, isLoading } = useQuery({
    queryKey: [
      "users",
      {
        role: roleFilter,
        company: companyFilter,
        status: statusFilter,
        search: searchQuery,
      },
    ],
    queryFn: () =>
      userService.getAllUsers({
        role: roleFilter !== "all" ? roleFilter : undefined,
        company: companyFilter !== "all" ? companyFilter : undefined,
        is_active:
          statusFilter === "active"
            ? true
            : statusFilter === "inactive"
            ? false
            : undefined,
        search: searchQuery || undefined,
      }),
  });

  const { data: companiesData } = useQuery({
    queryKey: ["companies-list"],
    queryFn: () => companyService.getCompanies(),
  });

  const users = usersData?.results || [];
  const companies = companiesData?.results || [];

  const activateUserMutation = useMutation({
    mutationFn: (userId: string) =>
      userService.updateUser(userId, { is_active: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const deactivateUserMutation = useMutation({
    mutationFn: (userId: string) =>
      userService.updateUser(userId, { is_active: false }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "system_admin":
        return Shield;
      case "admin":
        return Building2;
      case "collector":
        return UserCheck;
      case "customer":
        return User;
      default:
        return Users;
    }
  };

  const getRoleBadge = (role: string) => {
    const configs = {
      system_admin: { bg: "bg-purple-100", text: "text-purple-700" },
      admin: { bg: "bg-blue-100", text: "text-blue-700" },
      collector: { bg: "bg-teal-100", text: "text-teal-700" },
      customer: { bg: "bg-slate-100", text: "text-slate-700" },
    };
    const config = configs[role as keyof typeof configs] || configs.customer;
    const Icon = getRoleIcon(role);

    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        <Icon className="w-3.5 h-3.5" />
        {role
          .replace("_", " ")
          .split(" ")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ")}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const isActive = status === "active";
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          isActive
            ? "bg-emerald-100 text-emerald-700"
            : "bg-slate-100 text-slate-700"
        }`}
      >
        {isActive ? "Active" : "Inactive"}
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

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              User Management
            </h1>
            <p className="text-slate-600 mt-1">
              Manage users across all companies
            </p>
          </div>
          <Button variant="primary">
            <UserPlus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Role Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
              >
                <option value="all">All Roles</option>
                <option value="system_admin">System Admin</option>
                <option value="admin">Company Admin</option>
                <option value="collector">Collector</option>
                <option value="customer">Customer</option>
              </select>
            </div>

            {/* Company Filter */}
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <select
                value={companyFilter}
                onChange={(e) => setCompanyFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
              >
                <option value="all">All Companies</option>
                {companies?.map((company: any) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Shield className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">System Admins</p>
                <p className="text-xl font-bold text-slate-900">
                  {users.filter((u: any) => u.role_details.name === "system_admin").length}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Company Admins</p>
                <p className="text-xl font-bold text-slate-900">
                  {users.filter((u: any) => u.role_details.name === "admin").length}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-100 rounded-lg">
                <UserCheck className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Collectors</p>
                <p className="text-xl font-bold text-slate-900">
                  {users.filter((u: any) => u.role_details.name === "collector").length}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 rounded-lg">
                <User className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Customers</p>
                <p className="text-xl font-bold text-slate-900">
                  {users.filter((u: any) => u.role_details.name === "customer").length}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Users Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">
                    User
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">
                    Email
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">
                    Role
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">
                    Company
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">
                    Last Login
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-slate-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {users && users.length > 0 ? (
                  users.map((user: any) => (
                    <tr
                      key={user.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white font-medium">
                            {user.first_name?.[0]}
                            {user.last_name?.[0]}
                          </div>
                          <div>
                            <div className="font-medium text-slate-900">
                              {user.first_name} {user.last_name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Mail className="w-4 h-4 text-slate-400" />
                          {user.email}
                        </div>
                      </td>
                      <td className="py-3 px-4">{getRoleBadge(user.role_details.name)}</td>
                      <td className="py-3 px-4">
                        {user.company ? (
                          <div className="text-sm text-slate-900">
                            {companies.find((c) => c.id === user.company)?.name}
                          </div>
                        ) : (
                          <span className="text-sm text-slate-400">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(user.is_active ? "active" : "inactive")}
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-slate-600">
                          {user.last_login
                            ? new Date(user.last_login).toLocaleDateString()
                            : "Never"}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          {user.is_active ? (
                            <button
                              onClick={() =>
                                deactivateUserMutation.mutate(user.id)
                              }
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Ban className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                activateUserMutation.mutate(user.id)
                              }
                              className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            >
                              <PlayCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center">
                      <Users className="mx-auto h-12 w-12 text-slate-400" />
                      <h3 className="mt-2 text-sm font-medium text-slate-900">
                        No users found
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {searchQuery ||
                        roleFilter !== "all" ||
                        companyFilter !== "all"
                          ? "Try adjusting your filters"
                          : "Get started by adding a new user"}
                      </p>
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

export default UsersManagementPage;
