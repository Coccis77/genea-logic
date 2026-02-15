import { useState, useCallback } from 'react';
import { useLevel } from './hooks/useLevel';
import { useValidation } from './hooks/useValidation';
import { useUndoRedo } from './hooks/useUndoRedo';
import { DocumentViewer } from './components/DocumentViewer';
import { FamilyTree } from './components/FamilyTree';
import { ProgressBar } from './components/ProgressBar';
import { LevelSelect } from './components/LevelSelect';
import { WinOverlay } from './components/WinOverlay';
import type { CoupleRelationship, ChildRelationship } from './types/level';
import './App.css';

function App() {
  const [selectedLevelId, setSelectedLevelId] = useState<string | null>(null);
  const [showProgress, setShowProgress] = useState(false);
  const { state, push, undo, redo, canUndo, canRedo, reset } = useUndoRedo();

  const playerCouples = state.couples;
  const playerChildren = state.children;

  const { level, loading, error } = useLevel(selectedLevelId ?? '');
  const { progress, matched, total, isWin } = useValidation(
    playerCouples,
    playerChildren,
    level?.solutionEncoded ?? null
  );

  const handleAddCouple = useCallback((couple: CoupleRelationship) => {
    const existing = playerCouples.find(
      (c) =>
        (c.person1Id === couple.person1Id && c.person2Id === couple.person2Id) ||
        (c.person1Id === couple.person2Id && c.person2Id === couple.person1Id)
    );
    if (existing) {
      if (existing.type === couple.type) return; // same type, no-op
      const newCouples = playerCouples.map((c) =>
        c.id === existing.id ? { ...couple, id: existing.id } : c
      );
      push({ couples: newCouples, children: playerChildren });
    } else {
      push({ couples: [...playerCouples, couple], children: playerChildren });
    }
  }, [push, playerCouples, playerChildren]);

  const handleAddChild = useCallback((child: ChildRelationship) => {
    if (child.coupleId) {
      const couple = playerCouples.find((c) => c.id === child.coupleId);
      if (couple && (couple.person1Id === child.childId || couple.person2Id === child.childId)) return;
    }
    if (child.parentId && child.parentId === child.childId) return;
    push({ couples: playerCouples, children: [...playerChildren, child] });
  }, [push, playerCouples, playerChildren]);

  const handleDeleteCouple = useCallback((coupleId: string) => {
    push({
      couples: playerCouples.filter((c) => c.id !== coupleId),
      children: playerChildren.filter((ch) => ch.coupleId !== coupleId),
    });
  }, [push, playerCouples, playerChildren]);

  const handleDeleteChild = useCallback((childId: string) => {
    push({
      couples: playerCouples,
      children: playerChildren.filter((ch) => ch.id !== childId),
    });
  }, [push, playerCouples, playerChildren]);

  const handleRemoveAll = useCallback(() => {
    if (playerCouples.length === 0 && playerChildren.length === 0) return;
    push({ couples: [], children: [] });
  }, [push, playerCouples, playerChildren]);

  const handleBackToMenu = useCallback(() => {
    setSelectedLevelId(null);
    reset();
  }, [reset]);

  if (!selectedLevelId) {
    return <LevelSelect onSelectLevel={setSelectedLevelId} />;
  }

  if (loading) {
    return <div className="loading">Loading level...</div>;
  }

  if (error || !level) {
    return (
      <div className="error">
        <p>Failed to load level: {error}</p>
        <button onClick={handleBackToMenu}>Back to Menu</button>
      </div>
    );
  }

  return (
    <div className="game-layout">
      <div className="game-header">
        <button className="back-button" onClick={handleBackToMenu}>Back</button>
        <h1 className="level-title">{level.title}</h1>
        <div className="header-actions">
          <button className="header-btn" onClick={undo} disabled={!canUndo} title="Undo (Ctrl+Z)">Undo</button>
          <button className="header-btn" onClick={redo} disabled={!canRedo} title="Redo (Ctrl+Shift+Z)">Redo</button>
          <button className="header-btn" onClick={() => setShowProgress((v) => !v)} title={showProgress ? 'Hide progress' : 'Show progress'}>{showProgress ? 'Hide progress' : 'Show progress'}</button>
        </div>
        <span className="level-timeframe">{level.timeframe}</span>
      </div>

      <div className="game-content">
        <div className="panel-left">
          <DocumentViewer documents={level.documents} />
        </div>
        <div className="panel-right">
          {showProgress && <ProgressBar progress={progress} matched={matched} total={total} />}
          <FamilyTree
            people={level.initialPeople}
            couples={playerCouples}
            children={playerChildren}
            onAddCouple={handleAddCouple}
            onAddChild={handleAddChild}
            onDeleteCouple={handleDeleteCouple}
            onDeleteChild={handleDeleteChild}
            onRemoveAll={handleRemoveAll}
          />
        </div>
      </div>

      {isWin && <WinOverlay levelTitle={level.title} onBackToMenu={handleBackToMenu} />}
    </div>
  );
}

export default App;
