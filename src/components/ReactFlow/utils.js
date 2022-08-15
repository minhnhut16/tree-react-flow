/* eslint-disable no-param-reassign */
/* eslint-disable import/prefer-default-export */
import { hierarchy, tree as treeFn, stratify } from 'd3-hierarchy';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';

export function buildNodesEgdes(initData, nodeWidth, nodeHeight) {
  if (!initData || isEmpty(initData)) {
    return {
      nodes: [],
      edges: [],
    };
  }

  const treeLayout = treeFn();
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

export function convertOriginTree(tree) {
  function handleTravel(node) {
    if (!node) {
      return;
    }

    delete node.id;
    delete node.width;
    delete node.height;
    delete node.parentId;

    if (!node.isFallback && node.children && node.children[node.children.length - 1].isFallback) {
      const fallbackNode = node.children.pop();
      node.fallback = fallbackNode;
      handleTravel(node.fallback);
    }

    if (node.children && !node.children.length) {
      delete node.children;
    }

    if (node.children) {
      node.children.forEach(loopNode => handleTravel(loopNode));
    }

    if (node.children) {
      node.nodes = node.children;
      delete node.children;
    }
    delete node.isFallback;
  }

  handleTravel(tree);
  return tree;
}

export function exportJSON(jsObject) {
  const jsonString = JSON.stringify(jsObject, null, 2);
  const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(jsonString)}`;
  const exportFileDefaultName = 'data.json';
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.style.display = 'none';
  document.body.appendChild(linkElement);
  linkElement.click();
  document.body.removeChild(linkElement);
}

export async function parseJsonFile(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = event => resolve(JSON.parse(event.target.result));
    fileReader.onerror = error => reject(error);
    fileReader.readAsText(file);
  });
}
