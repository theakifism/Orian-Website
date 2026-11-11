import { useEffect, useState } from 'react';
import { Megaphone, FileText, Trash2, Upload, Eye } from 'lucide-react';
import { AnnouncementDialog } from '../components/AnnouncementBanner';

const inputClasses =
  'w-full bg-[var(--overlay)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#00AEEF] focus:ring-2 focus:ring-[#00AEEF]/40 transition-colors';

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
  const [preview, setPreview] = useState(null); // announcement shown in the live popup preview

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
    const prev = announcements;
    setAnnouncements((p) => p.map((a) => (a.id === id ? { ...a, active } : a)));
    const res = await fetch('/api/admin/announcements', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ id, active }),
    }).catch(() => null);
    if (!res || !res.ok) {
      setAnnouncements(prev);
      setError('Could not update announcement.');
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this announcement? This cannot be undone.')) return;
    const prev = announcements;
    setAnnouncements((p) => p.filter((a) => a.id !== id));
    const res = await fetch('/api/admin/announcements', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ id }),
    }).catch(() => null);
    if (!res || !res.ok) {
      setAnnouncements(prev);
      setError('Could not delete announcement.');
    }
  };

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
      <div className="flex items-center gap-2 mb-1">
        <Megaphone size={16} className="text-[#00AEEF]" />
        <h3 className="text-sm font-semibold">Announcement popup</h3>
      </div>
      <p className="text-xs text-[var(--text-dim)] mb-5">
        Appears as an animated popup a moment after a visitor opens the site, once per announcement (they tap Continue to close it). Posting a new one replaces the current one. Use Preview to see exactly what visitors will see.
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
          className="bg-[#00AEEF] hover:bg-[#34D399] text-black font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50 whitespace-nowrap"
        >
          {submitting ? 'Posting…' : 'Post popup'}
        </button>
        <button
          type="button"
          disabled={!form.message.trim()}
          onClick={() => setPreview({ message: form.message.trim(), emoji: form.emoji.trim() })}
          className="flex items-center justify-center gap-1.5 border border-[var(--border)] hover:border-[#00AEEF] px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-40 whitespace-nowrap"
        >
          <Eye size={14} /> Preview
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
            <button onClick={() => setPreview({ message: a.message, emoji: a.emoji })} aria-label="Preview this announcement" className="text-[var(--text-faint)] hover:text-[#00AEEF] transition-colors">
              <Eye size={14} />
            </button>
            <button onClick={() => remove(a.id)} aria-label="Delete this announcement" className="text-[var(--text-faint)] hover:text-red-400 transition-colors">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        {announcements && announcements.length === 0 && (
          <p className="text-sm text-[var(--text-dim)]">No announcements yet.</p>
        )}
      </div>

      {preview && <AnnouncementDialog announcement={preview} onClose={() => setPreview(null)} />}
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
    // Kept in sync with api/_lib/admin/documents.js's MAX_FILE_BYTES — see
    // the comment there for why 3MB, not 4MB, is the real safe ceiling.
    if (file.size > 3 * 1024 * 1024) {
      setError('File must be under 3MB.');
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
    if (!window.confirm('Delete this document? This cannot be undone.')) return;
    const prev = documents;
    setDocuments((p) => p.filter((d) => d.id !== id));
    const res = await fetch('/api/admin/documents', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ id }),
    }).catch(() => null);
    if (!res || !res.ok) {
      setDocuments(prev);
      setError('Could not delete document.');
    }
  };

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
      <div className="flex items-center gap-2 mb-1">
        <FileText size={16} className="text-[#00AEEF]" />
        <h3 className="text-sm font-semibold">Documents</h3>
      </div>
      <p className="text-xs text-[var(--text-dim)] mb-5">
        Upload PDFs (compliance rules, rate cards, etc.) for clients to download from the site. PDF only, max 3MB.
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
          className="flex items-center gap-2 bg-[#00AEEF] hover:bg-[#34D399] text-black font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50"
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

const SitePanel = () => (
  <div className="grid xl:grid-cols-2 gap-5 items-start">
    <AnnouncementsSection />
    <DocumentsSection />
  </div>
);

export default SitePanel;
