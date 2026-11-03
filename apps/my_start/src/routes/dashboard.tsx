// import { UiButton } from '@domo/ui-buttons';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, redirect
  // , useNavigate
} from '@tanstack/react-router';
// import { useEffect, useState } from 'react';
import { useTRPC } from '../integrations/trpc/react';
// import { signOut } from '../lib/auth-client';
import {
  //  getAvatar,
   getUserID, getUsers, type UserDTO } from '../lib/auth-server-func';

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent,
  beforeLoad: async () => {
    const userID = await getUserID();
    return {
      userID,
    };
  },
  loader: async ({ context }) => {
    if (!context.userID) {
      throw redirect({ to: '/' });
    }

    const users = await getUsers();

    return {
      userID: context.userID,
      
      users,
    };
  },
});

function RouteComponent() {
  const { userID, users } = Route.useLoaderData();
  // const navigate = useNavigate();

  // const [avatar, setAvatar] = useState<string | null>(null);

  // useEffect(() => {
  //   getAvatar().then(userAvatar => setAvatar(userAvatar ?? null));
  // }, []);

  const { data: userName } = useQuery({
    queryKey: ['name'],
    queryFn: () => fetch('/api/name').then(res => res.json()),
  });

  const trpc = useTRPC();
  const { data: userNameFromTRPC } = useQuery({
    ...trpc.people.currentUserName.queryOptions(),
  });

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-6">
      <h1 className="text-4xl font-bold">Dashboard</h1>
      <p className="text-lg">User ID: {userID}</p>
      
      {userName && <p className="text-lg">User Name: {JSON.stringify(userName)}</p>}
      {userNameFromTRPC && <p className="text-lg">User Name from TRPC: {JSON.stringify(userNameFromTRPC)}</p>}

      {/* Database Users Section */}
      <div className="w-full max-w-2xl mt-6 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
        <h2 className="text-2xl font-semibold mb-4 text-center">Database Users ({users.length})</h2>
        {users.length === 0 ? (
          <p className="text-center text-gray-500">No users found in database.</p>
        ) : (
          <ul className="divide-y divide-slate-200 dark:divide-slate-800">
            {users.map((user: UserDTO) => (
              <li key={user.id} className="py-3 flex justify-between items-center px-2">
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                </div>
                <span className="text-xs font-mono text-gray-400">{user.id}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
