import { useState, useLayoutEffect, useCallback } from 'react';
import './Tutorial.css';

interface TutorialProps {
  onDismiss: () => void;
}

type Placement = 'bottom' | 'right';

interface Step {
  targetId: string;
  title: string;
  message: string;
  placement: Placement;
}

const STEPS: Step[] = [
  {
    targetId: 'toolbar-select',
    title: 'Select Mode',
    message: 'Drag people to reposition them in the tree.',
    placement: 'bottom',
  },
  {
    targetId: 'panel-left',
    title: 'Documents & Clues',
    message: 'Historical documents hold the clues to figure out relationships.',
    placement: 'right',
  },
  {
    targetId: 'toolbar-married',
    title: 'Married Mode',
    message: 'Two ways: click+click or drag. Works for all relationship types.',
    placement: 'bottom',
  },
  {
    targetId: 'toolbar-child',
    title: 'Child Mode',
    message:
      'Child of couple: click couple arrow, then click child. Child of single parent: click parent, then click child.',
    placement: 'bottom',
  },
  {
    targetId: 'btn-show-progress',
    title: 'Show Progress',
    message: 'Helps when stuck — shows how many relationships are correct.',
    placement: 'bottom',
  },
];

const PAD = 6;
const TOOLTIP_GAP = 12;
const VIEWPORT_MARGIN = 12;

export function Tutorial({ onDismiss }: TutorialProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);

  const step = STEPS[stepIndex];
  const isLast = stepIndex === STEPS.length - 1;

  const measure = useCallback(() => {
    const el = document.querySelector(`[data-tutorial-id="${step.targetId}"]`);
    if (el) {
      setRect(el.getBoundingClientRect());
    }
  }, [step.targetId]);

  useLayoutEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  const handleNext = () => {
    if (isLast) {
      onDismiss();
    } else {
      setStepIndex((i) => i + 1);
    }
  };

  // Spotlight cutout rect (padded)
  const cutout = rect
    ? {
        x: rect.x - PAD,
        y: rect.y - PAD,
        w: rect.width + PAD * 2,
        h: rect.height + PAD * 2,
      }
    : null;

  // SVG path: full viewport rect + cutout hole (evenodd)
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const pathD = cutout
    ? `M0,0 H${vw} V${vh} H0 Z M${cutout.x},${cutout.y} v${cutout.h} h${cutout.w} v${-cutout.h} Z`
    : `M0,0 H${vw} V${vh} H0 Z`;

  // Tooltip positioning
  let tooltipStyle: React.CSSProperties = {};
  let arrowStyle: React.CSSProperties = {};
  let placementClass = `tutorial-tooltip-${step.placement}`;

  if (cutout) {
    if (step.placement === 'bottom') {
      const tooltipLeft = cutout.x + cutout.w / 2;
      const clampedLeft = Math.max(
        VIEWPORT_MARGIN + 120,
        Math.min(tooltipLeft, vw - VIEWPORT_MARGIN - 120)
      );
      tooltipStyle = {
        top: cutout.y + cutout.h + TOOLTIP_GAP,
        left: clampedLeft,
        transform: 'translateX(-50%)',
      };
      // Arrow offset to still point at target center
      arrowStyle = { '--arrow-left': `${Math.max(16, Math.min(tooltipLeft - clampedLeft + 170, 324))}px` } as React.CSSProperties;
    } else {
      // right
      const tooltipTop = cutout.y + cutout.h / 2;
      const clampedTop = Math.max(
        VIEWPORT_MARGIN + 60,
        Math.min(tooltipTop, vh - VIEWPORT_MARGIN - 60)
      );
      tooltipStyle = {
        top: clampedTop,
        left: cutout.x + cutout.w + TOOLTIP_GAP,
        transform: 'translateY(-50%)',
      };
      arrowStyle = { '--arrow-top': `${Math.max(16, Math.min(tooltipTop - clampedTop + 60, 100))}px` } as React.CSSProperties;
    }
  }

  return (
    <div className="tutorial-overlay">
      <svg className="tutorial-backdrop" width={vw} height={vh}>
        <path d={pathD} fillRule="evenodd" />
      </svg>

      {cutout && (
        <div
          className={`tutorial-tooltip ${placementClass}`}
          style={{ ...tooltipStyle, ...arrowStyle }}
        >
          <h4 className="tutorial-title">{step.title}</h4>
          <p className="tutorial-message">{step.message}</p>
          <div className="tutorial-footer">
            <button className="tutorial-btn-skip" onClick={onDismiss}>
              Skip
            </button>
            <span className="tutorial-step-counter">
              {stepIndex + 1} / {STEPS.length}
            </span>
            <button className="tutorial-btn-next" onClick={handleNext}>
              {isLast ? 'Got it!' : 'Next'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
