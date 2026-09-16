interface LayoutState {
    sidebarOpen: boolean;
    toggleSidebar: () => void;
    openSidebar: () => void;
    closeSidebar: () => void;
    headerVisible: boolean;
    showHeader: () => void;
    hideHeader: () => void;
    mobileMenuOpen: boolean;
    toggleMobileMenu: () => void;
    openMobileMenu: () => void;
    closeMobileMenu: () => void;
}
export declare const useLayoutStore: import("zustand").UseBoundStore<import("zustand").StoreApi<LayoutState>>;
export type LayoutStoreState = ReturnType<typeof useLayoutStore.getState>;
export {};
//# sourceMappingURL=layout.store.d.ts.map