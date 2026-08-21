import { useState, useRef, useCallback, useEffect } from "react";
import { HandleClickOutsideDropdown } from "../../../reusableComponents/src/lib/handleClickOutsideDropdown.js";
import clsx from "clsx";

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  position?: "topRight" | "bottomRight" | "bottomLeft";
    onOpenChange?: (open: boolean) => void;

}

const positionClasses = {
  topRight: "right-0 mt-2",
  bottomRight: "bottom-0 right-0",
  bottomLeft: "bottom-0 left-0",
};

export const Dropdown = ({ trigger, children, position = "topRight", onOpenChange }: DropdownProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  HandleClickOutsideDropdown(ref as React.RefObject<HTMLDivElement>, () => setOpen(false));
  const toggle = useCallback(() => setOpen((prev) => !prev), []);

useEffect(() => {
  if (onOpenChange) {
    onOpenChange(open);
  }
}, [open, onOpenChange]);

  return (
    <div ref={ref} className="relative">
      <div onClick={toggle}>{trigger}</div>
      {open && (
       <div className={clsx(
  "absolute z-50 p-2 rounded-md bg-dark-hard",
  positionClasses[position]
)}>
  {children}
</div>
      )}
    </div>
  );
};