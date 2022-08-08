/* eslint-disable no-param-reassign */
import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';
import { v4 as uuid } from 'uuid';
import ReactFlow from 'react-flow-renderer';
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
  const deleteNode = useCallback(
    ({
      nodes, setNodes, setEdges, nodeId, nodeData,
    }) => {
      const layoutWidth = boxWidth + widthAdjustment;
      const layoutHeight = boxHeight * 2;
      const childNodeIds = nodeData?.children?.map((item) => item.id) ?? [];

      const newNodesEgdes = buildNodesEgdes(
        nodes
          .filter((item) => item.id !== nodeId && !childNodeIds.includes(item.id))
          .map((item) => item.data),
        layoutWidth,
        layoutHeight,
      );

      setNodes(newNodesEgdes.nodes);
      setEdges(newNodesEgdes.edges);
    },
    [boxHeight, boxWidth],
  );

  const createNode = useCallback(
    ({
      setNodes, nodes, setEdges, parentNodeId, nodeData,
    }) => {
      const layoutWidth = boxWidth + widthAdjustment;
      const layoutHeight = boxHeight * 2;

      const newNodeData = {
        ...nodeData,
        id: uuid(),
        width: boxWidth,
        height: boxHeight,
        parentId: parentNodeId,
      };

      const dataNodes = nodes.map((loopNode) => {
        if (loopNode.data.id === parentNodeId) {
          const currenChildren = loopNode.data.children
            ? [...loopNode.data.children, newNodeData]
            : [newNodeData];

          return {
            ...loopNode.data,
            children: currenChildren,
          };
        }

        return {
          ...loopNode.data,
        };
      });

      dataNodes.push(newNodeData);

      const newNodesEgdes = buildNodesEgdes(dataNodes, layoutWidth, layoutHeight);

      setNodes(newNodesEgdes.nodes);
      setEdges(newNodesEgdes.edges);
    },
    [boxHeight, boxWidth],
  );

  const parseInitTree = useMemo(() => {
    const layoutWidth = boxWidth + widthAdjustment;
    const layoutHeight = boxHeight * 2;

    const flattenTree = (function travelTree(tree) {
      const resArr = [];
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

        resArr.push(node);
        if (node.children) {
          node.children.forEach((loopNode) => handleTravel(loopNode, node));
        }
      }

      handleTravel(tree);
      return resArr;
    }({ ...data }));

    return buildNodesEgdes(flattenTree, layoutWidth, layoutHeight);
  }, [boxHeight, boxWidth]);

  return (
    <TreeProvider value={{ deleteNode, createNode }}>
      <Wrapper>
        <ReactFlow
          defaultNodes={parseInitTree.nodes}
          defaultEdges={parseInitTree.edges}
          nodeTypes={nodeTypes}
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
