// libs/shared/hooks/src/lib/useUpdateProfilePicture.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getDownloadURL, ref, uploadBytes, deleteObject } from 'firebase/storage';
import { storage } from '@/components/Firebase/firebase';
// import { update } from '@/api/user';
// import useAuth from './useAuth';
import { useRef, useState } from 'react';
import imageCompression from 'browser-image-compression';

export default function useUpdateProfilePicture(userId: string) {
  const imageRef = useRef<HTMLImageElement>(null);
  const queryClient = useQueryClient();
  const { user } = useAuth() as any;

  const [currentPicture, setCurrentPicture] = useState<string | null>(
    user?.profilePicture || user?.data?.profilePicture || null
  );

  // Standardize the ID lookup
  const targetId = userId || user?.id || user?._id || user?.data?._id;

  const uploadAndSync = async (file: File) => {
    if (!storage) throw new Error("Firebase Storage not initialized.");
    if (!targetId) throw new Error("No User ID available for update.");

    if (file.size > 10 * 1024 * 1024) throw new Error("File too large. Max 10MB.");

    try {
      const options = {
        maxSizeMB: 0.1,
        maxWidthOrHeight: 800,
        useWebWorker: true,
        fileType: 'image/webp'
      };
      const compressedFile = await imageCompression(file, options);

      const storagePath = `profilePictures/${targetId}.webp`;
      const storageRef = ref(storage, storagePath);

      await uploadBytes(storageRef, compressedFile);
      const downloadURL = await getDownloadURL(storageRef);

      const res = await update(targetId, { profilePicture: downloadURL });

      // update local state immediately so UI reflects change
      setCurrentPicture(downloadURL);

      return res;
    } catch (error: any) {
      if (error.code === 'storage/quota-exceeded') {
        throw new Error("Storage quota reached. Please try again later.");
      }
      throw error;
    }
  };

  const removeImage = async () => {
    if (!targetId) return;

    const storageRef = ref(storage, `profilePictures/${targetId}.webp`);
    await deleteObject(storageRef).catch(() => console.log("Storage already empty."));

    const defaultAvatar = `https://ui-avatars.com/api/?name=${user?.firstName || 'User'}&background=random`;
    const res = await update(targetId, { profilePicture: defaultAvatar });

    // update local state
    setCurrentPicture(defaultAvatar);

    return res;
  };

  const uploadMutation = useMutation({
    mutationFn: uploadAndSync,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (err: Error) => alert(err.message)
  });

  const deleteMutation = useMutation({
    mutationFn: removeImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => alert("Failed to remove image.")
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
    event.target.value = "";
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
    clearPicture,
  };
}
