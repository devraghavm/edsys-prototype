import { Position } from '@xyflow/react';
import OrgChartCard from './OrgChartCard';
import { memo } from 'react';
import CustomHandle from './CustomHandle';

interface OrgChartCardNodeProps {
  data: {
    name: string;
    department: string;
    position: string;
    imageUrl?: string;
    style?: React.CSSProperties;
    selected?: boolean;
    customCssClassnames?: string;
    topConnectable?: boolean; // Optional prop to allow connections from the top
    bottomConnectable?: boolean; // Optional prop to allow connections to the bottom
  };
}

export default memo(({ data }: OrgChartCardNodeProps) => {
  return (
    <div style={{ position: 'relative' }}>
      {/* Top handle for parent connection */}
      <CustomHandle
        type="target"
        position={Position.Top}
        id="t"
        connectionCount={data.topConnectable ? 1 : 0} // Allow only one connection from the top if specified
        allowConnections={data.topConnectable}
      />
      <OrgChartCard
        name={data.name}
        department={data.department}
        position={data.position}
        imageUrl={data.imageUrl}
        style={data.style}
        selected={data.selected}
        customCssClassnames={data.customCssClassnames}
      />
      {/* Bottom handle for children */}
      <CustomHandle
        type="source"
        position={Position.Bottom}
        id="b"
        connectionCount={data.bottomConnectable ? Number.MAX_VALUE : 0} // Allow only one connection to the bottom if specified
        allowConnections={data.bottomConnectable}
      />
    </div>
  );
});
