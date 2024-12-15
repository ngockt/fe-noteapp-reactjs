import React, { useState, useEffect } from 'react';
import D3Graph from './components/D3Graph'; // Graph with zooming
import VisJsGraph from './components/VisJsGraph'; // Graph without zooming
import AxiosInstance from './components/AxiosInstance'; // Import axios instance

const App = () => {
  const [data, setData] = useState(null);
  const [showZoomableGraph, setShowZoomableGraph] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AxiosInstance.get('/graph'); // API endpoint
        setData(response.data); // Set the data in the state
      } catch (error) {
        console.error('Error fetching graph data:', error);
      }
    };

    fetchData();
  }, []);


  const toggleGraphView = () => {
    setShowZoomableGraph(!showZoomableGraph);
  };

  return (
    <div>
      <h1>Graph Visualization</h1>
      <button onClick={toggleGraphView}>
        {showZoomableGraph ? 'D3Graph' : 'VisJsGraph'}
      </button>
      <div>
        {showZoomableGraph ? <D3Graph data={data} /> : <VisJsGraph data={data} />}
      </div>
    </div>
  );
};

export default App;
