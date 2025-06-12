import type { OrgNode } from '@/common/types/org-node';

function computeTreeLayout(nodes: OrgNode[]) {
  const childrenMap: Record<string, OrgNode[]> = {};
  nodes.forEach((node) => {
    if (node.parentId) {
      if (!childrenMap[node.parentId]) childrenMap[node.parentId] = [];
      childrenMap[node.parentId].push(node);
    }
  });

  const roots = nodes.filter((n) => !n.parentId);

  const horizontalSpacing = 300;
  const verticalSpacing = 300;

  const positions: Record<string, { x: number; y: number; orphan?: boolean }> =
    {};

  // Track the next available x slot for leaves
  let nextX = 0;

  function layout(node: OrgNode, depth: number): number {
    const children = childrenMap[node.id] || [];
    let x: number;

    if (children.length === 0) {
      x = nextX * horizontalSpacing;
      nextX += 1;
    } else {
      const childCenters = children.map((child) => layout(child, depth + 1));
      x = (Math.min(...childCenters) + Math.max(...childCenters)) / 2;
    }

    positions[node.id] = {
      x,
      y: depth * verticalSpacing,
    };
    return x;
  }

  // Layout all roots (forest support)
  let mainTreeWidth = 0;
  roots.forEach((root, _) => {
    const children = childrenMap[root.id] || [];
    // If root has children, layout as part of main tree
    if (children.length > 0) {
      layout(root, 0);
      // Track the rightmost x of the main tree
      mainTreeWidth = Math.max(
        mainTreeWidth,
        ...Object.values(positions).map((pos) => pos.x)
      );
    }
  });

  // Place roots without children to the right of the main tree, spaced apart
  let orphanRootOffset = mainTreeWidth + horizontalSpacing;
  roots.forEach((root) => {
    const children = childrenMap[root.id] || [];
    if (children.length === 0) {
      positions[root.id] = {
        x: orphanRootOffset,
        y: 0,
        orphan: true,
      };
      orphanRootOffset += horizontalSpacing;
    }
  });

  // --- Center the tree horizontally so the main root is at x = 0 ---
  if (roots.length > 0) {
    // Find the first root with children (main tree root)
    const mainRoot =
      roots.find((r) => (childrenMap[r.id] || []).length > 0) || roots[0];
    const rootX = positions[mainRoot.id]?.x ?? 0;
    Object.values(positions).forEach((pos) => {
      pos.x = pos.x - rootX;
    });
  }

  return positions;
}

function computeNodeLevels(nodes: OrgNode[]): Record<string, number> {
  const levels: Record<string, number> = {};
  const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));
  function getLevel(node: OrgNode): number {
    if (levels[node.id] !== undefined) return levels[node.id];
    if (!node.parentId) {
      levels[node.id] = 0;
      return levels[node.id];
    }
    const parentLevel = getLevel(nodeMap[node.parentId]) + 1;
    levels[node.id] = parentLevel;
    return levels[node.id];
  }
  nodes.forEach(getLevel);
  return levels;
}

export { computeTreeLayout, computeNodeLevels };
