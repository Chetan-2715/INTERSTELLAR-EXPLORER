"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface ButtonProps extends HTMLMotionProps<"button"> {
    variant?: "primary" | "secondary" | "outline";
    glow?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", glow = true, children, ...props }, ref) => {
        const variants = {
            primary: "bg-cyan-500 text-black hover:bg-cyan-400",
            secondary: "bg-purple-600 text-white hover:bg-purple-500",
            outline: "border border-cyan-500 text-cyan-500 hover:bg-cyan-500/10",
        };

        return (
            <motion.button
                ref={ref}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                    "px-8 py-4 rounded-full font-orbitron font-bold tracking-wider transition-all duration-300",
                    variants[variant],
                    glow && "shadow-[0_0_20px_rgba(0,240,255,0.5)] hover:shadow-[0_0_40px_rgba(0,240,255,0.8)]",
                    className
                )}
                {...props}
            >
                {children}
            </motion.button>
        );
    }
);

Button.displayName = "Button";
