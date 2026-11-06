// libs/shared/reusableComponents/src/lib/userCard.tsx
import { deleteAccount } from '@domo/client';
import { useToast } from '@domo/context';
import { useAuth } from '@domo/hooks';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from './button';
import { Modal } from './modal';
import { Wrapper } from './wrapper';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
  gender: string;
  age: number;
  profilePicture: string;
  createdAt: string;
  isCurrent: boolean;
}

interface UserCardProps {
  user: User;
}

function UserCard({ user }: UserCardProps) {
  const { firstName, lastName, email, profilePicture, createdAt } = user;
  const [openModal, setOpenModal] = useState<boolean>(false);
  const { addToast } = useToast();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth() as unknown as {
    user: {
      _id: string;
      phone: string;
      email: string;
      bio: string;
      profilePicture: string;
      role: string;
      firstName: string;
      gender: string;
      age: number;
      lastName: string;
      createdAt: string;
    } | null;
  };

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  const { mutate: deleteUser, isPending } = useMutation({
    mutationFn: (id: string) => deleteAccount(id, {}),
    onSuccess: () => {
      addToast({ message: 'Account deleted successfully', type: 'success' });
      // queryClient.invalidateQueries({ queryKey: [AUTH] });
      navigate({
        to: '/',
        replace: true,
      });
    },
  });

  return (
    <div className='flex flex-col items-center justify-between p-4 border-2 rounded-lg shadow-md'>
      <div className='flex flex-col items-center justify-center'>
        <span className=' mx-auto text-center md:text-md sm:text-xs '>
          {firstName} {''} {lastName}
          <br />
          {email}
        </span>
        <img
          src={
            profilePicture ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(`${firstName} ${lastName}`)}`
          }
          alt='profile'
          className='rounded-full size-12 content-fit'
        />
      </div>
      <div className='flex gap-10 justify-between'>
        <Button title='Delete User' onClick={() => deleteUser(user._id)} disabled={isPending}>
          <Trash2 className='size-8' aria-hidden='true' />
        </Button>
        <Button
          title='Update User'
          onClick={() => navigate({ to: '/profile' })}
          disabled={isPending}
        >
          <Pencil className='size-8' aria-hidden='true' />
        </Button>
      </div>
      <Wrapper>
        <button
          type='button'
          onClick={() => setOpenModal(true)}
          className='bg-transparent w-full hover:bg-transparent text-xs cursor-pointer p-2 rounded-md text-left'
        >
          Click for more details
        </button>
        <Modal open={openModal} onClose={() => setOpenModal(false)}>
          <div className='flex flex-col text-center w-96 p-5 text-xs'>
            <p>
              Name: {firstName} {lastName}
            </p>
            <img
              src={profilePicture}
              alt='Company Logo'
              className='flex flex-col rounded-full size-6 content-fit mx-auto my-2'
            />
            <p>
              Email: {currentUser.email} <br />
              Phone: {currentUser.phone} <br />
              Bio: {currentUser.bio} <br />
              Role: {currentUser.role} <br />
              Age: {currentUser.age} <br />
              Gender: {currentUser.gender} <br />
              Date Created: {createdAt}
            </p>
          </div>
          <Button
            className='w-full rounded-none text-xs cursor-pointer border-none'
            onClick={() => setOpenModal(false)}
          >
            Close Details
          </Button>
        </Modal>
      </Wrapper>
    </div>
  );
}
export { UserCard };
