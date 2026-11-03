import { useQuery } from '@tanstack/react-query';
import { getUsers } from '@domo/client';

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