import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { AppLayout } from "../../components/layout";
import { Button, StatCard, Card, CardHeader } from "../../components/common";

export const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                Welcome back, {user?.first_name}! 👋
              </h1>
              <p className="text-white/80">
                Here's what's happening with your operations today.
              </p>
            </div>
            <div className="hidden md:flex gap-3">
              <Button
                variant="secondary"
                onClick={() => navigate("/customers/new")}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                Add Customer
              </Button>
              <Button
                variant="primary"
                onClick={() => navigate("/schedules")}
                className="bg-white text-primary hover:bg-white/90"
              >
                View Schedules
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Revenue"
            value="RWF 24,532,000"
            change={{ value: "+12.5%", type: "increase" }}
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
            iconBgClass="bg-primary-light"
            iconColorClass="text-primary"
          />

          <StatCard
            title="Collections Today"
            value="156"
            change={{ value: "+8", type: "increase" }}
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
            iconBgClass="bg-success-light"
            iconColorClass="text-success"
          />

          <StatCard
            title="Pending Payments"
            value="23"
            change={{ value: "RWF 8,420,000", type: "neutral" }}
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
            iconBgClass="bg-warning-light"
            iconColorClass="text-warning"
          />

          <StatCard
            title="Active Customers"
            value="342"
            change={{ value: "+5 new", type: "increase" }}
            icon={
              <svg
                className="w-6 h-6"
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
            iconBgClass="bg-info-light"
            iconColorClass="text-info"
          />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Schedule */}
          <Card className="lg:col-span-2">
            <CardHeader
              title="Today's Schedule"
              subtitle="4 collections remaining"
              action={
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/schedules")}
                >
                  View All
                </Button>
              }
            />
            <div className="space-y-3">
              {[
                {
                  route: "Route A - Kigali Central",
                  time: "08:00 - 10:00",
                  status: "completed",
                  collector: "Jean Mugabo",
                },
                {
                  route: "Route B - Nyarugenge",
                  time: "10:30 - 12:30",
                  status: "in_progress",
                  collector: "Marie Uwimana",
                },
                {
                  route: "Route C - Kicukiro",
                  time: "14:00 - 16:00",
                  status: "scheduled",
                  collector: "Eric Habimana",
                },
                {
                  route: "Route D - Gasabo",
                  time: "16:30 - 18:30",
                  status: "scheduled",
                  collector: "Grace Mukamana",
                },
              ].map((schedule, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 rounded-lg bg-bg-subtle hover:bg-bg-muted transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        schedule.status === "completed"
                          ? "bg-success"
                          : schedule.status === "in_progress"
                          ? "bg-info"
                          : "bg-gray-300"
                      }`}
                    />
                    <div>
                      <p className="font-medium text-text-primary">
                        {schedule.route}
                      </p>
                      <p className="text-sm text-text-secondary">
                        {schedule.collector}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-text-primary">
                      {schedule.time}
                    </p>
                    <p
                      className={`text-xs capitalize ${
                        schedule.status === "completed"
                          ? "text-success"
                          : schedule.status === "in_progress"
                          ? "text-info"
                          : "text-text-tertiary"
                      }`}
                    >
                      {schedule.status.replace("_", " ")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader title="Quick Actions" />
            <div className="space-y-3">
              <button
                onClick={() => navigate("/invoices/new")}
                className="w-full flex items-center gap-3 p-4 rounded-lg bg-bg-subtle hover:bg-primary-light hover:text-primary transition-colors text-left"
              >
                <div className="p-2 bg-bg-base rounded-lg">
                  <svg
                    className="w-5 h-5 text-primary"
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
                </div>
                <div>
                  <p className="font-medium text-text-primary">
                    Create Invoice
                  </p>
                  <p className="text-xs text-text-secondary">
                    Generate a new invoice
                  </p>
                </div>
              </button>

              <button
                onClick={() => navigate("/customers")}
                className="w-full flex items-center gap-3 p-4 rounded-lg bg-bg-subtle hover:bg-primary-light hover:text-primary transition-colors text-left"
              >
                <div className="p-2 bg-bg-base rounded-lg">
                  <svg
                    className="w-5 h-5 text-secondary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-text-primary">
                    View Customers
                  </p>
                  <p className="text-xs text-text-secondary">
                    Manage customer database
                  </p>
                </div>
              </button>

              <button
                onClick={() => navigate("/collectors")}
                className="w-full flex items-center gap-3 p-4 rounded-lg bg-bg-subtle hover:bg-primary-light hover:text-primary transition-colors text-left"
              >
                <div className="p-2 bg-bg-base rounded-lg">
                  <svg
                    className="w-5 h-5 text-info"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-text-primary">
                    Manage Collectors
                  </p>
                  <p className="text-xs text-text-secondary">
                    Track field staff
                  </p>
                </div>
              </button>

              <button
                onClick={() => navigate("/reports")}
                className="w-full flex items-center gap-3 p-4 rounded-lg bg-bg-subtle hover:bg-primary-light hover:text-primary transition-colors text-left"
              >
                <div className="p-2 bg-bg-base rounded-lg">
                  <svg
                    className="w-5 h-5 text-warning"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-text-primary">View Reports</p>
                  <p className="text-xs text-text-secondary">
                    Analytics & insights
                  </p>
                </div>
              </button>
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader
            title="Recent Activity"
            action={
              <Button variant="ghost" size="sm">
                View All
              </Button>
            }
          />
          <div className="divide-y divide-border-base">
            {[
              {
                action: "Payment received",
                customer: "Kigali Coffee Co.",
                amount: "RWF 120,000",
                time: "2 minutes ago",
                icon: "💰",
              },
              {
                action: "Collection completed",
                customer: "Route A - Kigali Central",
                amount: "45 stops",
                time: "15 minutes ago",
                icon: "✅",
              },
              {
                action: "New customer added",
                customer: "Green Gardens Hotel",
                amount: "",
                time: "1 hour ago",
                icon: "👤",
              },
              {
                action: "Invoice sent",
                customer: "Mille Collines Hotel",
                amount: "RWF 450,000",
                time: "2 hours ago",
                icon: "📧",
              },
              {
                action: "Schedule updated",
                customer: "Route C - Kicukiro",
                amount: "",
                time: "3 hours ago",
                icon: "📅",
              },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="font-medium text-text-primary">
                      {item.action}
                    </p>
                    <p className="text-sm text-text-secondary">
                      {item.customer}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {item.amount && (
                    <p className="font-medium text-text-primary">
                      {item.amount}
                    </p>
                  )}
                  <p className="text-sm text-text-tertiary">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppLayout>
  );
};
