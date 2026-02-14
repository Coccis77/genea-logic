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

const typeIcons: Record<string, string> = {
  birth_certificate: '\u{1F4DC}',
  marriage_certificate: '\u{1F48D}',
  newspaper: '\u{1F4F0}',
  census: '\u{1F4CB}',
  photo: '\u{1F4F7}',
  other: '\u{1F4C4}',
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
            <span className="document-type-badge">
              <span className="document-icon">{typeIcons[doc.type] ?? ''}</span>
              {typeLabels[doc.type] ?? doc.type}
            </span>
            <span className="document-title">{doc.title}</span>
          </button>
        ))}
      </div>

      {selectedDoc && (
        <div className={`document-content document-content-${selectedDoc.type}`}>
          <div className="document-header">
            <div className="document-type-label">{typeLabels[selectedDoc.type] ?? selectedDoc.type}</div>
            <h3>{selectedDoc.title}</h3>
          </div>
          <pre className="document-text">{selectedDoc.content}</pre>
        </div>
      )}
    </div>
  );
}
