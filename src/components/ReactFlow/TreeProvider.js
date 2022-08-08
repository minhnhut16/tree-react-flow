import React, { createContext, useContext } from 'react';
import PropTypes from 'prop-types';

const TreeContext = createContext();

function TreeProvider({ children, value }) {
  return <TreeContext.Provider value={value}>{children}</TreeContext.Provider>;
}

TreeProvider.propTypes = {
  children: PropTypes.node.isRequired,
  value: PropTypes.shape({}).isRequired,
};

function useTree() {
  const value = useContext(TreeContext);
  if (typeof value === 'undefined') {
    throw new Error('useTree must be used within a TreeContext');
  }
  return value;
}

export { TreeProvider, useTree };
