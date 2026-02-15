import type { ConnectionMode } from '../types/level';

interface ConnectionToolbarProps {
  mode: ConnectionMode;
  onModeChange: (mode: ConnectionMode) => void;
  onRemoveAll: () => void;
  removeAllDisabled: boolean;
}

const modes: { mode: ConnectionMode; label: string; arrow?: string; color?: string }[] = [
  { mode: 'select', label: 'Select' },
  { mode: 'married', label: 'Married', arrow: '\u2194', color: 'var(--color-married)' },
  { mode: 'partnership', label: 'Partners', arrow: '\u2194', color: 'var(--color-partnership)' },
  { mode: 'hidden', label: 'Affair', arrow: '\u2194', color: 'var(--color-affair)' },
  { mode: 'divorced', label: 'Divorced', arrow: '\u2194', color: 'var(--color-divorced)' },
  { mode: 'child', label: 'Child', arrow: '\u2193', color: 'var(--color-child)' },
  { mode: 'adopted', label: 'Adopted', arrow: '\u2193', color: 'var(--color-child)' },
  { mode: 'remove', label: 'Remove', arrow: '\u2715', color: 'var(--color-remove)' },
];

export function ConnectionToolbar({ mode, onModeChange, onRemoveAll, removeAllDisabled }: ConnectionToolbarProps) {
  return (
    <div className="connection-toolbar">
      {modes.map((m) => (
        <button
          key={m.mode}
          className={`toolbar-btn ${mode === m.mode ? 'toolbar-btn-active' : ''}`}
          onClick={() => onModeChange(m.mode)}
        >
          {m.arrow && (
            <span className="toolbar-arrow" style={{ color: m.color }}>
              {m.arrow}
            </span>
          )}
          <span>{m.label}</span>
        </button>
      ))}
      <button
        className="toolbar-btn remove-all-btn"
        onClick={onRemoveAll}
        disabled={removeAllDisabled}
        title="Remove all relationships"
      >
        <span className="toolbar-arrow" style={{ color: 'var(--color-remove)' }}>{'\u2715'}</span>
        <span>Remove all</span>
      </button>
    </div>
  );
}
