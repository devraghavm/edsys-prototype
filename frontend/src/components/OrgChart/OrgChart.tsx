import React, { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  type Node,
  type Edge,
  ReactFlowProvider,
  useReactFlow,
  useEdgesState,
  useNodesState,
  addEdge,
  useStoreApi,
  BackgroundVariant,
  ControlButton,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const MIN_DISTANCE = 150;
const PROXIMITY_EDGE_TYPE = 'smoothstep'; // or any type you use for your org chart
const PROXIMITY_EDGE_STYLE = { strokeWidth: 3, stroke: '#ff0000' }; // match your main edge style

type OrgChartData = {
  nodes: Node[];
  edges: Edge[];
  nodeTypes?: Record<string, React.FC<any>>;
  minDistance?: number;
};

interface OrgChartProps {
  data: OrgChartData;
  onChange?: (data: OrgChartData) => void;
}

const OrgChartInner: React.FC<OrgChartProps> = ({ data, onChange }) => {
  const store = useStoreApi();
  const [nodes, setNodes, onNodesChange] = useNodesState(data.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(data.edges);
  const { getInternalNode } = useReactFlow();

  // Store initial state for reset
  const [initialNodes] = React.useState(data.nodes);
  const [initialEdges] = React.useState(data.edges);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const getClosestEdge = useCallback((node: { id: string }) => {
    const { nodeLookup } = store.getState();
    const internalNode = getInternalNode(node.id);

    if (!internalNode) {
      return null;
    }
    const closestNode = Array.from(nodeLookup.values()).reduce(
      (res: { distance: number; node: typeof internalNode | null }, n) => {
        if (n.id !== internalNode.id) {
          const dx =
            n.internals.positionAbsolute.x -
            internalNode.internals.positionAbsolute.x;
          const dy =
            n.internals.positionAbsolute.y -
            internalNode.internals.positionAbsolute.y;
          const d = Math.sqrt(dx * dx + dy * dy);

          if (d < res.distance && d < (data.minDistance ?? MIN_DISTANCE)) {
            res.distance = d;
            res.node = n;
          }
        }

        return res;
      },
      {
        distance: Number.MAX_VALUE,
        node: null as typeof internalNode | null,
      }
    );

    if (!closestNode.node) {
      return null;
    }

    const closeNodeIsSource =
      closestNode.node.internals.positionAbsolute.x <
      internalNode.internals.positionAbsolute.x;

    return {
      id: closeNodeIsSource
        ? `${closestNode.node.id}-${node.id}`
        : `${node.id}-${closestNode.node.id}`,
      source: closeNodeIsSource ? closestNode.node.id : node.id,
      target: closeNodeIsSource ? node.id : closestNode.node.id,
    };
  }, []);

  interface DragEvent {
    // You can extend this interface with more properties if needed
    // For now, we only use the second argument (node)
  }

  interface ClosestEdge {
    id: string;
    source: string;
    target: string;
    className?: string;
  }

  const onNodeDrag = useCallback(
    (_: DragEvent, node: Node) => {
      const closeEdge = getClosestEdge(node);

      setEdges((es: Edge[]) => {
        const nextEdges = es.filter((e: Edge) => e.className !== 'temp');

        if (
          closeEdge &&
          !nextEdges.find(
            (ne: Edge) =>
              ne.source === closeEdge.source && ne.target === closeEdge.target
          )
        ) {
          (closeEdge as ClosestEdge).className = 'temp';
          (closeEdge as Edge).type = PROXIMITY_EDGE_TYPE;
          (closeEdge as Edge).style = PROXIMITY_EDGE_STYLE;
          nextEdges.push(closeEdge as Edge);
        }

        return nextEdges;
      });
    },
    [getClosestEdge, setEdges]
  );

  interface OnNodeDragStopEvent {
    // Extend as needed for your use case
  }

  const onNodeDragStop = useCallback(
    (_: OnNodeDragStopEvent, node: Node) => {
      const closeEdge = getClosestEdge(node);

      setEdges((es: Edge[]) => {
        const nextEdges = es.filter((e: Edge) => e.className !== 'temp');

        if (
          closeEdge &&
          !nextEdges.find(
            (ne: Edge) =>
              ne.source === closeEdge.source && ne.target === closeEdge.target
          )
        ) {
          (closeEdge as Edge).type = PROXIMITY_EDGE_TYPE;
          (closeEdge as Edge).style = PROXIMITY_EDGE_STYLE;
          nextEdges.push(closeEdge as Edge);
        }

        return nextEdges;
      });
    },
    [getClosestEdge, setEdges]
  );

  // Reset handler
  const handleReset = useCallback(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  React.useEffect(() => {
    if (onChange) {
      onChange({
        nodes,
        edges,
        nodeTypes: data.nodeTypes,
        minDistance: data.minDistance,
      });
    }
  }, [nodes, edges, onChange, data.nodeTypes, data.minDistance]);

  const nodeTypes = useMemo(() => data.nodeTypes, []);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeDrag={onNodeDrag}
      onNodeDragStop={onNodeDragStop}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      fitView
    >
      <MiniMap />
      <Controls>
        <ControlButton onClick={handleReset} title="Reset Org Chart">
          &#8634;
        </ControlButton>
      </Controls>
      <Background variant={BackgroundVariant.Cross} />
    </ReactFlow>
  );
};

const OrgChart: React.FC<OrgChartProps> = (props) => (
  <div style={{ width: '100%', height: '600px' }}>
    <ReactFlowProvider>
      <OrgChartInner {...props} />
    </ReactFlowProvider>
  </div>
);

export { OrgChart, type OrgChartData };
