import { useState } from 'react';
import type { Document } from '../types/level';
import { useMediaCache } from '../hooks/useMediaCache';

interface DocumentViewerProps {
  documents: Document[];
}

const typeLabels: Record<string, string> = {
  birth_certificate: 'Birth Certificate',
  marriage_certificate: 'Marriage Certificate',
  newspaper: 'Newspaper Clipping',
  census: 'Census Record',
  photo: 'Photograph',
  audio: 'Audio Recording',
  video: 'Video Footage',
  other: 'Document',
};

const typeIcons: Record<string, string> = {
  birth_certificate: '\u{1F4DC}',
  marriage_certificate: '\u{1F48D}',
  newspaper: '\u{1F4F0}',
  census: '\u{1F4CB}',
  photo: '\u{1F4F7}',
  audio: '\u{1F3B5}',
  video: '\u{1F3AC}',
  other: '\u{1F4C4}',
};

function DocumentMedia({ doc, blobUrl, loading }: { doc: Document; blobUrl?: string; loading: boolean }) {
  if (doc.type === 'audio') {
    return (
      <div className="document-media-audio">
        {loading ? (
          <p className="media-loading">Loading audio...</p>
        ) : blobUrl ? (
          <audio className="media-audio-player" controls src={blobUrl} />
        ) : null}
        {doc.content && <pre className="document-text">{doc.content}</pre>}
      </div>
    );
  }

  if (doc.type === 'video') {
    return (
      <div className="document-media-video">
        {loading ? (
          <p className="media-loading">Loading video...</p>
        ) : blobUrl ? (
          <video className="media-video-player" controls src={blobUrl} />
        ) : null}
        {doc.content && <pre className="document-text">{doc.content}</pre>}
      </div>
    );
  }

  if (doc.type === 'photo' && doc.mediaUrl) {
    return (
      <div className="document-media-photo">
        {loading ? (
          <p className="media-loading">Loading image...</p>
        ) : blobUrl ? (
          <img className="media-photo-image" src={blobUrl} alt={doc.title} />
        ) : null}
        {doc.content && <pre className="document-text">{doc.content}</pre>}
      </div>
    );
  }

  return doc.content ? <pre className="document-text">{doc.content}</pre> : null;
}

export function DocumentViewer({ documents }: DocumentViewerProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedDoc = documents.find((d) => d.id === selectedId);
  const { blobUrl, loading } = useMediaCache(selectedDoc?.mediaUrl);

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
          <DocumentMedia doc={selectedDoc} blobUrl={blobUrl} loading={loading} />
        </div>
      )}
    </div>
  );
}
