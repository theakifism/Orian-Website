import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, Bell, LogOut } from 'lucide-react';
import Sidebar from './Sidebar';
import MobileTabBar from './MobileTabBar';
import MetricCard from './MetricCard';
import RequestsTable from './RequestsTable';
import VisitorsPanel from './VisitorsPanel';
import ContentPanel from './ContentPanel';
import SettingsPanel from './SettingsPanel';
import AIInsights from './AIInsights';
import useTheme from '../hooks/useTheme';

const EMPTY_FILTERS = { q: '', status: '', dateFrom: '', dateTo: '', assignedTo: '' };

const AdminDashboard = ({ admin }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [tab, setTab] = useState('requests');
  const [collapsed, setCollapsed] = useState(false);

  const [visitorData, setVisitorData] = useState(null);
  const [requestData, setRequestData] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [loadError, setLoadError] = useState('');
  const [loadingVisitors, setLoadingVisitors] = useState(true);
  const [loadingRequests, setLoadingRequests] = useState(true);

  const fetchVisitors = useCallback(() => {
    fetch('/api/admin/visitors', { credentials: 'same-origin' })
      .then((res) => res.json())
      .then((data) => {
        setVisitorData(data);
        setLoadingVisitors(false);
      })
      .catch(() => {
        setLoadError('Could not load visitor data.');
        setLoadingVisitors(false);
      });
  }, []);

  const fetchRequests = useCallback((activeFilters) => {
    const params = new URLSearchParams();
    Object.entries(activeFilters || {}).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    const qs = params.toString();
    fetch(`/api/admin/requests${qs ? `?${qs}` : ''}`, { credentials: 'same-origin' })
      .then((res) => res.json())
      .then((data) => {
        setRequestData(data);
        setLoadingRequests(false);
      })
      .catch(() => {
        setLoadError('Could not load requests.');
        setLoadingRequests(false);
      });
  }, []);

  const fetchAdmins = useCallback(() => {
    fetch('/api/admin/team', { credentials: 'same-origin' })
      .then((res) => res.json())
      .then((data) => setAdmins(data.admins || []))
      .catch(() => {});
  }, []);

  // Used by manual refetches (event handlers, not effects) where re-showing
  // the loading state is desirable, e.g. after a bulk update.
  const loadRequests = useCallback(() => {
    setLoadingRequests(true);
    fetchRequests(filters);
  }, [fetchRequests, filters]);

  useEffect(() => {
    fetchVisitors();
    fetchAdmins();
  }, [fetchVisitors, fetchAdmins]);

  // Re-fetches whenever filters change, debounced so typing in the search
  // box doesn't fire a request per keystroke.
  useEffect(() => {
    const handle = setTimeout(() => {
      setLoadingRequests(true);
      fetchRequests(filters);
    }, 300);
    return () => clearTimeout(handle);
  }, [filters, fetchRequests]);

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST', credentials: 'same-origin' });
    navigate('/admin/login', { replace: true });
  };

  const updateStatus = async (id, status) => {
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
      setLoadError('Could not update that request — try again.');
      loadRequests();
    }
  };

  const bulkUpdateStatus = async (ids, status) => {
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
      setLoadError('Could not update those requests — try again.');
    }
    loadRequests();
  };

  const assignRequest = async (id, assignedTo) => {
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
      setLoadError('Could not assign that request — try again.');
      loadRequests();
    }
  };

  const addNote = async (id, note) => {
    const res = await fetch('/api/admin/requests', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ id, note }),
    }).catch(() => null);
    if (res && res.ok) {
      const data = await res.json();
      setRequestData((prev) => ({
        ...prev,
        requests: prev.requests.map((r) => (r.id === id ? { ...r, notes: data.notes } : r)),
      }));
    } else {
      setLoadError('Could not save that note — try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex">
      <Sidebar
        tab={tab}
        onTabChange={setTab}
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed((c) => !c)}
        newCount={requestData?.newCount || 0}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="border-b border-[var(--border)] px-4 sm:px-6 py-4 flex items-center justify-between gap-3 flex-wrap">
          <div className="min-w-0">
            <h1 className="text-lg font-bold capitalize">{tab}</h1>
            <p className="text-xs text-[var(--text-dim)] truncate">
              Signed in as {admin?.name} ({admin?.email})
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Bell size={18} className="text-[var(--text-dim)]" />
              {requestData?.newCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#00AEEF] text-black text-[9px] font-bold rounded-full min-w-[15px] h-[15px] flex items-center justify-center px-0.5">
                  {requestData.newCount}
                </span>
              )}
            </div>
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="text-[var(--text-dim)] hover:text-[#00AEEF] transition-colors"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-[var(--text-dim)] hover:text-[#00AEEF] transition-colors"
            >
              <LogOut size={15} /> Log out
            </button>
          </div>
        </header>

        <div className="flex-1 px-4 sm:px-6 py-6 sm:py-8 pb-24 md:pb-8 overflow-y-auto overflow-x-hidden">
          {loadError && <p className="text-sm text-red-400 mb-4">{loadError}</p>}

          {tab === 'requests' && (
            <>
              <AIInsights />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <MetricCard
                  label="Total requests"
                  value={requestData?.total ?? 0}
                  daily={requestData?.dailyRequests}
                  loading={loadingRequests}
                />
                <MetricCard
                  label="New requests"
                  value={requestData?.newCount ?? 0}
                  loading={loadingRequests}
                />
                <MetricCard
                  label="Last 14 days"
                  value={requestData?.dailyRequests?.reduce((s, d) => s + d.count, 0) ?? 0}
                  daily={requestData?.dailyRequests}
                  loading={loadingRequests}
                />
              </div>

              <RequestsTable
                requests={requestData?.requests}
                loading={loadingRequests}
                onUpdateStatus={updateStatus}
                onBulkUpdateStatus={bulkUpdateStatus}
                admins={admins}
                onAssign={assignRequest}
                onAddNote={addNote}
                filters={filters}
                onFiltersChange={setFilters}
              />
            </>
          )}

          {tab === 'visitors' && <VisitorsPanel visitorData={visitorData} loading={loadingVisitors} />}

          {tab === 'content' && <ContentPanel />}

          {tab === 'settings' && <SettingsPanel admin={admin} />}
        </div>
      </div>

      <MobileTabBar tab={tab} onTabChange={setTab} newCount={requestData?.newCount || 0} />
    </div>
  );
};

export default AdminDashboard;
