interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info" | "primary";
  size?: "sm" | "md";
}

export const Badge = ({
  children,
  variant = "default",
  size = "sm",
}: BadgeProps) => {
  const variants = {
    default: "bg-gray-100 text-gray-700",
    success: "bg-success-light text-success",
    warning: "bg-warning-light text-warning",
    danger: "bg-danger-light text-danger",
    info: "bg-info-light text-info",
    primary: "bg-primary-light text-primary",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${variants[variant]} ${sizes[size]}`}
    >
      {children}
    </span>
  );
};

// Common status badge helper
interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md";
}

export const StatusBadge = ({ status, size = "sm" }: StatusBadgeProps) => {
  const getVariant = (): BadgeProps["variant"] => {
    switch (status.toLowerCase()) {
      case "active":
      case "completed":
      case "paid":
        return "success";
      case "suspended":
      case "pending":
      case "scheduled":
        return "warning";
      case "archived":
      case "inactive":
      case "cancelled":
        return "default";
      case "overdue":
      case "missed":
      case "failed":
        return "danger";
      case "in_progress":
        return "info";
      default:
        return "default";
    }
  };

  const formatStatus = (s: string) =>
    s.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <Badge variant={getVariant()} size={size}>
      {formatStatus(status)}
    </Badge>
  );
};
