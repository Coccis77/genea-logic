import { useState, useRef, useEffect } from 'react';
import type { Theme } from '../hooks/useTheme';
import { themes } from '../constants';

interface ThemePickerProps {
  theme: Theme;
  setTheme: (t: Theme) => void;
  variant?: 'dropdown' | 'inline';
}

export function ThemePicker({ theme, setTheme, variant = 'dropdown' }: ThemePickerProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const swatches = themes.map((t) => (
    <button
      key={t.id}
      className={`theme-swatch-btn ${theme === t.id ? 'theme-swatch-active' : ''}`}
      onClick={() => {
        setTheme(t.id);
        setOpen(false);
      }}
      title={t.label}
    >
      <span
        className="theme-swatch"
        style={{
          background: `linear-gradient(135deg, ${t.bg} 50%, ${t.accent} 50%)`,
        }}
      />
      <span className="theme-swatch-label">{t.label}</span>
    </button>
  ));

  if (variant === 'inline') {
    return (
      <div className="theme-picker">
        <div className="theme-picker-row">{swatches}</div>
      </div>
    );
  }

  return (
    <div className="theme-picker" ref={ref}>
      <button
        className="theme-picker-toggle"
        onClick={() => setOpen((v) => !v)}
        title="Change theme"
      >
        Theme
      </button>
      {open && <div className="theme-picker-dropdown">{swatches}</div>}
    </div>
  );
}
