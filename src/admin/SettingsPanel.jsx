import { useEffect, useState } from 'react';
import { KeyRound, Users, Lock, ShieldCheck } from 'lucide-react';

const formatDate = (iso) => (iso ? new Date(iso).toLocaleString() : 'Never');

// Team roster with role/lock status and, for a superadmin, controls to
// unlock a locked-out teammate or change someone's role. Any signed-in
// admin can see the roster; only a superadmin sees the action buttons —
// team-manage.js enforces that same restriction server-side too.
const TeamSection = ({ admin }) => {
  const [team, setTeam] = useState(null);
  const [isSuperadmin, setIsSuperadmin] = useState(false);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);

  const load = () => {
    fetch('/api/admin/team-manage', { credentials: 'same-origin' })
      .then((res) => {
        if (!res.ok) throw new Error('load failed');
        return res.json();
      })
      .then((data) => {
        setTeam(data.admins || []);
        setIsSuperadmin(!!data.isSuperadmin);
      })
      .catch(() => setError('Could not load the team list.'));
  };

  useEffect(load, []);

  const isLocked = (a) => a.locked_until && new Date(a.locked_until) > new Date();

  const unlock = async (id) => {
    setBusyId(id);
    const res = await fetch('/api/admin/team-manage', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ id, action: 'unlock' }),
    }).catch(() => null);
    setBusyId(null);
    if (res && res.ok) load();
    else setError('Could not unlock that account.');
  };

  const changeRole = async (id, role) => {
    if (!window.confirm(`Change this teammate's role to "${role}"?`)) return;
    setBusyId(id);
    const res = await fetch('/api/admin/team-manage', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ id, role }),
    }).catch(() => null);
    setBusyId(null);
    if (res && res.ok) {
      load();
    } else {
      const data = await res?.json().catch(() => null);
      setError(data?.error || 'Could not update that role.');
    }
  };

  if (error) return <p className="text-sm text-red-400">{error}</p>;
  if (!team) return <p className="text-sm text-[var(--text-dim)]">Loading team…</p>;

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 mt-6">
      <div className="flex items-center gap-2 mb-1">
        <Users size={16} className="text-[#00AEEF]" />
        <h3 className="text-sm font-semibold">Team</h3>
      </div>
      <p className="text-xs text-[var(--text-dim)] mb-5">
        {isSuperadmin
          ? 'As a superadmin, you can unlock accounts and change roles.'
          : 'Only a superadmin can unlock accounts or change roles.'}
      </p>

      <div className="space-y-3">
        {team.map((a) => (
          <div key={a.id} className="border border-[var(--border)] rounded-xl p-3.5">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="min-w-0">
                <p className="text-sm font-semibold flex items-center gap-1.5">
                  {a.name}
                  {a.role === 'superadmin' && (
                    <span title="Superadmin"><ShieldCheck size={13} className="text-[#00AEEF]" /></span>
                  )}
                  {a.id === admin?.id && <span className="text-[10px] text-[var(--text-faint)] font-normal">(you)</span>}
                </p>
                <p className="text-xs text-[var(--text-dim)]">{a.email}</p>
                <p className="text-[11px] text-[var(--text-faint)] mt-1">
                  Last login: {formatDate(a.last_login_at)}
                  {a.last_login_ip ? ` · ${a.last_login_ip}` : ''}
                  {a.last_login_device ? ` · ${a.last_login_device}` : ''}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {isLocked(a) && (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-red-400 bg-red-500/10 px-2 py-1 rounded-lg">
                    <Lock size={11} /> Locked
                  </span>
                )}
                {isSuperadmin && isLocked(a) && (
                  <button
                    onClick={() => unlock(a.id)}
                    disabled={busyId === a.id}
                    className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-[var(--overlay)] hover:bg-[var(--border)] transition-colors disabled:opacity-50"
                  >
                    Unlock
                  </button>
                )}
                {isSuperadmin && a.id !== admin?.id && (
                  <select
                    value={a.role}
                    onChange={(e) => changeRole(a.id, e.target.value)}
                    disabled={busyId === a.id}
                    className="bg-[var(--overlay)] border border-[var(--border)] rounded-lg px-2 py-1.5 text-xs"
                  >
                    <option value="employee">Employee</option>
                    <option value="superadmin">Superadmin</option>
                  </select>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SettingsPanel = ({ admin }) => {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.newPassword !== form.confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
    if (form.newPassword.length < 10) {
      setError('New password must be at least 10 characters.');
      return;
    }

    setStatus('submitting');
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ currentPassword: form.currentPassword, newPassword: form.newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not change your password.');
      setStatus('success');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  };

  const inputClasses =
    'w-full bg-[var(--overlay)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#00AEEF] focus:ring-2 focus:ring-[#00AEEF]/40 transition-colors';

  return (
    <div className="max-w-md">
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
        <div className="flex items-center gap-2 mb-1">
          <KeyRound size={16} className="text-[#00AEEF]" />
          <h3 className="text-sm font-semibold">Change password</h3>
        </div>
        <p className="text-xs text-[var(--text-dim)] mb-5">
          Signed in as {admin?.name} ({admin?.email})
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-faint)] block mb-1.5">
              Current password
            </label>
            <input
              type="password"
              name="currentPassword"
              value={form.currentPassword}
              onChange={handleChange}
              required
              className={inputClasses}
            />
          </div>
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-faint)] block mb-1.5">
              New password
            </label>
            <input
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              minLength={10}
              required
              className={inputClasses}
            />
          </div>
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-faint)] block mb-1.5">
              Confirm new password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              minLength={10}
              required
              className={inputClasses}
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}
          {status === 'success' && <p className="text-sm text-emerald-500">Password updated successfully.</p>}

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full bg-[#00AEEF] hover:bg-[#34D399] text-black font-semibold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50"
          >
            {status === 'submitting' ? 'Updating…' : 'Update password'}
          </button>
        </form>
      </div>

      <TeamSection admin={admin} />
    </div>
  );
};

export default SettingsPanel;
