import React, { useCallback, useState } from 'react';
import { Handle, Position, useReactFlow } from 'react-flow-renderer';
import PropTypes from 'prop-types';
import JSONPretty from 'react-json-pretty';
import styled from 'styled-components';

import ThemeAdventureTime from 'react-json-pretty/dist/adventure_time';
import { Modal } from 'antd';
import { useTree } from './TreeProvider';

const JsonFormatter = styled(JSONPretty)`
  pre {
    display: block;
  }
`;

export default function DecisionNode({ data }) {
  const { deleteNode, createNode } = useTree();
  const { setNodes, getNodes, setEdges } = useReactFlow();
  const {
    width, height, name, title, scoring, id, evaluation,
  } = data;
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
  const [openCreateNodeForm, setOpenCreateNodeForm] = useState(false);

  const confirmDeleteNode = useCallback(() => {
    if (deleteNode) {
      deleteNode({
        setNodes, nodes: getNodes(), setEdges, nodeId: id, nodeData: data,
      });
    }
    setOpenDeleteConfirmation(false);
  }, [data, deleteNode, getNodes, id, setEdges, setNodes]);

  const confirmCreateNode = useCallback(() => {
    if (createNode) {
      createNode({
        setNodes,
        nodes: getNodes(),
        setEdges,
        parentNodeId: id,
        parentNodeData: data,
        nodeData: {
          name: 'New node',
          title: 'new Node',
        },
      });
    }
    setOpenCreateNodeForm(false);
  }, [createNode, data, getNodes, id, setEdges, setNodes]);

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div className="p-2 rounded-3xl border-4 border-black relative" style={{ width, height }}>
        <div className="font-semibold text-sm">{title || name}</div>
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
          onClick={() => setOpenCreateNodeForm(true)}
        >
          +
        </div>
        <div
          className="absolute right-2/3 -bottom-3 bg-red-500  text-white font-bold rounded-full w-6 h-6 flex justify-center items-center"
          onClick={() => setOpenDeleteConfirmation(true)}
        >
          -
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} />

      <Modal
        title="Create confirmation"
        visible={openCreateNodeForm}
        onOk={confirmCreateNode}
        onCancel={() => setOpenCreateNodeForm(false)}
      >
        <p>Create a node</p>
      </Modal>

      <Modal
        title="Delete confirmation"
        visible={openDeleteConfirmation}
        onOk={confirmDeleteNode}
        onCancel={() => setOpenDeleteConfirmation(false)}
      >
        <p>Are you sure to delete this node</p>
      </Modal>
      {/* <Handle type="source" position={Position.Bottom} id="b" style={handleStyle} /> */}
    </>
  );
}

DecisionNode.propTypes = {
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

DecisionNode.defaultProps = {
  data: {},
};
