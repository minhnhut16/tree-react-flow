/* eslint-disable no-param-reassign */
import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { v4 as uuid } from 'uuid';
import ReactFlow, { useEdgesState, useNodesState } from 'react-flow-renderer';

import { TreeProvider } from './TreeProvider';
import { buildNodesEgdes, edgeTypesKeys, nodeTypesKeys } from './utils';
import DecisionNode from './DecisionNode';
import FallbackNode from './FallbackNode';
import DecisionEdge from './DecisionEdge';
import FallbackEdge from './FallbackEdge';

const Wrapper = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
`;

// Minimum Spacing between node
const widthAdjustment = 20;

const nodeTypes = {
  [nodeTypesKeys.decisionNodeKey]: DecisionNode,
  [nodeTypesKeys.fallbackNodeKey]: FallbackNode,
};
const edgeTypes = {
  [edgeTypesKeys.decisionEdgeKey]: DecisionEdge,
  [edgeTypesKeys.fallbackEdgeKey]: FallbackEdge,
};

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

      if (!newNodeData.isFallback) {
        delete newNodeData.isFallback;
      }

      const treeAfterAdded = (function travelTree(tree) {
        function handleTravel(node) {
          if (!node) {
            return;
          }

          if (node.id === parentNodeId) {
            // only allow 1 fallback node in children
            if (
              !node.isFallback &&
              newNodeData.isFallback &&
              node.children &&
              node.children.some(item => item.isFallback)
            ) {
              return;
            }

            // parent fallback only allow create fallback node
            if (node.isFallback && !newNodeData.isFallback) {
              return;
            }

            newNodeData.nodeType = newNodeData.isFallback
              ? nodeTypesKeys.fallbackNodeKey
              : nodeTypesKeys.decisionNodeKey;
            newNodeData.edgeType = newNodeData.isFallback
              ? edgeTypesKeys.fallbackEdgeKey
              : edgeTypesKeys.decisionEdgeKey;

            if (node.children) {
              if (node.children[node.children.length - 1].isFallback) {
                const temp = node.children[node.children.length - 1];
                node.children[node.children.length - 1] = newNodeData;
                node.children.push(temp);
              } else {
                node.children.push(newNodeData);
              }
            } else {
              node.children = [newNodeData];
            }

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

        if (parentNode && parentNode.isFallback) {
          node.isFallback = true;
        }

        node.nodeType = node.isFallback
          ? nodeTypesKeys.fallbackNodeKey
          : nodeTypesKeys.decisionNodeKey;
        node.edgeType = node.isFallback
          ? edgeTypesKeys.fallbackEdgeKey
          : edgeTypesKeys.decisionEdgeKey;

        if (node.fallback) {
          const formatedFallback = { ...node.fallback, isFallback: true };
          node.children = node.children ? [...node.children, formatedFallback] : [formatedFallback];
          delete node.fallback;
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
          edgeTypes={edgeTypes}
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
