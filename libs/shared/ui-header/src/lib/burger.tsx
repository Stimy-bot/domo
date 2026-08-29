import { useState, useMemo } from 'react';
import { Divide as Hamburger } from 'hamburger-react';
// import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { navlinks } from '../../src/lib/navLinks.js';
import { Dropdown } from './dropdown.js';
// import { logout } from '../../api/auth';
// import { useCurrentUser } from '../../hooks/useCurrentUser';
// import { Dropdown } from './Dropdown';
// import useAuth from '../../hooks/useAuth';
// import { useToast } from '../../context/ToastContext';
// import type { Role, User } from '../../types/user.types'; 

const Burger = () => {
  const [isOpen, setIsOpen] = useState(false);
//   const { user: authUser } = useAuth();
//   const { data: currentUser } = useCurrentUser();
  const navigate = useNavigate();
//   const queryClient = useQueryClient();
//   const { addToast } = useToast() ?? { addToast: () => {} };

//   const effectiveUser = useMemo(() => {
//     return (authUser || currentUser) as User | null;
//   }, [authUser, currentUser]);

  const visibleLinks = useMemo(() => {
    // const roles: Role[] = effectiveUser?.role ?? [];
    // return navlinks.filter((nav) => {
    //   if (!nav.roles || nav.roles.length === 0) return true;
    //   return effectiveUser && nav.roles.some((r) => roles.includes(r as Role));
    // });
  }, [effectiveUser]);

//   const { mutate: signOut } = useMutation({
//     mutationFn: logout,
//     onSettled: () => {
//       queryClient.clear();
//       addToast('Signed out successfully!', 'success');
//       setIsOpen(false);
//       navigate({ to: '/', replace: true });
//     },
//   });

  return (
    <Dropdown
      onOpenChange={setIsOpen}
      position="topRight"
      trigger={
        <button className="md:hidden text-dark-light pr-5" onClick={() => setIsOpen((x) => !x)}>
          <Hamburger toggled={isOpen} toggle={setIsOpen} />
        </button>
      }
    >
      <ul className="space-y-2 min-w-37.5 p-2">
        {visibleLinks.map((link) => (
          <li key={link.title}>
            <Link
              to={link.link}
              className="block p-2 text-dark-light hover:bg-dark-soft rounded-md"
              onClick={() => setIsOpen(false)}
            >
              {link.title}
            </Link>
          </li>
        ))}

        {effectiveUser ? (
          <>
            <hr className="border-dark-soft my-2" />
            <li>
              <button
                className="block w-full text-left text-red-400 hover:bg-dark-soft p-2 rounded-md"
                onClick={() => signOut()}
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <hr className="border-dark-soft my-2" />
            <li><Link to="/login" className="text-dark-light hover:bg-dark-soft block p-2" onClick={() => setIsOpen(false)}>Sign In</Link></li>
            <li><Link to="/register" className="text-dark-light hover:bg-dark-soft block p-2" onClick={() => setIsOpen(false)}>Sign Up</Link></li>
          </>
        )}
      </ul>
    </Dropdown>
  );
};

export default Burger;