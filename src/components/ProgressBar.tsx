interface ProgressBarProps {
  progress: number;
  matched: number;
  total: number;
}

export function ProgressBar({ progress, matched, total }: ProgressBarProps) {
  const isWin = progress === 100;

  return (
    <div className="progress-container">
      <div className="progress-label">
        <span>Progress: {matched}/{total} relationships</span>
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
