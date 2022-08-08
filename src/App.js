import React from 'react';
import './app.css';
import ReactFlowTree from './components/ReactFlow';
import { TreeObject } from './data';

function App() {
  return (
    <div className="App">
      <ReactFlowTree data={TreeObject.root} boxWidth={240} boxHeight={180} />
    </div>
  );
}

export default App;
