/* eslint-disable import/prefer-default-export */
import { hierarchy, tree, stratify } from 'd3-hierarchy';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';

export function buildNodesEgdes(initData, nodeWidth, nodeHeight) {
  if (!initData || isEmpty(initData)) {
    return {
      nodes: [],
      edges: [],
    };
  }

  const treeLayout = tree();
  treeLayout.nodeSize([nodeWidth, nodeHeight]);

  let treeData;
  if (isArray(initData)) {
    treeData = treeLayout(stratify()(initData));
  } else {
    treeData = treeLayout(hierarchy(initData));
  }
  console.log(treeData.links());
  return {
    nodes: treeData.descendants().map(item => ({
      id: item.data.id,
      type: item.data.isFallback ? nodeTypesKeys.fallbackNodeKey : nodeTypesKeys.decisionNodeKey,
      data: {
        ...item.data,
      },
      position: {
        x: item.x,
        y: item.y,
      },
    })),
    edges: treeData.links().map(item => ({
      id: `${item.source.data.id}-${item.target.data.id}`,
      source: item.source.data.id,
      target: item.target.data.id,
      type: item.target.data.isFallback
        ? edgeTypesKeys.fallbackEdgeKey
        : edgeTypesKeys.decisionEdgeKey,
    })),
  };
}

export const nodeTypesKeys = { decisionNodeKey: 'decisionNode', fallbackNodeKey: 'fallbackNode' };
export const edgeTypesKeys = { decisionEdgeKey: 'decisionEdge', fallbackEdgeKey: 'fallbackEdge' };
