import { useState } from 'react';
import { KeyRound } from 'lucide-react';

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
    'w-full bg-[var(--overlay)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#00AEEF] transition-colors';

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
            className="w-full bg-[#00AEEF] hover:bg-[#E8A23D] text-black font-semibold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50"
          >
            {status === 'submitting' ? 'Updating…' : 'Update password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SettingsPanel;
