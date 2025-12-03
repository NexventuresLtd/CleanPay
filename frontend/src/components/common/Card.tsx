interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  onClick?: () => void;
}

export const Card = ({
  children,
  className = "",
  padding = "md",
  onClick,
}: CardProps) => {
  const paddingClasses = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  const clickableClasses = onClick ? "cursor-pointer" : "";

  return (
    <div
      className={`bg-bg-base rounded-xl border border-border-base ${paddingClasses[padding]} ${clickableClasses} ${className}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const CardHeader = ({ title, subtitle, action }: CardHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
        {subtitle && (
          <p className="text-sm text-text-secondary mt-0.5">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
};
