import { QueryClient, useQuery } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export default queryClient;

// A function to fetch the user role (this would typically call your API)
const fetchUserRole = async () => {
  const accessToken = 'user'; // TODO: Replace or pass the token securely
  try {
    const response = await fetch('/user:role', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch user role:', error); // Process the error
    throw error; // Re-throw the error to let the caller handle it
  }
};

// Custom hook for accessing the user role
export const useUserRole = () => {
  const { data: role, error, isLoading } = useQuery({
    queryKey: ['userRole'],
    queryFn: fetchUserRole,
    retry: 0, // Explicitly 0 or false works
    staleTime: 300000, // 5 minutes
    
    // ADD THESE TWO:
    refetchOnWindowFocus: false, // Prevents 401 spam when you switch tabs
    retryOnMount: false,         // Prevents retrying if the component re-mounts after a fail
  });

  return { role, error, isLoading };
};