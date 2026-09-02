import classes from "./Toast.module.css";
import success from "./success.png";
import error from "./error.png";
import warning from "./warning.png";
import info from "./info.png";
import xIcon from "./x-icon.png";


type ToastProps = {
  message: string;
  type: "success" | "error" | "warning" | "info";
  onClose: () => void;
};

const Toast = ({ message, type, onClose }: ToastProps) => {
  const iconMap: Record<ToastProps["type"], string> = {
    success,
    error,
    warning,
    info,
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className={`${classes.toast} ${classes[`toast-${type}`]}`}
    >
      <img
        src={iconMap[type]}
        alt={`${type} icon`}
        className={classes["toast-icon"]}
      />
      <p className={classes["toast-message"]}>{message}</p>
      <button
        className={classes["toast-close-btn"]}
        onClick={onClose}
        aria-label="Close toast"
      >
        <img src={xIcon} alt="close icon" />
      </button>
    </div>
  );
};

export default Toast;
