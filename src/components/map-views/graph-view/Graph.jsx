import { useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import VisJsGraph from './VisNetworkGraph'; // Graph without zooming
import AxiosInstance from 'AxiosInstance'; // Import axios instance


const Graph = () => {
    const location = useLocation();
    const url = location.pathname + location.search;

    const [data, setData] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await AxiosInstance.get(url); // API endpoint
                console.log(response.data)
                setData(response.data); // Set the data in the state
            } catch (error) {
                console.error('Error fetching graph data:', error);
            }
        };

        fetchData();
    }, [url]);

    return (
        <VisJsGraph data={data} />
    );
};

export default Graph;
