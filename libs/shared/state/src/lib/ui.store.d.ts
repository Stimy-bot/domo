export type ThemeMode = 'light' | 'dark' | 'auto';
interface UIState {
    themeMode: ThemeMode;
    setThemeMode: (mode: ThemeMode) => void;
}
export declare const useUIStore: import("zustand").UseBoundStore<import("zustand").StoreApi<UIState>>;
export type UIStoreState = ReturnType<typeof useUIStore.getState>;
export {};
//# sourceMappingURL=ui.store.d.ts.map