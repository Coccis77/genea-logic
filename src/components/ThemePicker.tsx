import { useState, useRef, useEffect } from 'react';
import type { Theme } from '../hooks/useTheme';

interface ThemePickerProps {
  theme: Theme;
  setTheme: (t: Theme) => void;
  variant?: 'dropdown' | 'inline';
}

const themes: { id: Theme; label: string; bg: string; accent: string }[] = [
  { id: 'parchment', label: 'Parchment', bg: '#1a1510', accent: '#c9a959' },
  { id: 'daylight', label: 'Daylight', bg: '#f7f2e4', accent: '#a07828' },
  { id: 'midnight', label: 'Midnight', bg: '#0f172a', accent: '#fbbf24' },
  { id: 'autumn', label: 'Autumn', bg: '#1c1412', accent: '#d4a030' },
  { id: 'frost', label: 'Frost', bg: '#f1f5f9', accent: '#2563eb' },
];

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
      className={`theme-swatch ${theme === t.id ? 'theme-swatch-active' : ''}`}
      style={{
        background: `linear-gradient(135deg, ${t.bg} 50%, ${t.accent} 50%)`,
      }}
      onClick={() => {
        setTheme(t.id);
        setOpen(false);
      }}
      title={t.label}
    />
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
