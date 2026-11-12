// import { UiButton } from '@domo/ui-buttons';
import { useQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  redirect,
  // , useNavigate
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTRPC } from "../integrations/trpc/react";
// import { signOut } from '../lib/auth-client';
import {
  getAvatar,
  getUserID,
  getUsers,
  type UserDTO,
} from "../lib/auth-server-func";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
  beforeLoad: async () => {
    const userID = await getUserID();
    return {
      userID,
    };
  },
  loader: async ({ context }) => {
    if (!context.userID) {
      throw redirect({ to: "/" });
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

  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    getAvatar().then((userAvatar) => setAvatar(userAvatar ?? null));
  }, []);

  const { data: userName } = useQuery({
    queryKey: ["name"],
    queryFn: () => fetch("/api/name").then((res) => res.json()),
  });

  const trpc = useTRPC();
  const { data: userNameFromTRPC } = useQuery({
    ...trpc.people.currentUserName.queryOptions(),
  });

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-6">
      <h1 className="text-4xl font-bold">Dashboard</h1>
      <p className="text-lg">User ID: {userID}</p>

      {userName && (
        <p className="text-lg">User Name: {JSON.stringify(userName)}</p>
      )}
      {userNameFromTRPC && (
        <p className="text-lg">
          User Name from TRPC: {JSON.stringify(userNameFromTRPC)}
        </p>
      )}

      {/* Database Users Section */}
      <div className="flex flex-col w-full max-w-2xl mt-6">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Database Users ({users.length})
        </h2>
        {users.length === 0 ? (
          <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-6 text-center text-gray-500 bg-white dark:bg-slate-900 shadow-sm">
            No users found in database.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {users.map((user: UserDTO) => (
              <div
                key={user.id}
                className="rounded-lg border border-slate-200 dark:border-slate-800 p-4 bg-white dark:bg-slate-900 shadow-sm flex justify-between items-center transition-all hover:shadow-md"
              >
                <div className="flex items-center space-x-3">
                  {/* Optional Avatar Placeholder */}
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-semibold text-slate-600 dark:text-slate-300">
                    {/* {avatar && (
                      <img src={avatar} alt="Avatar" className="w-10 h-10" />
                    )} */}

                    {user.name ? user.name.charAt(0).toUpperCase() : "?"}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-100">
                      {user.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {user.email}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                  {user.id}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
