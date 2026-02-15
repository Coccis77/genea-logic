interface ProgressBarProps {
  progress: number;
  matched: number;
  total: number;
  incorrect: number;
}

export function ProgressBar({ progress, matched, total, incorrect }: ProgressBarProps) {
  const isWin = progress === 100 && incorrect === 0;

  return (
    <div className="progress-container">
      <div className="progress-label">
        <span>
          Progress: {matched}/{total} relationships
          {incorrect > 0 && <span className="progress-incorrect"> · {incorrect} incorrect</span>}
        </span>
        <span>{progress}%</span>
      </div>
      <div className="progress-bar-track">
        <div
          className={`progress-bar-fill ${isWin ? 'progress-win' : ''}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
