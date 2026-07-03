import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-pill px-3 py-1 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "glass text-ink-muted",
        violet: "bg-violet/15 text-violet-soft border border-violet/25",
        coral: "bg-coral/15 text-coral-soft border border-coral/25",
        emerald: "bg-emerald/15 text-emerald border border-emerald/25",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
