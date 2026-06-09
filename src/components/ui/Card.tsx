import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../utils/cn";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  glass?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  children?: ReactNode;
}

const padMap = { none: "", sm: "p-4", md: "p-6", lg: "p-8" };

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = true, glass = false, padding = "md", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl border",
          glass ? "glass" : "card",
          hover && "transition-all duration-300",
          padMap[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = "Card";

export function CardHeader({ title, subtitle, icon, action }: { title: ReactNode; subtitle?: ReactNode; icon?: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-5 flex items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        {icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-eco-500/15 to-aurora-500/15 text-eco-600 dark:text-eco-400">
            {icon}
          </div>
        )}
        <div>
          <h3 className="font-display text-base font-semibold tracking-tight">{title}</h3>
          {subtitle && <p className="mt-0.5 text-sm text-[var(--text-mute)]">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}
