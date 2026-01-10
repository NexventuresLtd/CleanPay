/**
 * Transactions Page
 * View all financial transactions including top-ups, collections, and payments
 */

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "../../components/layout";
import { Card, Button, Input } from "../../components/common";
import { PageLoader } from "../../components/common/LoadingSpinner";
import {
  Filter,
  Download,
  DollarSign,
  TrendingUp,
  Calendar,
  CreditCard,
  ArrowUpCircle,
  ArrowDownCircle,
} from "lucide-react";

export const TransactionsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<
    "all" | "topup" | "collection" | "refund"
  >("all");
  const [dateRange, setDateRange] = useState("30days");

  // Mock data - replace with actual API call
  const { data: transactions, isLoading } = useQuery({
    queryKey: ["transactions", filterType, dateRange],
    queryFn: async () => {
      // Replace with actual API call
      return [
        {
          id: "1",
          date: "2026-01-10",
          customer_name: "Jean Uwimana",
          card_number: "12345678",
          type: "topup",
          amount: 10000,
          payment_method: "MTN MoMo",
          reference: "TXN-001-2026",
          status: "completed",
        },
        {
          id: "2",
          date: "2026-01-10",
          customer_name: "Marie Mukamana",
          card_number: "87654321",
          type: "collection",
          amount: 500,
          payment_method: "Prepaid Balance",
          reference: "COL-045-2026",
          status: "completed",
        },
        {
          id: "3",
          date: "2026-01-09",
          customer_name: "Eric Habimana",
          card_number: "11223344",
          type: "topup",
          amount: 20000,
          payment_method: "Airtel Money",
          reference: "TXN-002-2026",
          status: "completed",
        },
        {
          id: "4",
          date: "2026-01-09",
          customer_name: "Grace Uwase",
          card_number: "44332211",
          type: "collection",
          amount: 500,
          payment_method: "Prepaid Balance",
          reference: "COL-046-2026",
          status: "completed",
        },
        {
          id: "5",
          date: "2026-01-08",
          customer_name: "Paul Nkunda",
          card_number: "55667788",
          type: "topup",
          amount: 5000,
          payment_method: "Bank Transfer",
          reference: "TXN-003-2026",
          status: "pending",
        },
      ];
    },
  });

  const stats = {
    total_revenue: 245320000,
    topups_today: 15,
    collections_today: 156,
    pending_amount: 84200000,
  };

  const filteredTransactions = transactions?.filter((transaction) => {
    const matchesSearch =
      transaction.customer_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.card_number.includes(searchTerm) ||
      transaction.reference.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterType === "all" || transaction.type === filterType;

    return matchesSearch && matchesFilter;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "topup":
        return <ArrowUpCircle className="w-4 h-4 text-success" />;
      case "collection":
        return <ArrowDownCircle className="w-4 h-4 text-info" />;
      case "refund":
        return <ArrowUpCircle className="w-4 h-4 text-warning" />;
      default:
        return <DollarSign className="w-4 h-4 text-slate-400" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "topup":
        return "Top Up";
      case "collection":
        return "Collection";
      case "refund":
        return "Refund";
      default:
        return type;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      completed: "bg-success-light text-success",
      pending: "bg-warning-light text-warning",
      failed: "bg-danger-light text-danger",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
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

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">
              Transactions
            </h1>
            <p className="text-text-secondary mt-1">
              View and manage all financial transactions
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary mb-1">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold text-text-primary">
                  RWF {stats.total_revenue.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary-light flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm text-success">
              <TrendingUp className="w-4 h-4 mr-1" />
              +12.5% from last month
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary mb-1">
                  Top-Ups Today
                </p>
                <p className="text-2xl font-bold text-text-primary">
                  {stats.topups_today}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-success-light flex items-center justify-center">
                <ArrowUpCircle className="w-6 h-6 text-success" />
              </div>
            </div>
            <div className="mt-2 text-sm text-text-secondary">
              RWF 1,245,000 total
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary mb-1">
                  Collections Today
                </p>
                <p className="text-2xl font-bold text-text-primary">
                  {stats.collections_today}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-info-light flex items-center justify-center">
                <ArrowDownCircle className="w-6 h-6 text-info" />
              </div>
            </div>
            <div className="mt-2 text-sm text-text-secondary">
              RWF 78,000 total
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary mb-1">Pending</p>
                <p className="text-2xl font-bold text-text-primary">
                  RWF {stats.pending_amount.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-warning-light flex items-center justify-center">
                <Calendar className="w-6 h-6 text-warning" />
              </div>
            </div>
            <div className="mt-2 text-sm text-text-secondary">
              23 pending transactions
            </div>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by customer, card number, or reference..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="px-4 py-2 border border-border-base rounded-lg text-sm bg-bg-base text-text-primary"
              >
                <option value="all">All Types</option>
                <option value="topup">Top-Ups</option>
                <option value="collection">Collections</option>
                <option value="refund">Refunds</option>
              </select>

              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 border border-border-base rounded-lg text-sm bg-bg-base text-text-primary"
              >
                <option value="today">Today</option>
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
                <option value="year">This Year</option>
              </select>

              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </Card>

        {/* Transactions Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-base">
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">
                    Customer
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">
                    Type
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">
                    Payment Method
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">
                    Reference
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-text-secondary">
                    Amount
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-text-secondary">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions && filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="border-b border-border-base hover:bg-bg-subtle transition-colors cursor-pointer"
                    >
                      <td className="py-3 px-4 text-sm text-text-primary">
                        {new Date(transaction.date).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-sm font-medium text-text-primary">
                            {transaction.customer_name}
                          </p>
                          <p className="text-xs text-text-secondary">
                            Card: {transaction.card_number}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(transaction.type)}
                          <span className="text-sm text-text-primary">
                            {getTypeLabel(transaction.type)}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-text-primary">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-text-secondary" />
                          {transaction.payment_method}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm font-mono text-text-secondary">
                        {transaction.reference}
                      </td>
                      <td className="py-3 px-4 text-sm text-text-primary text-right font-medium">
                        RWF {transaction.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {getStatusBadge(transaction.status)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center">
                      <div className="text-text-muted">
                        <DollarSign className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No transactions found</p>
                      </div>
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

export default TransactionsPage;
