import { useEffect, useState } from 'react';
import { Megaphone, FileText, Pencil, Trash2, Upload } from 'lucide-react';

const inputClasses =
  'w-full bg-[var(--overlay)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#00AEEF] transition-colors';

const formatDate = (iso) => (iso ? new Date(iso).toLocaleString() : '—');
const formatSize = (bytes) => {
  if (!bytes) return '';
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;
};

// --- Announcements -----------------------------------------------------
const AnnouncementsSection = () => {
  const [announcements, setAnnouncements] = useState(null);
  const [form, setForm] = useState({ message: '', emoji: '🎉' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    fetch('/api/admin/announcements', { credentials: 'same-origin' })
      .then((res) => res.json())
      .then((data) => setAnnouncements(data.announcements || []))
      .catch(() => setError('Could not load announcements.'));
  };

  useEffect(load, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.message.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not create announcement.');
      setForm({ message: '', emoji: '🎉' });
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleActive = async (id, active) => {
    setAnnouncements((prev) => prev.map((a) => (a.id === id ? { ...a, active } : a)));
    await fetch('/api/admin/announcements', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ id, active }),
    }).catch(() => setError('Could not update announcement.'));
  };

  const remove = async (id) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    await fetch('/api/admin/announcements', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ id }),
    }).catch(() => setError('Could not delete announcement.'));
  };

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 mb-6">
      <div className="flex items-center gap-2 mb-1">
        <Megaphone size={16} className="text-[#00AEEF]" />
        <h3 className="text-sm font-semibold">Announcement banner</h3>
      </div>
      <p className="text-xs text-[var(--text-dim)] mb-5">
        Shown as a dismissible popup on the site. Creating a new one automatically replaces the current one.
      </p>

      <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="🎉"
          maxLength={8}
          value={form.emoji}
          onChange={(e) => setForm((f) => ({ ...f, emoji: e.target.value }))}
          className={`${inputClasses} sm:w-20 text-center`}
        />
        <input
          type="text"
          placeholder="Happy Diwali! Our office will be closed on Nov 1st."
          maxLength={200}
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          required
          className={`${inputClasses} flex-1`}
        />
        <button
          type="submit"
          disabled={submitting}
          className="bg-[#00AEEF] hover:bg-[#E8A23D] text-black font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50 whitespace-nowrap"
        >
          {submitting ? 'Posting…' : 'Post banner'}
        </button>
      </form>

      {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

      <div className="space-y-2">
        {announcements?.map((a) => (
          <div
            key={a.id}
            className="flex items-center gap-3 bg-[var(--overlay)] rounded-lg px-4 py-2.5 text-sm"
          >
            {a.emoji && <span>{a.emoji}</span>}
            <span className="flex-1 truncate">{a.message}</span>
            <span className="text-xs text-[var(--text-faint)] whitespace-nowrap">{formatDate(a.created_at)}</span>
            <button
              onClick={() => toggleActive(a.id, !a.active)}
              className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${
                a.active ? 'bg-emerald-500/15 text-emerald-500' : 'bg-[var(--border)] text-[var(--text-dim)]'
              }`}
            >
              {a.active ? 'Live' : 'Off'}
            </button>
            <button onClick={() => remove(a.id)} className="text-[var(--text-faint)] hover:text-red-400 transition-colors">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        {announcements && announcements.length === 0 && (
          <p className="text-sm text-[var(--text-dim)]">No announcements yet.</p>
        )}
      </div>
    </div>
  );
};

// --- Site content editor -------------------------------------------------
const SiteContentSection = () => {
  const [fields, setFields] = useState(null);
  const [editingKey, setEditingKey] = useState(null);
  const [draft, setDraft] = useState('');
  const [error, setError] = useState('');

  const load = () => {
    fetch('/api/admin/content', { credentials: 'same-origin' })
      .then((res) => res.json())
      .then((data) => setFields(data.fields || []))
      .catch(() => setError('Could not load site content.'));
  };

  useEffect(load, []);

  const startEdit = (field) => {
    setEditingKey(field.key);
    setDraft(field.value);
  };

  const save = async (key) => {
    setError('');
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ key, value: draft }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Could not save.');
      }
      setEditingKey(null);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const resetField = async (key) => {
    await fetch('/api/admin/content', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ key }),
    }).catch(() => setError('Could not reset field.'));
    load();
  };

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 mb-6">
      <div className="flex items-center gap-2 mb-1">
        <Pencil size={16} className="text-[#00AEEF]" />
        <h3 className="text-sm font-semibold">Site content</h3>
      </div>
      <p className="text-xs text-[var(--text-dim)] mb-5">
        Edit text shown on the public site without a code deploy. Changes go live immediately.
      </p>

      {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

      <div className="space-y-3">
        {fields?.map((field) => (
          <div key={field.key} className="border border-[var(--border)] rounded-lg p-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-faint)]">
                {field.label}
              </span>
              {field.isOverridden && (
                <button
                  onClick={() => resetField(field.key)}
                  className="text-xs text-[var(--text-faint)] hover:text-[var(--text)] transition-colors"
                >
                  Reset to default
                </button>
              )}
            </div>
            {editingKey === field.key ? (
              <div className="flex flex-col sm:flex-row gap-2">
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  rows={draft.length > 100 ? 3 : 1}
                  className={`${inputClasses} flex-1 resize-y`}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => save(field.key)}
                    className="bg-[#00AEEF] hover:bg-[#E8A23D] text-black font-semibold px-4 py-2 rounded-xl text-xs transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingKey(null)}
                    className="bg-[var(--overlay)] px-4 py-2 rounded-xl text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={() => startEdit(field)} className="text-sm text-left w-full hover:text-[#00AEEF] transition-colors">
                {field.value}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Document uploads ------------------------------------------------------
const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const DocumentsSection = () => {
  const [documents, setDocuments] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', category: '' });
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const load = () => {
    fetch('/api/admin/documents', { credentials: 'same-origin' })
      .then((res) => res.json())
      .then((data) => setDocuments(data.documents || []))
      .catch(() => setError('Could not load documents.'));
  };

  useEffect(load, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    setError('');
    if (!file) {
      setError('Choose a PDF file first.');
      return;
    }
    if (file.type !== 'application/pdf') {
      setError('Only PDF files are allowed.');
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setError('File must be under 4MB.');
      return;
    }

    setUploading(true);
    try {
      const fileDataBase64 = await fileToBase64(file);
      const res = await fetch('/api/admin/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ ...form, filename: file.name, mimeType: file.type, fileDataBase64 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not upload the file.');
      setForm({ title: '', description: '', category: '' });
      setFile(null);
      e.target.reset?.();
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const remove = async (id) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    await fetch('/api/admin/documents', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ id }),
    }).catch(() => setError('Could not delete document.'));
  };

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
      <div className="flex items-center gap-2 mb-1">
        <FileText size={16} className="text-[#00AEEF]" />
        <h3 className="text-sm font-semibold">Documents</h3>
      </div>
      <p className="text-xs text-[var(--text-dim)] mb-5">
        Upload PDFs (compliance rules, rate cards, etc.) for clients to download from the site. PDF only, max 4MB.
      </p>

      <form onSubmit={handleUpload} className="space-y-3 mb-6">
        <input
          type="text"
          placeholder="Title (e.g. DLT Registration Guidelines 2026)"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          required
          className={inputClasses}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Category (optional, e.g. Compliance)"
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            className={inputClasses}
          />
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            required
            className="text-sm text-[var(--text-dim)] file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-[var(--overlay)] file:text-sm file:font-semibold"
          />
        </div>
        <input
          type="text"
          placeholder="Description (optional)"
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          className={inputClasses}
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={uploading}
          className="flex items-center gap-2 bg-[#00AEEF] hover:bg-[#E8A23D] text-black font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50"
        >
          <Upload size={14} /> {uploading ? 'Uploading…' : 'Upload document'}
        </button>
      </form>

      <div className="space-y-2">
        {documents?.map((doc) => (
          <div key={doc.id} className="flex items-center gap-3 bg-[var(--overlay)] rounded-lg px-4 py-2.5 text-sm">
            <span className="flex-1 truncate">{doc.title}</span>
            <span className="text-xs text-[var(--text-faint)] whitespace-nowrap">
              {formatSize(doc.file_size_bytes)} · {formatDate(doc.uploaded_at)}
            </span>
            <button onClick={() => remove(doc.id)} className="text-[var(--text-faint)] hover:text-red-400 transition-colors">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        {documents && documents.length === 0 && <p className="text-sm text-[var(--text-dim)]">No documents uploaded yet.</p>}
      </div>
    </div>
  );
};

const ContentPanel = () => (
  <div className="max-w-2xl">
    <AnnouncementsSection />
    <SiteContentSection />
    <DocumentsSection />
  </div>
);

export default ContentPanel;
