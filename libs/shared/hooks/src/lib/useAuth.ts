// libs/shared/hooks/src/lib/useAuth.ts

import { getUser } from '@domo/client';
import { AUTH_QUERY_KEY } from '@domo/constants';
import { useQuery } from '@tanstack/react-query';

const useAuth = (opts = {}) => {
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: getUser,
    staleTime: Infinity,
    ...opts,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !isError,
  };
};

export { useAuth };
