type CleanupCallback = () => void | Promise<void>;
declare const lifecycle: {
    register: (callback: CleanupCallback) => void;
    shutdown: () => Promise<void>;
};
export { lifecycle };
//# sourceMappingURL=lifecycle.d.ts.map