// apps/my_vite/src/lib/navigation.ts

// Define a more flexible type that matches React Router's NavigateOptions
type NavigateOptions = {
  state?: unknown;
  replace?: boolean;
};

export let navigate: (
  path: string,
  options?: NavigateOptions,
) => void = () => {
  throw new Error('Navigation function has not been initialized');
};

export const setNavigate = (fn: typeof navigate) => {
  navigate = fn;
};
