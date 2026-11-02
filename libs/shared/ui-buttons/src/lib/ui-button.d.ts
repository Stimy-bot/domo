import { type VariantProps } from 'class-variance-authority';
import * as React from 'react';
export interface ButtonProps {
    className?: string;
    children: React.ReactNode;
    isDisabled?: boolean;
    isLoading?: boolean;
}
declare const buttonVariants: (props?: ({
    variant?: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined;
    size?: "default" | "sm" | "lg" | "icon" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}
declare const UiButton: React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement>>;
export { UiButton, buttonVariants };
//# sourceMappingURL=ui-button.d.ts.map