import { useState, useEffect, useRef } from 'react';
import type { ConnectionMode } from '../types/level';

interface ConnectionToolbarProps {
  mode: ConnectionMode;
  onModeChange: (mode: ConnectionMode) => void;
  onRemoveAll: () => void;
  removeAllDisabled: boolean;
}

const modes: { mode: ConnectionMode; label: string; arrow?: string; color?: string; tutorialId?: string }[] = [
  { mode: 'select', label: 'Select', tutorialId: 'toolbar-select' },
  { mode: 'married', label: 'Married', arrow: '\u2194', color: 'var(--color-married)', tutorialId: 'toolbar-married' },
  { mode: 'partnership', label: 'Partners', arrow: '\u2194', color: 'var(--color-partnership)' },
  { mode: 'affair', label: 'Affair', arrow: '\u2194', color: 'var(--color-affair)' },
  { mode: 'divorced', label: 'Divorced', arrow: '\u2194', color: 'var(--color-divorced)' },
  { mode: 'child', label: 'Child', arrow: '\u2193', color: 'var(--color-child)', tutorialId: 'toolbar-child' },
  { mode: 'adopted', label: 'Adopted', arrow: '\u2193', color: 'var(--color-child)' },
  { mode: 'remove', label: 'Remove', arrow: '\u2715', color: 'var(--color-remove)' },
];

export function ConnectionToolbar({ mode, onModeChange, onRemoveAll, removeAllDisabled }: ConnectionToolbarProps) {
  const [armed, setArmed] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const handleRemoveAll = () => {
    if (!armed) {
      setArmed(true);
      timerRef.current = setTimeout(() => setArmed(false), 3000);
    } else {
      setArmed(false);
      if (timerRef.current) clearTimeout(timerRef.current);
      onRemoveAll();
    }
  };

  return (
    <div className="connection-toolbar">
      {modes.map((m) => (
        <button
          key={m.mode}
          className={`toolbar-btn ${mode === m.mode ? 'toolbar-btn-active' : ''}`}
          onClick={() => onModeChange(m.mode)}
          {...(m.tutorialId ? { 'data-tutorial-id': m.tutorialId } : {})}
        >
          {m.arrow && (
            <span className="toolbar-arrow" style={{ color: m.color }}>
              {m.arrow}
            </span>
          )}
          <span>{m.label}</span>
        </button>
      ))}
      <div className="toolbar-divider" />
      <button
        className={`toolbar-btn remove-all-btn ${armed ? 'remove-all-armed' : ''}`}
        onClick={handleRemoveAll}
        disabled={removeAllDisabled}
        title="Remove all relationships"
      >
        <span className="toolbar-arrow" style={{ color: 'var(--color-remove)' }}>{'\u2715'}</span>
        <span>{armed ? 'Confirm?' : 'Remove all'}</span>
      </button>
    </div>
  );
}
