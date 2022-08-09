/* eslint-disable no-param-reassign */
import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';
import { v4 as uuid } from 'uuid';
import ReactFlow, { useEdgesState, useNodesState } from 'react-flow-renderer';
import { TreeProvider } from './TreeProvider';
import { buildNodesEgdes } from './utils';
import DecisionNode from './DecisionNode';

const Wrapper = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
`;

// Minimum Spacing between node
const widthAdjustment = 20;

const nodeTypes = { decisionNode: DecisionNode };

function ReactFlowTree({ data, boxHeight, boxWidth }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [flowTree, setFlowTree] = useState({});

  const deleteNode = useCallback(
    ({ nodeId }) => {
      const layoutWidth = boxWidth + widthAdjustment;
      const layoutHeight = boxHeight * 2;

      const treeAfterDeleted = (function travelTree(tree) {
        function handleTravel(node, parentNode) {
          if (!node) {
            return;
          }

          if (node.id === nodeId) {
            if (!parentNode) {
              // delete all key of this object => empty node
              // eslint-disable-next-line guard-for-in
              for (const key in node) {
                delete node[key];
              }
            } else {
              parentNode.children = parentNode.children.filter(child => child.id !== nodeId);
              if (parentNode.children.length === 0) {
                delete parentNode.children;
              }
            }
            return;
          }

          if (node.children) {
            node.children.forEach(loopNode => handleTravel(loopNode, node));
          }
        }

        handleTravel(tree);
        return tree;
      })({ ...flowTree });

      const newNodesEgdes = buildNodesEgdes(treeAfterDeleted, layoutWidth, layoutHeight);

      setNodes(newNodesEgdes.nodes);
      setEdges(newNodesEgdes.edges);
      setFlowTree(treeAfterDeleted);
    },
    [boxHeight, boxWidth, flowTree, setEdges, setNodes]
  );

  const createNode = useCallback(
    ({ parentNodeId, nodeData }) => {
      const layoutWidth = boxWidth + widthAdjustment;
      const layoutHeight = boxHeight * 2;

      const newNodeData = {
        ...nodeData,
        id: uuid(),
        width: boxWidth,
        height: boxHeight,
        parentId: parentNodeId,
      };

      const treeAfterAdded = (function travelTree(tree) {
        function handleTravel(node) {
          if (!node) {
            return;
          }

          if (node.id === parentNodeId) {
            const currenChildren = node.children ? [...node.children, newNodeData] : [newNodeData];
            node.children = currenChildren;
            return;
          }

          if (node.children) {
            node.children.forEach(loopNode => handleTravel(loopNode));
          }
        }

        handleTravel(tree);
        return tree;
      })({ ...flowTree });

      const newNodesEgdes = buildNodesEgdes(treeAfterAdded, layoutWidth, layoutHeight);

      setNodes(newNodesEgdes.nodes);
      setEdges(newNodesEgdes.edges);
      setFlowTree(treeAfterAdded);
    },
    [boxHeight, boxWidth, flowTree, setEdges, setNodes]
  );

  useEffect(() => {
    if (!data) {
      return;
    }

    const layoutWidth = boxWidth + widthAdjustment;
    const layoutHeight = boxHeight * 2;

    const formatedTree = (function travelTree(tree) {
      function handleTravel(node, parentNode) {
        if (!node) {
          return;
        }

        node.id = uuid();
        node.width = boxWidth;
        node.height = boxHeight;

        if (parentNode) {
          node.parentId = parentNode.id;
        }

        if (node.nodes) {
          node.children = node.nodes;
          delete node.nodes;
        }

        if (node.children) {
          node.children.forEach(loopNode => handleTravel(loopNode, node));
        }
      }

      handleTravel(tree);
      return tree;
    })({ ...data });

    const nodesEdges = buildNodesEgdes(formatedTree, layoutWidth, layoutHeight);
    setNodes(nodesEdges.nodes);
    setEdges(nodesEdges.edges);
    setFlowTree(formatedTree);
  }, [boxHeight, boxWidth, data, setEdges, setNodes]);

  return (
    <TreeProvider value={{ deleteNode, createNode }}>
      <Wrapper>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
        />
      </Wrapper>
    </TreeProvider>
  );
}

ReactFlowTree.propTypes = {
  data: PropTypes.shape({}),
  /** Node box's width */
  boxWidth: PropTypes.number,
  /** Node box's height */
  boxHeight: PropTypes.number,
};

ReactFlowTree.defaultProps = {
  data: {},
  boxWidth: 190,
  boxHeight: 80,
};

export default ReactFlowTree;
