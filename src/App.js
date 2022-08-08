import React from 'react';
import ReactFlowTree from './components/ReactFlow';
import { TreeObject } from './data';

import './app.css';

function App() {
  return (
    <div className="App">
      <ReactFlowTree data={TreeObject.root} boxWidth={240} boxHeight={180} />
    </div>
  );
}

export default App;
