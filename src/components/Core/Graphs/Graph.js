import { useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import D3Graph from './D3Graph'; // Graph with zooming
import VisJsGraph from './VisJsGraph'; // Graph without zooming
import axiosInstance from '../../Hooks/axiosInstance'; // Import axios instance

const Graph = () => {
    const location = useLocation();
    const url = location.pathname + location.search;

    const [data, setData] = useState(null);
    const [showZoomableGraph, setShowZoomableGraph] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get(url); // API endpoint
                console.log(response.data)
                setData(response.data); // Set the data in the state
            } catch (error) {
                console.error('Error fetching graph data:', error);
            }
        };

        fetchData();
    }, [url]);


    const toggleGraphView = () => {
        setShowZoomableGraph(!showZoomableGraph);
    };

    return (
        <div>
            <h1>Graph Visualization</h1>
            <div>
                {showZoomableGraph ? <VisJsGraph data={data} /> : <D3Graph data={data} />}
            </div>
            <div>
                <button onClick={toggleGraphView}>
                    {showZoomableGraph ? 'VisJsGraph' : 'D3Graph'}
                </button>
            </div>
        </div>
    );
};

export default Graph;
