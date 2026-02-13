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
    timeframe: '1920–1960',
  },
];

const difficultyColors: Record<string, string> = {
  easy: '#6a9f6a',
  medium: '#c9a959',
  hard: '#d4726a',
};

interface LevelSelectProps {
  onSelectLevel: (levelId: string) => void;
}

export function LevelSelect({ onSelectLevel }: LevelSelectProps) {
  return (
    <div className="level-select">
      <h1 className="game-title">Genea-Logic</h1>
      <p className="game-subtitle">Reconstruct family trees from historical documents</p>

      <div className="level-list">
        {levels.map((level) => (
          <button
            key={level.id}
            className="level-card"
            onClick={() => onSelectLevel(level.id)}
          >
            <div className="level-card-header">
              <h3>{level.title}</h3>
              <span
                className="difficulty-badge"
                style={{ backgroundColor: difficultyColors[level.difficulty] }}
              >
                {level.difficulty}
              </span>
            </div>
            <div className="level-card-timeframe">{level.timeframe}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
