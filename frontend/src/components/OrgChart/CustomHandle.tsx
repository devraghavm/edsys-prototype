import React from 'react';
import { Handle, useNodeConnections } from '@xyflow/react';

import type { HandleProps } from '@xyflow/react';

interface CustomHandleProps extends HandleProps {
  connectionCount: number;
  allowConnections?: boolean;
}

const CustomHandle: React.FC<CustomHandleProps> = (props) => {
  const { connectionCount, allowConnections, ...handleProps } = props;
  const connections = useNodeConnections({
    handleType: props.type,
  });

  return (
    <Handle
      {...handleProps}
      isConnectable={allowConnections && connections.length < connectionCount}
    />
  );
};

export default CustomHandle;
