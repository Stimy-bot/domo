// client/src/components/ReusableComponents/Button.tsx
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@domo/utils";
import { type LinkProps } from "@tanstack/react-router"; // Ensure this import is correct

// --- Button Variants (CVA) ---
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;

// --- Custom Button Props (Base) ---
type ButtonRenderProps = {
  isActive: boolean;
  isTransitioning: boolean;
};

interface BaseButtonProps extends ButtonVariants {
  isLoading?: boolean;
  loader?: React.ReactNode;
  isPending?: boolean;
  // FIX 1: Explicitly include standard attributes like className for consistency
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode | ((props: ButtonRenderProps) => React.ReactNode);
}

// 1. Define Conditional Props (Polymorphism using 'asChild')
type ConditionalProps =
  | ({ asChild?: false } & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseButtonProps | "children">)
  // When asChild is true, accept LinkProps (which carries anchor/to props)
  | ({ asChild: true } & Omit<LinkProps, keyof BaseButtonProps | "children">);

// Combine base props with conditional props
export type ButtonProps = BaseButtonProps & ConditionalProps;

// 2. Update Ref Type
// The ref must be able to hold either a Button or an Anchor (what Link renders)
type PolymorphicRef =
  | React.ForwardedRef<HTMLButtonElement>
  | React.ForwardedRef<HTMLAnchorElement>;


const Button = React.forwardRef<PolymorphicRef extends React.ForwardedRef<infer T> ? T : HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      isLoading = false,
      loader = <span className="loader" aria-hidden="true" />,
      asChild = false,
      children,
      disabled,
      isPending,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? loader : typeof children === 'function' ? children({ isActive: false, isTransitioning: false }) : children}     
         </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };