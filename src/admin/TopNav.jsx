import { Bell, ExternalLink, LogOut } from 'lucide-react';
import { TABS } from './adminTabs';

/**
 * Top navigation (desktop) + bottom tab bar (phones). Same structure as the
 * public site's header: logo on the left, pill links in the middle, actions on
 * the right.
 */
const TopNav = ({ tab, onTabChange, newCount, admin, onLogout }) => (
  <>
    <header className="ad-top">
      <div className="ad-top-in">
        <a href="/admin" className="ad-brand" aria-label="Orian admin home" onClick={(e) => { e.preventDefault(); onTabChange('overview'); }}>
          <img src="/logo-icon.webp" alt="" width="56" height="42" />
          <span className="ad-brand-tag">Admin</span>
        </a>

        <nav className="ad-tabs" aria-label="Admin sections">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button key={key} type="button" className="ad-tab" aria-current={tab === key ? 'page' : undefined} onClick={() => onTabChange(key)}>
              <Icon aria-hidden="true" /> {label}
              {key === 'leads' && newCount > 0 && <span className="ad-badge" aria-label={`${newCount} new`}>{newCount}</span>}
            </button>
          ))}
        </nav>

        <div className="ad-tools">
          <div className="ad-user">
            <b>{admin?.name}</b>
            <span>{admin?.role === 'superadmin' ? 'Superadmin' : 'Team member'}</span>
          </div>
          <button type="button" className="ad-tab" onClick={() => onTabChange('leads')} aria-label={newCount > 0 ? `${newCount} new leads` : 'No new leads'} style={{ padding: '0 0.65rem' }}>
            <span style={{ position: 'relative', display: 'inline-grid' }}>
              <Bell aria-hidden="true" />
              {newCount > 0 && <span className="ad-badge" style={{ position: 'absolute', top: '-0.55rem', right: '-0.6rem' }}>{newCount}</span>}
            </span>
          </button>
          <a className="o2-btn o2-btn-ghost" href="/" target="_blank" rel="noreferrer">
            View site <ExternalLink aria-hidden="true" />
          </a>
          <button type="button" className="o2-btn o2-btn-ghost" onClick={onLogout}>
            <LogOut aria-hidden="true" /> <span className="hidden sm:inline">Log out</span>
          </button>
        </div>
      </div>
    </header>

    <nav className="ad-bottom" aria-label="Admin sections">
      {TABS.map(({ key, label, icon: Icon }) => (
        <button key={key} type="button" aria-current={tab === key ? 'page' : undefined} onClick={() => onTabChange(key)}>
          <Icon aria-hidden="true" />
          {label}
          {key === 'leads' && newCount > 0 && <span className="ad-badge">{newCount > 9 ? '9+' : newCount}</span>}
        </button>
      ))}
    </nav>
  </>
);

export default TopNav;
