import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getDownloadURL,
  ref,
  uploadBytes,
  deleteObject,
} from 'firebase/storage';
import { storage } from '@domo/firebase';
import { useRef, useState } from 'react';
import imageCompression from 'browser-image-compression';
import { useAuthStore } from '@domo/state';
import { updateAccount as update } from '@domo/services';

export default function useUpdateProfilePicture(userId?: string) {
  const imageRef = useRef<HTMLImageElement>(null);
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);

  const [currentPicture, setCurrentPicture] = useState<string | null>(
    user?.profilePicture || user?.data?.profilePicture || null,
  );

  const targetId = userId || user?.id || user?._id || user?.data?._id;

  const uploadAndSync = async (file: File) => {
    if (!storage) throw new Error('Firebase Storage not initialized.');
    if (!targetId) throw new Error('No User ID available for update.');

    if (file.size > 10 * 1024 * 1024)
      throw new Error('File too large. Max 10MB.');

    try {
      const options = {
        maxSizeMB: 0.1,
        maxWidthOrHeight: 800,
        useWebWorker: true,
        fileType: 'image/webp',
      };
      const compressedFile = await imageCompression(file, options);

      const storagePath = `profilePictures/${targetId}.webp`;
      const storageRef = ref(storage, storagePath);

      await uploadBytes(storageRef, compressedFile);
      const downloadURL = await getDownloadURL(storageRef);

      const res = await update(targetId, { profilePicture: downloadURL });

      setCurrentPicture(downloadURL);

      useAuthStore.getState().setUser({
        ...(useAuthStore.getState().user ?? {}),
        profilePicture: downloadURL,
      });

      queryClient.invalidateQueries({ queryKey: ['auth'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });

      return res;
    } catch (error: unknown) {
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        (error as any).code === 'storage/quota-exceeded'
      ) {
        throw new Error('Storage quota reached. Please try again later.');
      }
      if (error instanceof Error) throw error;
      throw new Error(String(error));
    }
  };

  const removeImage = async () => {
    if (!targetId) return;

    const storageRef = ref(storage, `profilePictures/${targetId}.webp`);
    await deleteObject(storageRef).catch(() =>
      console.log('Storage already empty.'),
    );

    const defaultAvatar = `https://ui-avatars.com/api/?name=${user?.fullName || 'User'}&background=random`;
    const res = await update(targetId, { profilePicture: defaultAvatar });

    setCurrentPicture(defaultAvatar);

    useAuthStore.getState().setUser({
      ...(useAuthStore.getState().user ?? {}),
      profilePicture: defaultAvatar,
    });

    queryClient.invalidateQueries({ queryKey: ['auth'] });
    queryClient.invalidateQueries({ queryKey: ['users'] });

    return res;
  };

  const uploadMutation = useMutation({
    mutationFn: uploadAndSync,
    onError: (err: Error) => alert(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: removeImage,
    onError: () => alert('Failed to remove image.'),
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && !uploadMutation.isPending) {
      const objectUrl = URL.createObjectURL(file);
      setCurrentPicture(objectUrl);
      uploadMutation.mutate(file, {
        onSettled: () => URL.revokeObjectURL(objectUrl),
      });
    }
    event.currentTarget.value = '';
  };

  const clearPicture = () => setCurrentPicture(null);

  return {
    handleFileChange,
    deletePicture: deleteMutation.mutate,
    isUpdating: uploadMutation.isPending || deleteMutation.isPending,
    imageRef,
    currentPicture,
    setCurrentPicture,
    clearPicture,
  };
}
