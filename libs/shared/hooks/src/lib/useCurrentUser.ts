// libs/shared/hooks/src/lib/useCurrentUser.ts

import { fetchCurrentUser } from '@domo/client';
import { CURRENT_USER_QUERY_KEY } from '@domo/constants';
import type { User } from '@domo/types';
import { useQuery } from '@tanstack/react-query';

function useCurrentUser() {
  return useQuery<User | null, Error>({
    queryKey: CURRENT_USER_QUERY_KEY,
    queryFn: async () => {
      const response = await fetchCurrentUser();
      // Handle Axios response vs raw data
      const userData =
        response && 'data' in response ? (response.data as User) : (response as User);
      return userData || null;
    },
    staleTime: 5 * 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

export { useCurrentUser };
