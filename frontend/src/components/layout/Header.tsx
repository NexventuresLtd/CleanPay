import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export const Header = ({ title, subtitle, actions }: HeaderProps) => {
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-16 bg-bg-base border-b border-border-base flex items-center justify-between px-6">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">{title}</h1>
        {subtitle && <p className="text-sm text-text-secondary">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        {actions}

        {/* Search */}
        <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-bg-subtle rounded-lg border border-border-base w-64">
          <svg
            className="w-4 h-4 text-text-tertiary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search..."
            className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-tertiary outline-none"
          />
          <kbd className="hidden lg:inline-flex text-xs text-text-tertiary bg-bg-base px-1.5 py-0.5 rounded border border-border-base">
            ⌘K
          </kbd>
        </div>

        {/* Notifications */}
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative p-2 rounded-lg text-text-secondary hover:bg-bg-subtle hover:text-text-primary transition-colors"
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
              strokeWidth={1.5}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full"></span>
        </button>

        {/* User Menu (Mobile) */}
        <div className="lg:hidden flex items-center">
          <button className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center">
            <span className="text-xs font-semibold text-primary">
              {user?.first_name?.charAt(0)}
              {user?.last_name?.charAt(0)}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
