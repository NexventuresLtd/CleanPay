interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    type: "increase" | "decrease" | "neutral";
  };
  icon: React.ReactNode;
  iconBgClass?: string;
  iconColorClass?: string;
}

export const StatCard = ({
  title,
  value,
  change,
  icon,
  iconBgClass = "bg-primary-light",
  iconColorClass = "text-primary",
}: StatCardProps) => {
  const getChangeColor = () => {
    if (!change) return "";
    switch (change.type) {
      case "increase":
        return "text-success";
      case "decrease":
        return "text-danger";
      default:
        return "text-text-secondary";
    }
  };

  return (
    <div className="bg-bg-base rounded-xl border border-border-base p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className={`p-3 rounded-lg ${iconBgClass}`}>
          <div className={iconColorClass}>{icon}</div>
        </div>
        {change && (
          <span className={`text-sm font-medium ${getChangeColor()}`}>
            {change.value}
          </span>
        )}
      </div>
      <div className="mt-4">
        <h3 className="text-2xl font-bold text-text-primary">{value}</h3>
        <p className="text-sm text-text-tertiary mt-1">{title}</p>
      </div>
    </div>
  );
};
