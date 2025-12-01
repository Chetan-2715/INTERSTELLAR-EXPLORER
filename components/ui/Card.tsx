import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    glow?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, glow = false, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "glass-panel rounded-xl p-6 transition-all duration-300",
                    glow && "hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:border-cyan-500/50",
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
