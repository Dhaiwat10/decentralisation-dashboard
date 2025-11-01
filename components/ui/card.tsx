import * as React from "react";

import { cn } from "@/lib/utils";

type CardElement = HTMLDivElement;

type CardProps = React.HTMLAttributes<CardElement>;

const Card = React.forwardRef<CardElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-zinc-200/70 bg-white/90 shadow-lg ring-1 ring-black/[3%] backdrop-blur transition-colors dark:border-zinc-800/70 dark:bg-zinc-950/70 dark:ring-white/[5%]",
        className,
      )}
      {...props}
    />
  ),
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<CardElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "space-y-1.5 border-b border-zinc-200/60 px-8 py-6 dark:border-zinc-800/60",
        className,
      )}
      {...props}
    />
  ),
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-sm font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400",
      className,
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "text-sm text-zinc-500/90 dark:text-zinc-400/90",
      className,
    )}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<CardElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("px-8 py-10 md:py-12", className)}
      {...props}
    />
  ),
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<CardElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "border-t border-zinc-200/60 px-8 py-6 text-sm text-zinc-500 dark:border-zinc-800/60 dark:text-zinc-400",
        className,
      )}
      {...props}
    />
  ),
);
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
};

