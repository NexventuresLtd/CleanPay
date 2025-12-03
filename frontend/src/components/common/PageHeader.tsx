interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  actions?: React.ReactNode;
}

export const PageHeader = ({
  title,
  subtitle,
  backHref,
  actions,
}: PageHeaderProps) => {
  return (
    <div className="bg-bg-base border-b border-border-base">
      <div className="px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {backHref && (
              <a
                href={backHref}
                className="p-2 -ml-2 rounded-lg text-text-secondary hover:bg-bg-subtle hover:text-text-primary transition-colors"
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
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </a>
            )}
            <div>
              <h1 className="text-2xl font-bold text-text-primary">{title}</h1>
              {subtitle && (
                <p className="mt-1 text-sm text-text-secondary">{subtitle}</p>
              )}
            </div>
          </div>
          {actions && <div className="flex items-center gap-3">{actions}</div>}
        </div>
      </div>
    </div>
  );
};
