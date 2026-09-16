import React from 'react';
export type ToastType = 'success' | 'error' | 'warning' | 'info';
export interface Toast {
    id: string;
    type: ToastType;
    message: string;
}
export type ToastContextType = {
    toasts: Toast[];
    addToast: (t: Omit<Toast, 'id'>) => void;
    removeToast: (id: string) => void;
};
export declare const ToastContext: React.Context<ToastContextType | undefined>;
export declare const ToastProvider: React.FC<React.PropsWithChildren<object>>;
//# sourceMappingURL=toastContext.d.ts.map