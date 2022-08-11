import React from 'react';
import { Handle, Position } from 'react-flow-renderer';
import PropTypes from 'prop-types';
import JSONPretty from 'react-json-pretty';
import styled from 'styled-components';

import ThemeAdventureTime from 'react-json-pretty/dist/adventure_time';
import { useTree } from './TreeProvider';

const JsonFormatter = styled(JSONPretty)`
  pre {
    display: block;
  }
`;

export default function FallbackNode({ data }) {
  const { handleOpenCreate, handleOpenDelete } = useTree();
  const { width, height, name, title, scoring, id, evaluation } = data;

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div
        className="p-2 rounded-3xl border-4 border-lime-500 relative bg-slate-700"
        style={{ width, height }}
      >
        <div className="font-semibold text-sm text-white">{title || name}</div>
        <JsonFormatter
          data={{
            name,
            evaluation,
            scoring,
          }}
          theme={ThemeAdventureTime}
        />
        <div
          className="absolute left-2/3 -bottom-3 bg-blue-500  text-white font-bold rounded-full w-6 h-6 flex justify-center items-center"
          onClick={() => handleOpenCreate(id)}
        >
          +
        </div>
        <div
          className="absolute right-2/3 -bottom-3 bg-red-500  text-white font-bold rounded-full w-6 h-6 flex justify-center items-center"
          onClick={() => handleOpenDelete(id)}
        >
          -
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
}

FallbackNode.propTypes = {
  data: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
    name: PropTypes.string,
    title: PropTypes.string,
    scoring: PropTypes.string,
    id: PropTypes.string,
    evaluation: PropTypes.string,
  }),
};

FallbackNode.defaultProps = {
  data: {},
};
