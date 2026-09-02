// client/src/lib/navigation.ts

// Define a more flexible type that matches React Router's NavigateOptions
type NavigateOptions = {
  state?: any;
  replace?: boolean;
};

export let navigate: (path: string, options?: NavigateOptions) => void = () => {};

export const setNavigate = (fn: any) => {
  navigate = fn;
};