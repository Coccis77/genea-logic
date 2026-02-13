import { Handle, Position, type NodeProps } from 'reactflow';
import type { Gender } from '../types/level';

export interface PersonNodeData {
  displayName: string;
  knownFacts: string[];
  gender: Gender;
  isPending?: boolean;
}

const h = { opacity: 0, width: 1, height: 1, minWidth: 0, minHeight: 0, padding: 0, border: 'none' };

export function PersonNode({ data }: NodeProps<PersonNodeData>) {
  const isMale = data.gender === 'male';
  const isFemale = data.gender === 'female';

  return (
    <div
      className={`person-node ${isMale ? 'person-male' : ''} ${isFemale ? 'person-female' : ''} ${data.isPending ? 'person-pending' : ''}`}
    >
      <Handle type="target" position={Position.Top} id="tt" style={h} />
      <Handle type="source" position={Position.Top} id="st" style={h} />
      <Handle type="target" position={Position.Bottom} id="tb" style={h} />
      <Handle type="source" position={Position.Bottom} id="sb" style={h} />
      <Handle type="target" position={Position.Left} id="tl" style={h} />
      <Handle type="source" position={Position.Left} id="sl" style={h} />
      <Handle type="target" position={Position.Right} id="tr" style={h} />
      <Handle type="source" position={Position.Right} id="sr" style={h} />
      <div className="person-name">{data.displayName}</div>
      <div className="person-facts">
        {data.knownFacts.map((fact, i) => (
          <span key={i} className="person-fact">{fact}</span>
        ))}
      </div>
    </div>
  );
}
