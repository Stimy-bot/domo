// libs/shared/hooks/src/lib/useUpdateProfilePicture.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getDownloadURL, ref, uploadBytes, deleteObject } from 'firebase/storage';
import { storage } from '@domo/firebase';
import { update } from '@domo/client';
import { useAuth } from './useAuth';
import { useRef, useState } from 'react';
import imageCompression from 'browser-image-compression';

type MinimalUser = {
  id?: string;
  _id?: string;
  firstName?: string;
  profilePicture?: string;
  data?: { _id?: string; profilePicture?: string };
};

function useUpdateProfilePicture(userId: string) {
  const imageRef = useRef<HTMLImageElement>(null);
  const queryClient = useQueryClient();
  const auth = useAuth() as { user?: MinimalUser } | undefined;
  const user = auth?.user;

  const [currentPicture, setCurrentPicture] = useState<string | null>(
    user?.profilePicture || user?.data?.profilePicture || null
  );

  // Standardize the ID lookup
  const targetId = userId || user?.id || user?._id || user?.data?._id;

  const uploadAndSync = async (file: File) => {
    if (!targetId) throw new Error('No User ID available for update.');
    if (!storage) throw new Error('Firebase Storage not initialized.');

    if (file.size > 10 * 1024 * 1024) throw new Error('File too large. Max 10MB.');

    try {
      const options = {
        maxSizeMB: 0.1,
        maxWidthOrHeight: 800,
        useWebWorker: true,
        fileType: 'image/webp'
      };
      const compressedFile = await imageCompression(file, options);

      const storagePath = `profilePictures/${targetId}.webp`;

      // narrow storage to a local const so TS understands it's non-null
      const s = storage;
      if (!s) throw new Error('Firebase Storage not initialized.');
      const storageRef = ref(s, storagePath);

      await uploadBytes(storageRef, compressedFile);
      const downloadURL = await getDownloadURL(storageRef);

      // update expects a string id (keep original signature)
      const res = await update(targetId, { profilePicture: downloadURL });

      // update local state immediately so UI reflects change
      setCurrentPicture(downloadURL);

      return res;
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };
      if (err.code === 'storage/quota-exceeded') {
        throw new Error('Storage quota reached. Please try again later.');
      }
      throw error;
    }
  };

  const removeImage = async () => {
    if (!targetId) return;

    const s = storage;
    if (s) {
      const storageRef = ref(s, `profilePictures/${targetId}.webp`);
      await deleteObject(storageRef).catch(() => console.log('Storage already empty.'));
    } else {
      console.log('Firebase storage not initialized; skipping delete.');
    }

    const defaultAvatar = `https://ui-avatars.com/api/?name=${user?.firstName || 'User'}&background=random`;
    const res = await update(targetId, { profilePicture: defaultAvatar });

    // update local state
    setCurrentPicture(defaultAvatar);

    return res;
  };

  const uploadMutation = useMutation({
    mutationFn: uploadAndSync,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (err: Error) => alert(err.message)
  });

  const deleteMutation = useMutation({
    mutationFn: removeImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: () => alert('Failed to remove image.')
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && !uploadMutation.isPending) {
      // optimistically set preview URL in hook state so consumers can read it
      const objectUrl = URL.createObjectURL(file);
      setCurrentPicture(objectUrl);
      uploadMutation.mutate(file, {
        onSettled: () => {
          // revoke object URL after upload settles to avoid memory leak
          URL.revokeObjectURL(objectUrl);
        }
      });
    }
    // clear the input value so the same file can be selected again
    try {
      event.target.value = '';
    } catch {
      // ignore if browser prevents setting value
    }
  };

  const clearPicture = () => {
    // clear local state only; if you want to delete from server call deleteMutation.mutate()
    setCurrentPicture(null);
  };

  return {
    handleFileChange,
    deletePicture: deleteMutation.mutate,
    isUpdating: uploadMutation.isPending || deleteMutation.isPending,
    imageRef,
    currentPicture,
    setCurrentPicture,
    clearPicture
  };
}

export { useUpdateProfilePicture };