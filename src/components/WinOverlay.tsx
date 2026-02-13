interface WinOverlayProps {
  levelTitle: string;
  onBackToMenu: () => void;
}

export function WinOverlay({ levelTitle, onBackToMenu }: WinOverlayProps) {
  return (
    <div className="win-overlay">
      <div className="win-modal">
        <h2>Puzzle Complete!</h2>
        <p>You've successfully reconstructed the family tree for:</p>
        <h3>{levelTitle}</h3>
        <p>All relationships have been correctly identified.</p>
        <button className="win-button" onClick={onBackToMenu}>
          Back to Menu
        </button>
      </div>
    </div>
  );
}
