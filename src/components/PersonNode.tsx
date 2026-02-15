import type { NodeProps } from 'reactflow';
import type { Gender } from '../types/level';
import { NodeHandles } from './NodeHandles';

export interface PersonNodeData {
  displayName: string;
  knownFacts: string[];
  gender: Gender;
  isPending?: boolean;
}

export function PersonNode({ data }: NodeProps<PersonNodeData>) {
  const isMale = data.gender === 'male';
  const isFemale = data.gender === 'female';

  return (
    <div
      className={`person-node ${isMale ? 'person-male' : ''} ${isFemale ? 'person-female' : ''} ${data.isPending ? 'person-pending' : ''}`}
    >
      <NodeHandles />
      <div className="person-name">{data.displayName}</div>
      <div className="person-facts">
        {data.knownFacts.map((fact, i) => (
          <span key={i} className="person-fact">{fact}</span>
        ))}
      </div>
    </div>
  );
}
