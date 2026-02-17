import type { Theme } from '../hooks/useTheme';
import { ThemePicker } from './ThemePicker';

interface LevelInfo {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeframe: string;
}

const levels: LevelInfo[] = [
  {
    id: 'level_01',
    title: 'The Miller Family Mystery',
    difficulty: 'easy',
    timeframe: '1920\u20131960',
  },
];

const difficultyColors: Record<string, string> = {
  easy: 'var(--accent-green)',
  medium: 'var(--accent-gold)',
  hard: 'var(--accent-red)',
};

interface LevelSelectProps {
  onSelectLevel: (levelId: string) => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
  completedLevels: Set<string>;
}

export function LevelSelect({ onSelectLevel, theme, setTheme, completedLevels }: LevelSelectProps) {
  return (
    <div className="level-select">
      <h1 className="game-title">Genea-Logic</h1>
      <p className="game-subtitle">Reconstruct family trees from historical documents</p>

      <ThemePicker theme={theme} setTheme={setTheme} variant="inline" />

      <div className="level-list">
        {levels.map((level) => (
          <button
            key={level.id}
            className={`level-card ${completedLevels.has(level.id) ? 'level-card-completed' : ''}`}
            onClick={() => onSelectLevel(level.id)}
          >
            <div className="level-card-header">
              <h3>{level.title}</h3>
              <div className="level-card-badges">
                {completedLevels.has(level.id) && (
                  <span className="completed-badge">Solved</span>
                )}
                <span
                  className="difficulty-badge"
                  style={{ backgroundColor: difficultyColors[level.difficulty] }}
                >
                  {level.difficulty}
                </span>
              </div>
            </div>
            <div className="level-card-timeframe">{level.timeframe}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
