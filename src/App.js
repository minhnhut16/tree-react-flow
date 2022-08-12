import React, { useCallback } from 'react';
import ReactFlowTree from './components/ReactFlow';
import { TreeObject } from './data';

import './App.css';
import { exportJSON } from './components/ReactFlow/utils';

function App() {
  const handleExport = useCallback(convertedTree => {
    exportJSON({
      ...TreeObject,
      root: convertedTree,
    });
  }, []);

  return (
    <div className="App">
      <ReactFlowTree
        data={TreeObject.root}
        onExport={handleExport}
        boxWidth={240}
        boxHeight={180}
      />
    </div>
  );
}

export default App;
