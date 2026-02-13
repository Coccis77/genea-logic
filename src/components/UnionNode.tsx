import { Handle, Position, type NodeProps } from 'reactflow';
import type { CoupleType } from '../types/level';

export interface UnionNodeData {
  coupleId: string;
  coupleType: CoupleType;
  isPending?: boolean;
}

const h = { opacity: 0, width: 1, height: 1, minWidth: 0, minHeight: 0, padding: 0, border: 'none' };

const typeColors: Record<CoupleType, string> = {
  married: '#ffffff',
  partnership: '#a855f7',
  hidden: '#ef4444',
};

export function UnionNode({ data }: NodeProps<UnionNodeData>) {
  const color = typeColors[data.coupleType];

  return (
    <div
      className={`union-node ${data.isPending ? 'union-pending' : ''}`}
      style={{ backgroundColor: color }}
    >
      <Handle type="target" position={Position.Top} id="tt" style={h} />
      <Handle type="source" position={Position.Top} id="st" style={h} />
      <Handle type="target" position={Position.Bottom} id="tb" style={h} />
      <Handle type="source" position={Position.Bottom} id="sb" style={h} />
      <Handle type="target" position={Position.Left} id="tl" style={h} />
      <Handle type="source" position={Position.Left} id="sl" style={h} />
      <Handle type="target" position={Position.Right} id="tr" style={h} />
      <Handle type="source" position={Position.Right} id="sr" style={h} />
    </div>
  );
}
