import React from 'react';
export interface SidebarItem {
    label: string;
    icon: React.ComponentType<{
        className?: string;
    }>;
    href: string;
    active?: boolean;
}
export declare function Sidebar(): React.JSX.Element;
export { Sidebar as UiSidebar };
//# sourceMappingURL=ui-sidebar.d.ts.map