// client/src/components/Layouts/Forms/shared/ImageInput.tsx
import {useUpdateProfilePicture} from "@domo/hooks";
import { useRef, useState, useEffect } from "react";
import { useAuthStore } from "@domo/state";
import type { FieldApi } from "@tanstack/react-form";
import Input from "./input";
import { Button } from "./button";

interface ProfileUser {
  userId: string;
  profilePicture: string;
  isLoading: boolean;
}

interface ImageInputProps {
  // Use unknown for the generics to avoid the 'any' error
  field: FieldApi<any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any>;
  label: string;
}

function ImageInput({ field, label }: ImageInputProps) {
  // const { user } = useAuth() as unknown as { user: ProfileUser };

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [preview, setPreview] = useState<string | null>(field?.state?.value || null);

  const { currentPicture, handleFileChange, clearPicture } = useUpdateProfilePicture(user?.userId || "");

  useEffect(() => {
    if (currentPicture) {
      setPreview(currentPicture as string);
    }
  }, [currentPicture]);

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  if (!field || !field.state) {
    console.error("ImageInput component received invalid 'field' prop.", field);
    return null;
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleClearClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    clearPicture();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    field.setValue(null as any);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <label className="block text-sm font-semibold text-dark-hard dark:text-dark-light text-center mb-2">
        {label}
      </label>
      <div className="flex flex-col items-center">
        <Input
          id={field.name}
          name={field.name}
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onBlur={field.handleBlur}
          onChange={(e) => {
            handleFileChange(e);
            // Sync with form state
            const file = e.target.files?.[0];
            if (file) field.setValue(file as any);
          }}
          className="hidden"
        />

        {preview || currentPicture ? (
          <div className="relative">
            <img
              src={(preview || currentPicture) as string}
              alt="Profile Preview"
              className='m-auto size-24 rounded-full cursor-pointer object-cover border-2 border-blue-500'
              onClick={handleButtonClick}
            />
            <Button
              type="button"
              onClick={handleClearClick}
              className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
              aria-label="Clear image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Button>
          </div>
        ) : (
          <div
            onClick={handleButtonClick}
            className="size-24 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 dark:border-zinc-700 hover:border-blue-500 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </div>
        )}
      </div>

      {field.state.meta.errors.length > 0 && (
        <em className="block text-red-500 text-xs text-center italic mt-2">
          {field.state.meta.errors.join(", ")}
        </em>
      )}
    </div>
  );
};

export default ImageInput;