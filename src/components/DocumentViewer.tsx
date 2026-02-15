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
  other: 'Document',
};

const typeIcons: Record<string, string> = {
  birth_certificate: '\u{1F4DC}',
  marriage_certificate: '\u{1F48D}',
  newspaper: '\u{1F4F0}',
  census: '\u{1F4CB}',
  photo: '\u{1F4F7}',
  audio: '\u{1F3B5}',
  other: '\u{1F4C4}',
};

function DocumentMedia({ doc, audioBlobUrl, audioLoading, imageBlobUrl, imageLoading }: {
  doc: Document;
  audioBlobUrl?: string;
  audioLoading: boolean;
  imageBlobUrl?: string;
  imageLoading: boolean;
}) {
  const hasMedia = doc.imageUrl || doc.audioUrl;
  if (!hasMedia && !doc.content) return null;
  if (!hasMedia) return <pre className="document-text">{doc.content}</pre>;

  return (
    <div className="document-media">
      {doc.imageUrl && (
        imageLoading ? (
          <p className="media-loading">Loading image...</p>
        ) : imageBlobUrl ? (
          <img className="media-photo-image" src={imageBlobUrl} alt={doc.title} />
        ) : null
      )}
      {doc.audioUrl && (
        audioLoading ? (
          <p className="media-loading">Loading audio...</p>
        ) : audioBlobUrl ? (
          <audio className="media-audio-player" controls src={audioBlobUrl} />
        ) : null
      )}
      {doc.content && <pre className="document-text">{doc.content}</pre>}
    </div>
  );
}

export function DocumentViewer({ documents }: DocumentViewerProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedDoc = documents.find((d) => d.id === selectedId);
  const { blobUrl: audioBlobUrl, loading: audioLoading } = useMediaCache(selectedDoc?.audioUrl);
  const { blobUrl: imageBlobUrl, loading: imageLoading } = useMediaCache(selectedDoc?.imageUrl);

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
          <DocumentMedia
            doc={selectedDoc}
            audioBlobUrl={audioBlobUrl}
            audioLoading={audioLoading}
            imageBlobUrl={imageBlobUrl}
            imageLoading={imageLoading}
          />
        </div>
      )}
    </div>
  );
}
