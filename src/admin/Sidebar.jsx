import { Inbox, Users, FileEdit, Settings, ChevronsLeft, ChevronsRight } from 'lucide-react';

const NAV_ITEMS = [
  { key: 'requests', label: 'Requests', icon: Inbox },
  { key: 'visitors', label: 'Visitors', icon: Users },
  { key: 'content', label: 'Content', icon: FileEdit },
  { key: 'settings', label: 'Settings', icon: Settings },
];

const Sidebar = ({ tab, onTabChange, collapsed, onToggleCollapsed, newCount }) => (
  <aside
    className={`admin-sidebar hidden md:flex bg-[var(--surface)] border-r border-[var(--border)] flex-col transition-all duration-200 ${
      collapsed ? 'w-16' : 'w-56'
    }`}
  >
    <div className="flex items-center justify-between px-4 py-4 border-b border-[var(--border)]">
      <div className="flex items-center gap-2 min-w-0">
        <img src="/logo-icon.png" alt="Orian" className="w-7 h-7 rounded-md object-contain shrink-0" />
        {!collapsed && <span className="font-bold text-sm truncate">Orian admin</span>}
      </div>
      <button
        onClick={onToggleCollapsed}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className="text-[var(--text-dim)] hover:text-[#00AEEF] transition-colors shrink-0"
      >
        {collapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
      </button>
    </div>

    <nav className="flex-1 py-3">
      {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
        const active = tab === key;
        return (
          <button
            key={key}
            onClick={() => onTabChange(key)}
            title={collapsed ? label : undefined}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors relative ${
              active
                ? 'text-[#00AEEF] bg-[var(--overlay)]'
                : 'text-[var(--text-dim)] hover:text-[var(--text)] hover:bg-[var(--overlay)]'
            }`}
          >
            {active && <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#00AEEF]" />}
            <Icon size={17} />
            {!collapsed && <span>{label}</span>}
            {!collapsed && key === 'requests' && newCount > 0 && (
              <span className="ml-auto bg-[#00AEEF] text-black text-[10px] font-bold rounded-full px-1.5 py-0.5">
                {newCount}
              </span>
            )}
            {collapsed && key === 'requests' && newCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#00AEEF]" />
            )}
          </button>
        );
      })}
    </nav>
  </aside>
);

export default Sidebar;
