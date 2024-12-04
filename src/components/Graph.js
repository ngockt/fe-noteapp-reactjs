import React, { useState, useEffect } from 'react';
import D3Graph from './D3Graph'; // Graph with zooming
import VisJsGraph from './VisJsGraph'; // Graph without zooming
import axiosInstance from './axiosInstance'; // Import axios instance

const Graph = () => {
    const [data, setData] = useState(null);
    const [showZoomableGraph, setShowZoomableGraph] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get('/graph'); // API endpoint
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
            <div>
                {<VisJsGraph data={data} />}
            </div>
        </div>
    );
};

export default Graph;
