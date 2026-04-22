import type { PropsWithChildren } from "react";

interface DashboardSectionStackProps extends PropsWithChildren {
  className?: string;
}

export const DashboardSectionStack = ({
  children,
  className = "",
}: DashboardSectionStackProps) => {
  return (
    <div className={`mt-8 flex flex-col gap-12 ${className}`}>{children}</div>
  );
};
