// apps/my_start/src/integrations/better-auth/header-user.tsx
import { UiButton } from '@domo/ui-buttons';
import { Link, useNavigate } from '@tanstack/react-router';
import { authClient } from '../../lib/auth-client';

export default function BetterAuthHeader() {
  const { data: session, isPending } = authClient.useSession();
  const navigate = useNavigate();

  if (isPending) {
    return <div className='h-8 w-8 bg-neutral-100 dark:bg-neutral-800 animate-pulse' />;
  }

  if (session?.user) {
    return (
      <div className='flex items-center gap-2'>
     <div className='order-3 flex w-full flex-wrap items-center gap-x-4 gap-y-1 pb-1 text-sm font-semibold sm:order-2 sm:w-auto sm:flex-nowrap sm:pb-0'>
          <Link to='/profile' className='nav-link' activeProps={{ className: 'nav-link is-active' }}>
            Profile
          </Link>
          <Link to='/contact' className='nav-link' activeProps={{ className: 'nav-link is-active' }}>
            Contact
          </Link>
        </div>

      {/* User Avatar */}
        {session.user.image ? (
          <img src={session.user.image} alt='' className='h-8 w-8 rounded-full' />
        ) : (
          <div className='h-8 w-8 bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center rounded-full'>
            <span className='text-xs font-medium text-neutral-600 dark:text-neutral-400'>
              {session.user.name?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
        )}
        <UiButton
          type='button'
          onClick={() => {
            authClient.signOut({
              fetchOptions: {
                onSuccess: () => {
                  navigate({ to: '/' });
                },
              },
            });
          }}
          className='flex-1 h-9 px-4 text-sm font-medium bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors rounded-md'
        >
          Sign out
        </UiButton>
      </div>
    );
  }

  return (
    <Link
      to='/login'
      className='h-9 px-4 text-sm font-medium bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors inline-flex items-center rounded-md'
    >
      Sign in
    </Link>
  );
}
