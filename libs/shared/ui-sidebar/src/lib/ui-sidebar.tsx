import { Slot } from '@radix-ui/react-slot';
import { BarChart2, ChevronLeft, Home, Menu, Settings, Users } from 'lucide-react';
import React, { useState } from 'react';
import cn from './cn';

export interface SidebarItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  active?: boolean;
}

const defaultNavigation: SidebarItem[] = [
  { label: 'Dashboard', icon: Home, href: '#', active: true },
  { label: 'Analytics', icon: BarChart2, href: '#' },
  { label: 'Team', icon: Users, href: '#' },
  { label: 'Settings', icon: Settings, href: '#' },
];

/* Custom Link Component supporting Radix Slot composition */
interface SidebarLinkProps extends React.ComponentPropsWithoutRef<'a'> {
  asChild?: boolean;
  active?: boolean;
}

const SidebarLink = React.forwardRef<HTMLAnchorElement, SidebarLinkProps>(
  ({ className, asChild = false, active, ...props }, ref) => {
    const Comp = asChild ? Slot : 'a';
    return (
      <Comp
        ref={ref}
        className={cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group',
          active
            ? 'bg-dark-hard text-dark-light'
            : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100',
          className,
        )}
        {...props}
      />
    );
  },
);
SidebarLink.displayName = 'SidebarLink';

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'flex flex-col h-screen pt-20 bg-dark-hard text-slate-100 border-r border-slate-800 transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-16' : 'w-64',
      )}
    >
      {/* Header Area */}
      <div className='flex items-center justify-between h-16 px-4 border-b border-slate-800'>
        {!isCollapsed && (
          <span className='font-bold text-lg tracking-wide text-indigo-400'>Workspace</span>
        )}
        <button
          type='button'
          onClick={() => setIsCollapsed(!isCollapsed)}
          className='p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition-colors'
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <Menu size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className='flex-1 py-4 space-y-1 px-2'>
        {defaultNavigation.map((item) => {
          const Icon = item.icon;
          return (
            <SidebarLink key={item.label} href={item.href} active={item.active}>
              <Icon
                className={cn(
                  'h-5 w-5 shrink-0',
                  item.active ? 'text-white' : 'text-slate-400 group-hover:text-slate-100',
                )}
              />

              <span
                className={cn(
                  'transition-opacity duration-200 whitespace-nowrap',
                  isCollapsed ? 'opacity-0 pointer-events-none w-0' : 'opacity-100',
                )}
              >
                {item.label}
              </span>
            </SidebarLink>
          );
        })}
      </nav>

      {/* Footer Area */}
      <div className='p-4 border-t border-slate-800 flex items-center gap-3 overflow-hidden pb-30'>
        <div className='h-8 w-8 rounded-full bg-dark-hard shrink-0 flex items-center justify-center font-semibold text-dark-light'>
          D
        </div>
        {!isCollapsed && (
          <div className='flex flex-col min-w-0'>
            <span className='text-sm font-medium text-dark-light truncate'>Dominic</span>
            <span className='text-xs text-dark-light truncate'>domo@workspace.internal</span>
          </div>
        )}
      </div>
    </aside>
  );
}

export { Sidebar as UiSidebar };
