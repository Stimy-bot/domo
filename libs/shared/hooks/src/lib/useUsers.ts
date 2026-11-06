import { getUsers } from '@domo/client';
import { useQuery } from '@tanstack/react-query';

export const USERS = 'users';

const useUsers = (opts = {}) => {
  const { data: users = [], ...rest } = useQuery({
    queryKey: [USERS],
    queryFn: () => getUsers(),
    ...opts,
  });
  console.log(users);
  return { users, ...rest };
};
export { useUsers };
