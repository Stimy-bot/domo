import { createFileRoute, Link } from '@tanstack/react-router';
import { useSession, signOut, signIn } from '../lib/auth-client';
import { UiButton } from '@domo/ui-buttons';


export const Route = createFileRoute('/')({ component: App });

function App() {
  const { data: session } = useSession();

  return (
    <div className="p-5 flex flex-col gap-2">
      <div className="flex flex-row gap-2">
        {session && <Link to="/dashboard">Dashboard</Link>}
        {!session && (
          <UiButton type="button" size="lg" variant="destructive" onClick={() => signIn.social({ provider: 'github' })}>
            Sign in with Github
          </UiButton>
        )}
      </div>
      {session && <p>Client Signed in as {session.user.name}</p>}
    </div>
  );
}
