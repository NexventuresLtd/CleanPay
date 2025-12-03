/**
 * CollectorPortalLayout - Layout wrapper for collector portal pages
 * Mobile-first design optimized for field workers with bottom navigation
 */

import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

interface CollectorPortalLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  {
    name: "Dashboard",
    href: "/collector",
    icon: (active: boolean) => (
      <svg
        className="w-6 h-6"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={active ? 0 : 2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
  },
  {
    name: "Schedules",
    href: "/collector/schedules",
    icon: (active: boolean) => (
      <svg
        className="w-6 h-6"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={active ? 0 : 2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    name: "Routes",
    href: "/collector/routes",
    icon: (active: boolean) => (
      <svg
        className="w-6 h-6"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={active ? 0 : 2}
          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
        />
      </svg>
    ),
  },
  {
    name: "Profile",
    href: "/collector/profile",
    icon: (active: boolean) => (
      <svg
        className="w-6 h-6"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={active ? 0 : 2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
  },
];

export const CollectorPortalLayout = ({
  children,
}: CollectorPortalLayoutProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-bg-subtle pb-20 lg:pb-0 lg:pl-64">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:top-0 lg:left-0 lg:h-full lg:w-64 bg-bg-base border-r border-border-base">
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-border-base">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-success rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                />
              </svg>
            </div>
            <div>
              <span className="font-semibold text-text-primary">
                Collector Hub
              </span>
              <span className="block text-xs text-text-secondary">
                Clean Pay
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive =
              location.pathname === item.href ||
              (item.href !== "/collector" &&
                location.pathname.startsWith(item.href));
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-success text-white"
                    : "text-text-secondary hover:bg-bg-subtle hover:text-text-primary"
                }`}
              >
                {item.icon(isActive)}
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* User menu (Desktop) */}
        <div className="p-4 border-t border-border-base">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-success-light rounded-full flex items-center justify-center">
              <span className="text-success font-medium">
                {user?.first_name?.[0]}
                {user?.last_name?.[0]}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">
                {user?.full_name || `${user?.first_name} ${user?.last_name}`}
              </p>
              <p className="text-xs text-text-secondary truncate">Collector</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-danger hover:bg-danger-light rounded-lg transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-4 bg-bg-base border-b border-border-base lg:hidden">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-success rounded-lg flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
              />
            </svg>
          </div>
          <span className="font-semibold text-text-primary">Collector Hub</span>
        </div>

        {/* Profile menu button */}
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="w-9 h-9 bg-success-light rounded-full flex items-center justify-center"
        >
          <span className="text-success font-medium text-sm">
            {user?.first_name?.[0]}
            {user?.last_name?.[0]}
          </span>
        </button>
      </header>

      {/* Profile Dropdown (Mobile) */}
      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-40 lg:hidden"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-4 top-14 z-50 w-56 bg-bg-base rounded-lg shadow-xl border border-border-base lg:hidden">
            <div className="p-4 border-b border-border-base">
              <p className="text-sm font-medium text-text-primary">
                {user?.full_name || `${user?.first_name} ${user?.last_name}`}
              </p>
              <p className="text-xs text-text-secondary">{user?.email}</p>
            </div>
            <div className="p-2">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-danger hover:bg-danger-light rounded-lg transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}

      {/* Page content */}
      <main className="relative">{children}</main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-bg-base border-t border-border-base lg:hidden safe-area-inset-bottom">
        <div className="flex items-center justify-around h-16">
          {navigation.map((item) => {
            const isActive =
              location.pathname === item.href ||
              (item.href !== "/collector" &&
                location.pathname.startsWith(item.href));
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors ${
                  isActive ? "text-success" : "text-text-secondary"
                }`}
              >
                {item.icon(isActive)}
                <span className="text-xs font-medium">{item.name}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default CollectorPortalLayout;
