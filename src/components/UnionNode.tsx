import type { NodeProps } from 'reactflow';
import type { CoupleType } from '../types/level';
import { coupleColors } from '../constants';
import { NodeHandles } from './NodeHandles';

export interface UnionNodeData {
  coupleId: string;
  coupleType: CoupleType;
  isPending?: boolean;
}

export function UnionNode({ data }: NodeProps<UnionNodeData>) {
  return (
    <div
      className={`union-node ${data.isPending ? 'union-pending' : ''}`}
      style={{ backgroundColor: coupleColors[data.coupleType] }}
    >
      <NodeHandles />
    </div>
  );
}
