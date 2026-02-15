import { Handle, Position } from 'reactflow';

const hiddenStyle = { opacity: 0, width: 1, height: 1, minWidth: 0, minHeight: 0, padding: 0, border: 'none' };

export function NodeHandles() {
  return (
    <>
      <Handle type="target" position={Position.Top} id="tt" style={hiddenStyle} />
      <Handle type="source" position={Position.Top} id="st" style={hiddenStyle} />
      <Handle type="target" position={Position.Bottom} id="tb" style={hiddenStyle} />
      <Handle type="source" position={Position.Bottom} id="sb" style={hiddenStyle} />
      <Handle type="target" position={Position.Left} id="tl" style={hiddenStyle} />
      <Handle type="source" position={Position.Left} id="sl" style={hiddenStyle} />
      <Handle type="target" position={Position.Right} id="tr" style={hiddenStyle} />
      <Handle type="source" position={Position.Right} id="sr" style={hiddenStyle} />
    </>
  );
}
