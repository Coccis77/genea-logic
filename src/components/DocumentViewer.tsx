import { useState } from 'react';
import type { Document } from '../types/level';

interface DocumentViewerProps {
  documents: Document[];
}

const typeLabels: Record<string, string> = {
  birth_certificate: 'Birth Certificate',
  marriage_certificate: 'Marriage Certificate',
  newspaper: 'Newspaper Clipping',
  census: 'Census Record',
  photo: 'Photograph',
  other: 'Document',
};

export function DocumentViewer({ documents }: DocumentViewerProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedDoc = documents.find((d) => d.id === selectedId);

  return (
    <div className="document-viewer">
      <h2 className="document-viewer-title">Documents & Clues</h2>
      <div className="document-list">
        {documents.map((doc) => (
          <button
            key={doc.id}
            className={`document-item ${selectedId === doc.id ? 'active' : ''}`}
            onClick={() => setSelectedId(selectedId === doc.id ? null : doc.id)}
          >
            <span className="document-type-badge">{typeLabels[doc.type] ?? doc.type}</span>
            <span className="document-title">{doc.title}</span>
          </button>
        ))}
      </div>

      {selectedDoc && (
        <div className="document-content">
          <h3>{selectedDoc.title}</h3>
          <div className="document-type-label">{typeLabels[selectedDoc.type] ?? selectedDoc.type}</div>
          <pre className="document-text">{selectedDoc.content}</pre>
        </div>
      )}
    </div>
  );
}
