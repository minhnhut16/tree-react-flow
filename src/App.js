/* eslint-disable react/button-has-type */
import React, { useCallback, useEffect, useState } from 'react';
import ReactFlowTree from './components/ReactFlow';
import { TreeObject } from './data';

import './App.css';
import { exportJSON, parseJsonFile } from './components/ReactFlow/utils';
import useUploadFile from './hooks/useUpload';

function App() {
  const { InputComponnent, triggerSelect, files, touched } = useUploadFile();
  const [treeData, setTreeData] = useState(TreeObject.root);

  const handleExport = useCallback(convertedTree => {
    exportJSON({
      ...TreeObject,
      root: convertedTree,
    });
  }, []);

  useEffect(() => {
    async function getTreeData() {
      if (!touched) {
        return;
      }
      try {
        if (files && files.length) {
          const data = await parseJsonFile(files[0]);
          setTreeData(data?.root);
        }
      } catch (error) {
        console.log(error);
      }
    }
    getTreeData();
  }, [files, touched]);

  return (
    <div className="App">
      <button
        onClick={triggerSelect}
        className="absolute top-2 left-2 z-[11] bg-green-500 text-white font-bold py-2 px-4 rounded"
      >
        Import
      </button>

      <ReactFlowTree data={treeData} onExport={handleExport} boxWidth={240} boxHeight={180} />

      {InputComponnent}
    </div>
  );
}

export default App;
