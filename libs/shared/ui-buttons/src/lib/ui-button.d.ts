import * as React from "react";
import { type VariantProps } from "class-variance-authority";
export interface ButtonProps {
    className?: string;
    children: React.ReactNode;
    isDisabled?: boolean;
    isLoading?: boolean;
}
declare const buttonVariants: (props?: ({
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null | undefined;
    size?: "default" | "sm" | "lg" | "icon" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}
declare const UiButton: React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement>>;
export { UiButton, buttonVariants };
//# sourceMappingURL=ui-button.d.ts.map