// libs/shared/reusableComponents/src/lib/handleClickOutsideDropdown.tsx
import { useEffect, type RefObject } from 'react';

function HandleClickOutsideDropdown(
  ref: RefObject<HTMLElement>,
  handler: (event: MouseEvent | TouchEvent) => void
): void {
  useEffect(() => {
    const handleEvent = (event: MouseEvent | TouchEvent) => {
      const targetElement = ref?.current;

      // Exit early if the target element is not defined or the click is inside the element
      if (!targetElement || targetElement.contains(event.target as Node)) {
        return;
      }

      // Invoke the handler
      handler(event);
    };

    // Add event listeners
    document.addEventListener('mousedown', handleEvent);
    document.addEventListener('touchstart', handleEvent);

    // Cleanup event listeners on unmount
    return () => {
      document.removeEventListener('mousedown', handleEvent);
      document.removeEventListener('touchstart', handleEvent);
    };
  }, [ref, handler]);
}

export { HandleClickOutsideDropdown };