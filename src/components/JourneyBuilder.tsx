import { useState } from "react";

const initialNodeData = [
  { id: 1, position: { x: 175, y: 200 }, indegree: null, outdegree: 2, info: "this is node 1 and it has no in or out edge" },
  { id: 2, position: { x: 175, y: 300 }, indegree: 1, outdegree: 3, info: "this is node 2 and it has in edge" },
  { id: 3, position: { x: 175, y: 400 }, indegree: 2, outdegree: 4, info: "this is node 3 and it has in and out edge" },
  { id: 4, position: { x: 175, y: 500 }, indegree: 3, outdegree: 1, info: "this is node 4 and it has out edge" },
];

const JourneyBuilder = () => {
  const [nodeData, setNodeData] = useState(initialNodeData);
  const [draggingNodeId, setDraggingNodeId] = useState<number | null>(null);

  const maxHeight = nodeData.reduce((max, node) => Math.max(max, node.position.y), 0);
  const maxWidth = nodeData.reduce((max, node) => Math.max(max, node.position.x), 0);

  const selectedNode = nodeData.find((node) => node.id === draggingNodeId) || { id: 0, position: { x: 0, y: 0 }, info: "" };

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

  const handleAddNode = () => {
    const newNodeId = nodeData.length + 1; // Generate a unique ID
    const lastNode = nodeData[nodeData.length - 1]; // Get the last node
    const newNode = {
      id: newNodeId,
      position: { x: lastNode.position.x + 100, y: lastNode.position.y + 100 }, // Default position slightly offset
      indegree: lastNode ? lastNode.id : null, // Point indegree to the last node
      outdegree: null,
      info: `This is node ${newNodeId}, a new node.`,
    };

    // Update the last node's outdegree to point to the new node
    setNodeData((prevNodes) =>
      prevNodes.map((node) =>
        node.id === lastNode?.id ? { ...node, outdegree: newNodeId } : node
      ).concat(newNode) // Add the new node to the list
    );
  }; return (
    <div>
      <button
        onClick={handleAddNode}
        style={{
          marginBottom: "10px",
          padding: "10px 20px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Add Node
      </button>
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
        {nodeData.map((node) => {
          const isSelected = selectedNode.id === node.id;
          return (
            <g key={node.id}>
              <rect
                style={{ cursor: "pointer" }}
                x={node.position.x}
                y={node.position.y}
                width={50}
                height={50}
                fill="red"
                stroke="black"
                strokeWidth={2}
                onPointerDown={(e) => handlePointerDown(node.id, e)}
              />
              {isSelected && (
                <text
                  x={node.position.x + 150}
                  y={node.position.y + 25}
                  fill="#eee"
                  fontSize="12px"
                  textAnchor="middle"
                  dominantBaseline="central"
                >
                  {selectedNode.info}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default JourneyBuilder;
