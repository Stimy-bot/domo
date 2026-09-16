declare function useUpdateProfilePicture(userId: string): {
    handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    deletePicture: import("@tanstack/react-query").UseMutateFunction<import("@domo/types").User | undefined, Error, void, unknown>;
    isUpdating: boolean;
    imageRef: import("react").RefObject<HTMLImageElement | null>;
    currentPicture: string | null;
    setCurrentPicture: import("react").Dispatch<import("react").SetStateAction<string | null>>;
    clearPicture: () => void;
};
export { useUpdateProfilePicture };
//# sourceMappingURL=useUpdateProfilePicture.d.ts.map