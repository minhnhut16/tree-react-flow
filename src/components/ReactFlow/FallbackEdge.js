import React from 'react';
import PropTypes from 'prop-types';

import { getBezierPath, Position } from 'react-flow-renderer';

export default function FallbackEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
}) {
  const edgePath = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return <path id={id} className="react-flow__edge-path stroke-orange-600" d={edgePath} />;
}

FallbackEdge.propTypes = {
  id: PropTypes.string,
  sourceX: PropTypes.number,
  sourceY: PropTypes.number,
  targetX: PropTypes.number,
  targetY: PropTypes.number,
  sourcePosition: PropTypes.oneOf(Position),
  targetPosition: PropTypes.oneOf(Position),
};

FallbackEdge.defaultProps = {
  id: '',
  sourceX: 0,
  sourceY: 0,
  targetX: 0,
  targetY: 0,
  sourcePosition: Position.Top,
  targetPosition: Position.Bottom,
};
