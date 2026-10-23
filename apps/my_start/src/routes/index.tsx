import { createFileRoute, Link } from '@tanstack/react-router';
import { useSession, signOut, signIn } from '../lib/auth-client';
import { UiButton } from '@domo/ui-buttons';

export const Route = createFileRoute('/')({ component: App });

function App() {
  const { data: session } = useSession();

  return (
    <div className="p-5 flex flex-col items-center gap-2">
      <div    className="inline-flex items-center gap-2 rounded-md border border-(--chip-line) bg-(--chip-bg) px-3 py-1.5 text-sm text-(--sea-ink) no-underline shadow-[0_8px_24px_rgba(30,90,72,0.08)] sm:px-4 sm:py-2">
        {session && <Link to="/dashboard">Dashboard</Link>}
        {!session && (
          <UiButton type="button" onClick={() => signIn.social({ provider: 'github' })} className="items-center gap-2 rounded-md border border-(--chip-line) bg-(--chip-bg) px-3 py-1.5 text-sm text-(--sea-ink) no-underline shadow-[0_8px_24px_rgba(30,90,72,0.08)] sm:px-4 sm:py-2">
            Sign in with Github
          </UiButton>
        )}
      </div>
      {session && <p>Client Signed in as {session.user.name}</p>}
    </div>
  );
}
