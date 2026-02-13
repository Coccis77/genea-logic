import { useCallback, useMemo, useRef, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  type Node,
  type Edge,
  type NodeTypes,
  type NodeChange,
  applyNodeChanges,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { PersonNode, type PersonNodeData } from './PersonNode';
import { UnionNode, type UnionNodeData } from './UnionNode';
import { ConnectionToolbar } from './ConnectionToolbar';
import type {
  Person,
  CoupleRelationship,
  ChildRelationship,
  CoupleType,
  ConnectionMode,
} from '../types/level';

interface FamilyTreeProps {
  people: Person[];
  couples: CoupleRelationship[];
  children: ChildRelationship[];
  onAddCouple: (couple: CoupleRelationship) => void;
  onAddChild: (child: ChildRelationship) => void;
  onDeleteCouple: (coupleId: string) => void;
  onDeleteChild: (childId: string) => void;
  onRemoveAll: () => void;
}

const nodeTypes: NodeTypes = {
  person: PersonNode,
  union: UnionNode,
};

const modeColors: Record<string, string> = {
  married: '#ffffff',
  partnership: '#a855f7',
  hidden: '#ef4444',
  child: '#c9a959',
};

const coupleColors: Record<CoupleType, string> = {
  married: '#ffffff',
  partnership: '#a855f7',
  hidden: '#ef4444',
};

const coupleLabels: Record<CoupleType, string> = {
  married: 'Married',
  partnership: 'Partners',
  hidden: 'Hidden',
};

const coupleDash: Record<CoupleType, string | undefined> = {
  married: undefined,
  partnership: '8 4',
  hidden: '3 3',
};

/** Find the person node id from a DOM event target (walks up to ReactFlow's node wrapper). */
function personIdFromEvent(e: React.MouseEvent): string | null {
  const nodeEl = (e.target as HTMLElement).closest('.react-flow__node');
  if (!nodeEl) return null;
  const id = nodeEl.getAttribute('data-id');
  if (!id || id.startsWith('union_')) return null;
  return id;
}

/** Find the couple id from a DOM event target on a couple edge. */
function coupleIdFromEvent(e: React.MouseEvent): string | null {
  const el = (e.target as Element).closest('.react-flow__edge');
  if (!el) return null;
  const testId = el.getAttribute('data-testid');
  if (!testId) return null;
  const edgeId = testId.replace('rf__edge-', '');
  if (!edgeId.startsWith('couple_')) return null;
  return edgeId.replace('couple_', '');
}

export function FamilyTree({
  people,
  couples,
  children,
  onAddCouple,
  onAddChild,
  onDeleteCouple,
  onDeleteChild,
  onRemoveAll,
}: FamilyTreeProps) {
  const [connectionMode, setConnectionMode] = useState<ConnectionMode>('select');
  const [pendingPersonId, setPendingPersonId] = useState<string | null>(null);
  const [pendingCoupleId, setPendingCoupleId] = useState<string | null>(null);
  const [pendingParentId, setPendingParentId] = useState<string | null>(null);

  // Drag-to-connect state
  const dragStartRef = useRef<string | null>(null);
  const dragCoupleRef = useRef<string | null>(null);
  const [dragSourceId, setDragSourceId] = useState<string | null>(null);
  // Track whether drag created a connection (to suppress the subsequent click)
  const dragHandledRef = useRef(false);

  // Drag line visual overlay (DOM-manipulated for performance)
  const dragLineSvgRef = useRef<SVGSVGElement | null>(null);

  function showDragLine(x: number, y: number, color: string) {
    const svg = dragLineSvgRef.current;
    if (!svg) return;
    const line = svg.querySelector('line');
    if (!line) return;
    line.setAttribute('x1', String(x));
    line.setAttribute('y1', String(y));
    line.setAttribute('x2', String(x));
    line.setAttribute('y2', String(y));
    line.setAttribute('stroke', color);
    svg.style.display = 'block';
  }

  function updateDragLine(x: number, y: number) {
    const svg = dragLineSvgRef.current;
    if (!svg) return;
    const line = svg.querySelector('line');
    if (!line) return;
    line.setAttribute('x2', String(x));
    line.setAttribute('y2', String(y));
  }

  function hideDragLine() {
    const svg = dragLineSvgRef.current;
    if (svg) svg.style.display = 'none';
  }

  const isCoupleMode =
    connectionMode === 'married' ||
    connectionMode === 'partnership' ||
    connectionMode === 'hidden';

  const isConnectionMode = isCoupleMode || connectionMode === 'child';

  // Person nodes (managed state for dragging)
  const initialPersonNodes: Node<PersonNodeData>[] = useMemo(
    () =>
      people.map((person) => ({
        id: person.id,
        type: 'person' as const,
        position: person.position,
        data: {
          displayName: person.displayName,
          knownFacts: person.knownFacts,
          gender: person.gender,
        },
      })),
    [people]
  );

  const [personNodes, setPersonNodes] = useState(initialPersonNodes);

  const handleNodesChange = useCallback((changes: NodeChange[]) => {
    const personChanges = changes.filter((change) => {
      if ('id' in change) return !String(change.id).startsWith('union_');
      return true;
    });
    setPersonNodes((nds) => applyNodeChanges(personChanges, nds));
  }, []);

  // Derive union nodes from couples + person positions
  const unionNodes: Node<UnionNodeData>[] = useMemo(() => {
    return couples
      .map((couple) => {
        const p1 = personNodes.find((n) => n.id === couple.person1Id);
        const p2 = personNodes.find((n) => n.id === couple.person2Id);
        if (!p1 || !p2) return null;
        return {
          id: `union_${couple.id}`,
          type: 'union' as const,
          position: {
            x: (p1.position.x + p2.position.x) / 2 + 55,
            y: Math.max(p1.position.y, p2.position.y) + 75,
          },
          data: {
            coupleId: couple.id,
            coupleType: couple.type,
            isPending: couple.id === pendingCoupleId,
          },
          draggable: false,
          className: connectionMode === 'remove' ? 'union-passthrough' : undefined,
        };
      })
      .filter(Boolean) as Node<UnionNodeData>[];
  }, [couples, personNodes, pendingCoupleId, connectionMode]);

  // Add pending highlight to person nodes
  const displayPersonNodes = useMemo(
    () =>
      personNodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          isPending:
            node.id === pendingPersonId ||
            node.id === pendingParentId ||
            node.id === dragSourceId,
        },
        draggable: connectionMode === 'select',
      })),
    [personNodes, pendingPersonId, pendingParentId, dragSourceId, connectionMode]
  );

  const allNodes = useMemo(
    () => [...displayPersonNodes, ...unionNodes],
    [displayPersonNodes, unionNodes]
  );

  // Build edges — highlight the pending couple edge in child mode
  const edges: Edge[] = useMemo(() => {
    const result: Edge[] = [];
    const isRemoveMode = connectionMode === 'remove';
    const posOf = (id: string) => personNodes.find((n) => n.id === id)?.position;

    for (const couple of couples) {
      const isPending = couple.id === pendingCoupleId;
      const color = isPending ? '#c9a959' : coupleColors[couple.type];
      const p1Pos = posOf(couple.person1Id);
      const p2Pos = posOf(couple.person2Id);
      const p1Left = p1Pos && p2Pos ? p1Pos.x <= p2Pos.x : true;
      const isClickable = connectionMode === 'child' || isRemoveMode;
      result.push({
        id: `couple_${couple.id}`,
        source: couple.person1Id,
        target: couple.person2Id,
        sourceHandle: p1Left ? 'sr' : 'sl',
        targetHandle: p1Left ? 'tl' : 'tr',
        type: 'default',
        label: coupleLabels[couple.type],
        interactionWidth: isClickable ? 20 : undefined,
        className: isRemoveMode ? 'edge-removable' : undefined,
        style: {
          stroke: color,
          strokeWidth: isPending ? 3 : 2,
          strokeDasharray: coupleDash[couple.type],
          cursor: isClickable ? 'pointer' : undefined,
        },
        markerStart: { type: MarkerType.ArrowClosed, color },
        markerEnd: { type: MarkerType.ArrowClosed, color },
        labelStyle: { fill: color, fontWeight: 600, fontSize: 11 },
        labelBgStyle: { fill: '#2a2118', fillOpacity: 0.85 },
        labelBgPadding: [6, 3] as [number, number],
      });
    }

    for (const child of children) {
      const source = child.coupleId
        ? `union_${child.coupleId}`
        : child.parentId ?? '';
      if (!source) continue;
      result.push({
        id: `child_${child.id}`,
        source,
        target: child.childId,
        sourceHandle: 'sb',
        targetHandle: 'tt',
        type: 'default',
        interactionWidth: isRemoveMode ? 20 : undefined,
        className: isRemoveMode ? 'edge-removable' : undefined,
        style: {
          stroke: '#c9a959',
          strokeWidth: 2,
          cursor: isRemoveMode ? 'pointer' : undefined,
        },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#c9a959' },
      });
    }

    return result;
  }, [couples, children, personNodes, pendingCoupleId, connectionMode]);

  // ── Drag-to-connect ──

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!isConnectionMode) return;
      const color = modeColors[connectionMode] ?? '#c9a959';

      // In child mode, allow dragging from a couple edge
      if (connectionMode === 'child') {
        const coupleId = coupleIdFromEvent(e);
        if (coupleId) {
          dragCoupleRef.current = coupleId;
          dragHandledRef.current = false;
          showDragLine(e.clientX, e.clientY, color);
          return;
        }
      }

      const id = personIdFromEvent(e);
      if (!id) return;
      dragStartRef.current = id;
      dragHandledRef.current = false;
      setDragSourceId(id);
      showDragLine(e.clientX, e.clientY, color);
    },
    [isConnectionMode, connectionMode]
  );

  const handleMouseUp = useCallback(
    (e: React.MouseEvent) => {
      hideDragLine();

      // Handle drag from couple edge → person
      const dragCouple = dragCoupleRef.current;
      dragCoupleRef.current = null;
      if (dragCouple) {
        const endId = personIdFromEvent(e);
        if (endId) {
          dragHandledRef.current = true;
          const exists = children.some(
            (ch) => ch.coupleId === dragCouple && ch.childId === endId
          );
          if (!exists) {
            onAddChild({
              id: `child_${Date.now()}`,
              coupleId: dragCouple,
              childId: endId,
            });
          }
        }
        return;
      }

      // Handle drag from person → person
      const startId = dragStartRef.current;
      dragStartRef.current = null;
      if (!startId) return;

      const endId = personIdFromEvent(e);

      // Dragged to a different person — create connection
      if (endId && endId !== startId) {
        dragHandledRef.current = true;
        setDragSourceId(null);
        setPendingPersonId(null);
        setPendingParentId(null);

        if (isCoupleMode) {
          const exists = couples.some(
            (c) =>
              (c.person1Id === startId && c.person2Id === endId) ||
              (c.person1Id === endId && c.person2Id === startId)
          );
          if (!exists) {
            onAddCouple({
              id: `couple_${Date.now()}`,
              type: connectionMode as CoupleType,
              person1Id: startId,
              person2Id: endId,
            });
          }
          return;
        }

        if (connectionMode === 'child' && !pendingCoupleId) {
          const exists = children.some(
            (ch) => ch.parentId === startId && ch.childId === endId
          );
          if (!exists) {
            onAddChild({
              id: `child_${Date.now()}`,
              parentId: startId,
              childId: endId,
            });
          }
          return;
        }
      }

      // Released on empty space — cancel drag highlight
      if (!endId) {
        setDragSourceId(null);
      }
      // Released on same node — let onClick handle it (don't clear dragSourceId yet)
    },
    [connectionMode, couples, children, pendingCoupleId, onAddCouple, onAddChild]
  );

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragStartRef.current && !dragCoupleRef.current) return;
    updateDragLine(e.clientX, e.clientY);
  }, []);

  const handleMouseLeave = useCallback(() => {
    dragStartRef.current = null;
    dragCoupleRef.current = null;
    setDragSourceId(null);
    hideDragLine();
  }, []);

  // ── Click-to-connect (click person, click person) ──

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      // Clear drag highlight on any click
      setDragSourceId(null);

      // If drag already handled this interaction, skip
      if (dragHandledRef.current) {
        dragHandledRef.current = false;
        return;
      }

      if (connectionMode === 'select') return;

      // Couple modes: click person, click person
      if (isCoupleMode) {
        if (node.type !== 'person') return;

        if (pendingPersonId === null) {
          setPendingPersonId(node.id);
        } else if (pendingPersonId === node.id) {
          setPendingPersonId(null);
        } else {
          const exists = couples.some(
            (c) =>
              (c.person1Id === pendingPersonId && c.person2Id === node.id) ||
              (c.person1Id === node.id && c.person2Id === pendingPersonId)
          );
          if (!exists) {
            onAddCouple({
              id: `couple_${Date.now()}`,
              type: connectionMode as CoupleType,
              person1Id: pendingPersonId,
              person2Id: node.id,
            });
          }
          setPendingPersonId(null);
        }
        return;
      }

      // Child mode
      if (connectionMode === 'child') {
        if (node.type !== 'person') return;

        // If a couple is selected, assign this person as child of that couple
        if (pendingCoupleId) {
          const exists = children.some(
            (ch) => ch.coupleId === pendingCoupleId && ch.childId === node.id
          );
          if (!exists) {
            onAddChild({
              id: `child_${Date.now()}`,
              coupleId: pendingCoupleId,
              childId: node.id,
            });
          }
          return;
        }

        // Single parent click-click
        if (pendingParentId) {
          if (pendingParentId === node.id) {
            setPendingParentId(null);
            return;
          }
          const exists = children.some(
            (ch) => ch.parentId === pendingParentId && ch.childId === node.id
          );
          if (!exists) {
            onAddChild({
              id: `child_${Date.now()}`,
              parentId: pendingParentId,
              childId: node.id,
            });
          }
          setPendingParentId(null);
          return;
        }

        // Nothing pending — select this person as single parent
        setPendingParentId(node.id);
        return;
      }
    },
    [connectionMode, pendingPersonId, pendingCoupleId, pendingParentId, couples, children, onAddCouple, onAddChild]
  );

  // Handle edge clicks (child mode: select couple | remove mode: delete)
  const onEdgeClick = useCallback(
    (_event: React.MouseEvent, edge: Edge) => {
      if (connectionMode === 'child') {
        if (edge.id.startsWith('couple_')) {
          const coupleId = edge.id.replace('couple_', '');
          setPendingParentId(null);
          setPendingCoupleId((prev) => (prev === coupleId ? null : coupleId));
        }
        return;
      }

      if (connectionMode === 'remove') {
        if (edge.id.startsWith('couple_')) {
          const coupleId = edge.id.replace('couple_', '');
          onDeleteCouple(coupleId);
        } else if (edge.id.startsWith('child_')) {
          const childId = edge.id.replace('child_', '');
          onDeleteChild(childId);
        }
        return;
      }
    },
    [connectionMode, onDeleteCouple, onDeleteChild]
  );

  // Clear pending state when mode changes
  const handleModeChange = useCallback((mode: ConnectionMode) => {
    setConnectionMode(mode);
    setPendingPersonId(null);
    setPendingCoupleId(null);
    setPendingParentId(null);
    dragStartRef.current = null;
    dragCoupleRef.current = null;
    setDragSourceId(null);
  }, []);

  // Dynamic hint text
  const hintText = useMemo(() => {
    if (connectionMode === 'select')
      return 'Drag to move people.';
    if (isCoupleMode) {
      if (dragSourceId) {
        const name = people.find((p) => p.id === dragSourceId)?.displayName ?? '';
        return `Release on another person to connect with ${name}.`;
      }
      if (pendingPersonId) {
        const name = people.find((p) => p.id === pendingPersonId)?.displayName ?? '';
        return `Click another person to connect with ${name}, or drag between two people.`;
      }
      return 'Click a person or drag from one to another to create a link.';
    }
    if (connectionMode === 'child') {
      if (pendingCoupleId)
        return 'Now click a person to add them as a child of this couple.';
      if (dragSourceId) {
        const name = people.find((p) => p.id === dragSourceId)?.displayName ?? '';
        return `Release on a person to add them as a child of ${name}.`;
      }
      if (pendingParentId) {
        const name = people.find((p) => p.id === pendingParentId)?.displayName ?? '';
        return `Click a person to add them as a child of ${name}.`;
      }
      return 'Click a couple arrow, or click/drag from a parent to a child.';
    }
    if (connectionMode === 'remove')
      return 'Click any arrow to remove it.';
    return '';
  }, [connectionMode, dragSourceId, pendingPersonId, pendingCoupleId, pendingParentId, people]);

  return (
    <div
      className="family-tree"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <ConnectionToolbar
        mode={connectionMode}
        onModeChange={handleModeChange}
        onRemoveAll={onRemoveAll}
        removeAllDisabled={couples.length === 0 && children.length === 0}
      />
      <ReactFlow
        nodes={allNodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        nodesConnectable={false}
        elevateEdgesOnSelect
        panOnDrag={isConnectionMode ? [1, 2] : true}
      >
        <Background color="#5c4a35" gap={20} size={1} />
        <Controls />
      </ReactFlow>
      <div className="tree-hint">{hintText}</div>
      <svg
        ref={dragLineSvgRef}
        style={{
          position: 'fixed',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1000,
          display: 'none',
        }}
      >
        <line strokeWidth={2} strokeDasharray="6 4" />
      </svg>
    </div>
  );
}
