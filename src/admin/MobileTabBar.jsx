import { Inbox, Users, FileEdit, Settings } from 'lucide-react';

const NAV_ITEMS = [
  { key: 'requests', label: 'Requests', icon: Inbox },
  { key: 'visitors', label: 'Visitors', icon: Users },
  { key: 'content', label: 'Content', icon: FileEdit },
  { key: 'settings', label: 'Settings', icon: Settings },
];

/**
 * Phone-only replacement for the desktop `<Sidebar>` — a fixed bottom tab
 * bar instead of a side rail. The old approach squeezed the sidebar down to
 * a 56px icon-only strip on mobile, which still ate width from an already
 * narrow screen and left labels unreadable; a bottom bar is the standard,
 * thumb-reachable pattern for phone-sized nav instead.
 */
const MobileTabBar = ({ tab, onTabChange, newCount }) => (
  <nav
    className="admin-mobile-tabbar md:hidden fixed bottom-0 left-0 right-0 z-40 flex bg-[var(--surface)]/95 backdrop-blur-md border-t border-[var(--border)]"
    aria-label="Admin sections"
  >
    {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
      const active = tab === key;
      return (
        <button
          key={key}
          onClick={() => onTabChange(key)}
          className="tap-feedback relative flex-1 flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium transition-colors"
        >
          {active && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-[#00AEEF]" />}
          <span className="relative">
            <Icon size={19} className={active ? 'text-[#00AEEF]' : 'text-[var(--text-dim)]'} />
            {key === 'requests' && newCount > 0 && (
              <span className="absolute -top-1 -right-1.5 min-w-[15px] h-[15px] px-[3px] flex items-center justify-center rounded-full bg-[#00AEEF] text-black text-[9px] font-bold leading-none">
                {newCount > 9 ? '9+' : newCount}
              </span>
            )}
          </span>
          <span className={active ? 'text-[#00AEEF]' : 'text-[var(--text-dim)]'}>{label}</span>
        </button>
      );
    })}
  </nav>
);

export default MobileTabBar;
