interface WinOverlayProps {
  levelTitle: string;
  onBackToMenu: () => void;
  onViewTree: () => void;
}

export function WinOverlay({ levelTitle, onBackToMenu, onViewTree }: WinOverlayProps) {
  return (
    <div className="win-overlay">
      <div className="win-modal">
        <h2>Puzzle Complete!</h2>
        <p>You've successfully reconstructed the family tree for:</p>
        <h3>{levelTitle}</h3>
        <p>All relationships have been correctly identified.</p>
        <div className="win-actions">
          <button className="win-button" onClick={onViewTree}>
            View Tree
          </button>
          <button className="win-button win-button-secondary" onClick={onBackToMenu}>
            Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
}
