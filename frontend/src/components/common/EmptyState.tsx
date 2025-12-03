interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState = ({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) => {
  return (
    <div className="text-center py-12">
      {icon && (
        <div className="mx-auto w-12 h-12 text-gray-400 mb-4">{icon}</div>
      )}
      <h3 className="text-sm font-medium text-text-primary">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-text-secondary">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};
