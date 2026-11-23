import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNav from './TopNav';
import { TABS } from './adminTabs';
import OverviewPanel from './OverviewPanel';
import LeadsPanel from './LeadsPanel';
import LeadDrawer from './LeadDrawer';
import AnalyticsPanel from './AnalyticsPanel';
import SitePanel from './SitePanel';
import SystemPanel from './SystemPanel';
import SettingsPanel from './SettingsPanel';
import { PageHead } from './ui';
import { readJsonResponse } from '../utils/http';
import './admin.css';

const EMPTY_FILTERS = { q: '', status: '', dateFrom: '', dateTo: '', assignedTo: '' };
const REQUEST_PAGE_SIZE = 50;

const HEADINGS = {
  overview: { eyebrow: 'Dashboard', title: (a) => `Welcome back${a?.name ? `, ${a.name.split(' ')[0]}` : ''}` },
  leads: { eyebrow: 'Pipeline', title: () => 'Leads' },
  analytics: { eyebrow: 'Insights', title: () => 'Analytics' },
  site: { eyebrow: 'Website', title: () => 'Announcements & documents' },
  system: { eyebrow: 'Operations', title: () => 'System' },
  settings: { eyebrow: 'Account', title: () => 'Settings' },
};

const tabFromHash = () => {
  const key = typeof window !== 'undefined' ? window.location.hash.replace('#', '') : '';
  return TABS.some((t) => t.key === key) ? key : 'overview';
};

const AdminDashboard = ({ admin }) => {
  const navigate = useNavigate();
  const [tab, setTabState] = useState(tabFromHash);

  const [visitorData, setVisitorData] = useState(null);
  const [requestData, setRequestData] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [requestPage, setRequestPage] = useState(1);
  const [visitorPage, setVisitorPage] = useState(1);
  const [loadErrors, setLoadErrors] = useState({ visitors: '', requests: '', action: '' });
  const [loadingVisitors, setLoadingVisitors] = useState(true);
  const [loadingRequests, setLoadingRequests] = useState(true);

  // The lead drawer is shared by Overview, the board and the table.
  const [openLead, setOpenLead] = useState(null); // { id, initial? }
  const [patches, setPatches] = useState({});     // timestamped local edits, see leadMeta.mergePatch
  const refreshTimer = useRef(null);

  // The admin panel is dark-only, like the public site.
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // Run after the selected panel has committed. Scrolling before changing
  // tabs lets browser scroll anchoring preserve the old panel's offset and
  // place the new page heading underneath the fixed header.
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [tab]);

  const setTab = useCallback((next) => {
    setTabState(next);
    window.history.replaceState(null, '', next === 'overview' ? window.location.pathname : `#${next}`);
  }, []);

  useEffect(() => {
    const onHash = () => setTabState(tabFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const fetchVisitors = useCallback((targetPage = 1) => {
    fetch(`/api/admin/visitors?page=${targetPage}`, { credentials: 'same-origin' })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load visitor data');
        return readJsonResponse(res);
      })
      .then((data) => {
        setVisitorData(data);
        setLoadErrors((prev) => ({ ...prev, visitors: '' }));
        setLoadingVisitors(false);
      })
      .catch(() => {
        setLoadErrors((prev) => ({ ...prev, visitors: 'Could not load visitor data.' }));
        setLoadingVisitors(false);
      });
  }, []);

  const fetchRequests = useCallback((activeFilters, targetPage = 1) => {
    const params = new URLSearchParams();
    Object.entries(activeFilters || {}).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    params.set('page', targetPage);
    fetch(`/api/admin/requests?${params.toString()}`, { credentials: 'same-origin' })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load requests');
        return readJsonResponse(res);
      })
      .then((data) => {
        setRequestData({ ...data, __fetchedAt: Date.now() });
        setLoadErrors((prev) => ({ ...prev, requests: '' }));
        setLoadingRequests(false);
      })
      .catch(() => {
        setLoadErrors((prev) => ({ ...prev, requests: 'Could not load requests.' }));
        setLoadingRequests(false);
      });
  }, []);

  const fetchAdmins = useCallback(() => {
    fetch('/api/admin/team', { credentials: 'same-origin' })
      .then((res) => readJsonResponse(res))
      .then((data) => setAdmins(data.admins || []))
      .catch(() => {});
  }, []);

  // Used by manual refetches (event handlers, not effects) where re-showing
  // the loading state is desirable, e.g. after a bulk update.
  const loadRequests = useCallback(() => {
    setLoadingRequests(true);
    fetchRequests(filters, requestPage);
  }, [fetchRequests, filters, requestPage]);

  useEffect(() => {
    fetchVisitors(visitorPage);
    fetchAdmins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visitorPage, fetchAdmins]);

  // Re-fetches whenever filters OR the page change, debounced so typing in
  // the search box doesn't fire a request per keystroke. A filter change
  // always jumps back to page 1 — staying on, say, page 4 of a narrower
  // result set could silently show nothing.
  useEffect(() => {
    const handle = setTimeout(() => {
      setLoadingRequests(true);
      fetchRequests(filters, requestPage);
    }, 300);
    return () => clearTimeout(handle);
  }, [filters, requestPage, fetchRequests]);

  const handleFiltersChange = (next) => {
    setRequestPage(1);
    setFilters(next);
  };

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/admin/logout', { method: 'POST', credentials: 'same-origin' });
      if (!res.ok) throw new Error('Logout request failed');
      navigate('/admin/login', { replace: true });
    } catch {
      setLoadErrors((prev) => ({ ...prev, action: 'Could not sign out. Check your connection and try again.' }));
    }
  };

  const clearActionError = () => setLoadErrors((prev) => ({ ...prev, action: '' }));

  const updateStatus = async (id, status) => {
    clearActionError();
    setRequestData((prev) => ({
      ...prev,
      requests: prev.requests.map((r) => (r.id === id ? { ...r, status } : r)),
      newCount: status === 'new' ? prev.newCount : prev.requests.find((r) => r.id === id)?.status === 'new' ? Math.max(prev.newCount - 1, 0) : prev.newCount,
    }));
    const res = await fetch('/api/admin/requests', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ id, status }),
    }).catch(() => null);
    if (!res || !res.ok) {
      setLoadErrors((prev) => ({ ...prev, action: 'Could not update that request — try again.' }));
      loadRequests();
    }
  };

  const bulkUpdateStatus = async (ids, status) => {
    clearActionError();
    setRequestData((prev) => ({
      ...prev,
      requests: prev.requests.map((r) => (ids.includes(r.id) ? { ...r, status } : r)),
    }));
    const res = await fetch('/api/admin/requests', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ ids, status }),
    }).catch(() => null);
    if (!res || !res.ok) {
      setLoadErrors((prev) => ({ ...prev, action: 'Could not update those requests — try again.' }));
    }
    loadRequests();
  };

  const assignRequest = async (id, assignedTo) => {
    clearActionError();
    setRequestData((prev) => ({
      ...prev,
      requests: prev.requests.map((r) => (r.id === id ? { ...r, assigned_to: assignedTo } : r)),
    }));
    const res = await fetch('/api/admin/requests', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ id, assignedTo }),
    }).catch(() => null);
    if (!res || !res.ok) {
      setLoadErrors((prev) => ({ ...prev, action: 'Could not assign that request — try again.' }));
      loadRequests();
    }
  };

  const addNote = async (id, note) => {
    clearActionError();
    const res = await fetch('/api/admin/requests', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ id, note }),
    }).catch(() => null);
    if (res && res.ok) {
      try {
        const data = await readJsonResponse(res);
        setRequestData((prev) => ({
          ...prev,
          requests: prev.requests.map((r) => (r.id === id ? { ...r, notes: data.notes } : r)),
        }));
      } catch {
        setLoadErrors((prev) => ({ ...prev, action: 'Could not save that note — try again.' }));
        loadRequests();
      }
    } else {
      setLoadErrors((prev) => ({ ...prev, action: 'Could not save that note — try again.' }));
    }
  };

  // Changes made in the drawer: show them everywhere immediately, then
  // quietly refresh the list so counts (and the new-lead badge) catch up.
  const handleLeadChanged = useCallback((patch) => {
    setPatches((prev) => ({ ...prev, [patch.id]: { ...prev[patch.id], ...patch, __ts: Date.now() } }));
    window.clearTimeout(refreshTimer.current);
    refreshTimer.current = window.setTimeout(() => fetchRequests(filters, requestPage), 800);
  }, [fetchRequests, filters, requestPage]);

  useEffect(() => () => window.clearTimeout(refreshTimer.current), []);

  const closeLead = useCallback(() => setOpenLead(null), []);
  const heading = HEADINGS[tab] || HEADINGS.overview;

  return (
    <div className="o2 ad">
      <TopNav tab={tab} onTabChange={setTab} newCount={requestData?.newCount || 0} admin={admin} onLogout={handleLogout} />

      <main className="ad-main">
        <PageHead eyebrow={heading.eyebrow} title={heading.title(admin)} />
        {Object.values(loadErrors).filter(Boolean).map((message) => (
          <p key={message} role="alert" className="text-sm text-rose-300 mb-4">{message}</p>
        ))}

        {tab === 'overview' && <OverviewPanel onOpenLead={setOpenLead} onGoTab={setTab} />}

        {tab === 'leads' && (
          <LeadsPanel
            requestData={requestData}
            loadingRequests={loadingRequests}
            admins={admins}
            filters={filters}
            onFiltersChange={handleFiltersChange}
            requestPage={requestPage}
            onPageChange={setRequestPage}
            requestPageSize={REQUEST_PAGE_SIZE}
            onUpdateStatus={updateStatus}
            onBulkUpdateStatus={bulkUpdateStatus}
            onAssign={assignRequest}
            onAddNote={addNote}
            onOpenLead={setOpenLead}
            onLeadsChanged={() => fetchRequests(filters, requestPage)}
            patches={patches}
          />
        )}

        {tab === 'analytics' && (
          <AnalyticsPanel
            visitorData={visitorData}
            loadingVisitors={loadingVisitors}
            visitorPage={visitorPage}
            onVisitorPageChange={setVisitorPage}
          />
        )}

        {tab === 'site' && <SitePanel />}
        {tab === 'system' && <SystemPanel />}
        {tab === 'settings' && <SettingsPanel admin={admin} />}
      </main>

      {openLead && (
        <LeadDrawer
          key={openLead.id}
          leadId={openLead.id}
          initial={openLead}
          admins={admins}
          admin={admin}
          onClose={closeLead}
          onChanged={handleLeadChanged}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
