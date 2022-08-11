/* eslint-disable react/button-has-type */
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
  const { handleOpenCreate, handleOpenDelete, handleOpenEdit } = useTree();
  const { width, height, name, title, scoring, evaluation } = data;

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
        <div className=" w-full left-0 absolute flex justify-center bottom-2">
          <button
            onClick={() => handleOpenCreate(data)}
            className="bg-green-500  text-white font-bold py-2 px-2 rounded"
          >
            Add
          </button>
          <button
            onClick={() => handleOpenEdit(data)}
            className="bg-blue-500  text-white font-bold py-2 px-2 rounded mx-2"
          >
            Edit
          </button>
          <button
            onClick={() => handleOpenDelete(data)}
            className="bg-red-500  text-white font-bold py-2 px-2 rounded"
          >
            Delete
          </button>
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
