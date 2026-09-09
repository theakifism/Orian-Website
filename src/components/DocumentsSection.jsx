import { useEffect, useState } from 'react';

const formatSize = (bytes) => {
  if (!bytes) return '';
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;
};

const DocumentsSection = () => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    fetch('/api/documents')
      .then((res) => res.json())
      .then((data) => setDocuments(data.documents || []))
      .catch(() => setDocuments([]));
  }, []);

  if (documents.length === 0) return null;

  return (
    <section id="documents" className="py-20 px-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-[var(--text)] mb-2">Documents & Downloads</h2>
      <p className="text-[var(--text-dim)] mb-8">Compliance documents, rate cards, and other resources.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {documents.map((doc) => (
          <a
            key={doc.id}
            href={doc.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 hover:border-[#00AEEF] transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#00AEEF] shrink-0 mt-0.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <path d="M14 2v6h6" />
            </svg>
            <div className="min-w-0">
              <p className="font-semibold text-[var(--text)] truncate">{doc.title}</p>
              {doc.description && <p className="text-sm text-[var(--text-dim)] mt-0.5">{doc.description}</p>}
              <p className="text-xs text-[var(--text-faint)] mt-1">
                {doc.category ? `${doc.category} · ` : ''}
                {formatSize(doc.sizeBytes)}
              </p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default DocumentsSection;
