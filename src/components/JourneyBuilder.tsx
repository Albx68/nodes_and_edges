import { useState } from "react";

const initialNodeData = [
  { id: 1, position: { x: 100, y: 200 }, indegree: null, outdegree: 2 },
  { id: 2, position: { x: 200, y: 300 }, indegree: 1, outdegree: 3 },
  { id: 3, position: { x: 300, y: 400 }, indegree: 2, outdegree: 4 },
  { id: 4, position: { x: 400, y: 500 }, indegree: 3, outdegree: null },
];

const JourneyBuilder = () => {
  const [nodeData, setNodeData] = useState(initialNodeData)
  const maxHeight = nodeData.reduce((max, node) => Math.max(max, node.position.y), 0);
  const maxWidth = nodeData.reduce((max, node) => Math.max(max, node.position.x), 0);

  const [draggingNodeId, setDraggingNodeId] = useState<number | null>(null);

  const moveNode = (nodeId, x, y) => {
    setNodeData(nodeData.map(node => {
      if (node.id === nodeId) {
        return { ...node, position: { x, y } };
      }
      return node;
    }));
  };
  const handlePointerDown = (nodeId: number, e: React.PointerEvent<SVGRectElement>) => {
    setDraggingNodeId(nodeId);
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (draggingNodeId !== null) {
      const { clientX, clientY } = e;
      const rect = e.currentTarget.getBoundingClientRect();
      const svgX = clientX - rect.left; // Translate to SVG coordinates
      const svgY = clientY - rect.top;

      setNodeData((prevNodes) =>
        prevNodes.map((node) =>
          node.id === draggingNodeId
            ? { ...node, position: { x: svgX - 25, y: svgY - 25 } } // Adjust for rect center
            : node
        )
      );
    }
  };

  const handlePointerUp = () => {
    setDraggingNodeId(null);
  };
  return (
    <div>
      <svg
        width={maxWidth + 200}
        height={maxHeight + 200}
        viewBox={`0 0 ${maxWidth + 200} ${maxHeight + 200}`}
        style={{ border: "1px solid #fff" }}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* Draw paths (connections) */}
        {nodeData.map((node) => {
          if (node.outdegree !== null) {
            const targetNode = nodeData.find((n) => n.id === node.outdegree);
            if (targetNode) {
              return (
                <path
                  key={`path-${node.id}-${targetNode.id}`}
                  d={`M ${node.position.x + 25} ${node.position.y + 25} 
                     L ${targetNode.position.x + 25} ${targetNode.position.y + 25}`}
                  stroke="#000"
                  strokeWidth={2}
                  fill="none"
                  markerEnd="url(#arrowhead)"
                />
              );
            }
          }
          return null;
        })}

        {/* Define arrowhead marker */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="5"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="blue" />
          </marker>
        </defs>

        {/* Draw nodes */}
        {nodeData.map((node) => (
          <rect
            style={{ cursor: "pointer" }}
            key={node.id}
            x={node.position.x}
            y={node.position.y}
            width={50}
            height={50}
            fill="red"
            stroke="black"
            strokeWidth={2}

            onPointerDown={(e) => handlePointerDown(node.id, e)}
          />
        ))}
      </svg>
    </div>
  );
};

export default JourneyBuilder;

