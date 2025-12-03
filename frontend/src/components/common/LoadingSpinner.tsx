interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const LoadingSpinner = ({
  size = "md",
  className = "",
}: LoadingSpinnerProps) => {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div
      className={`animate-spin rounded-full border-2 border-primary border-t-transparent ${sizes[size]} ${className}`}
    />
  );
};

export const PageLoader = () => {
  return (
    <div className="flex items-center justify-center py-12">
      <LoadingSpinner size="lg" />
    </div>
  );
};
