type ToastProps = {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
};
declare const Toast: ({ message, type, onClose }: ToastProps) => import('react').JSX.Element;
export default Toast;
//# sourceMappingURL=Toast.d.ts.map
