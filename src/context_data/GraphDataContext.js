import React, { createContext, useContext, useState, useEffect } from 'react';
import { getRequest } from 'apis/services';
import ENDPOINTS from 'apis/endpoints';

// Create a context
const GraphDataContext = createContext();

// Create a provider component
export const GraphDataProvider = ({ children }) => {
    const [graphData, setGraphData] = useState(null);

    useEffect(() => {
        if (!graphData) {
            getRequest(ENDPOINTS.GRAPH)
                .then((data) => setGraphData(data))
                .catch((error) => {
                    console.error('Error fetching graph data:', error);
                    setGraphData([]); // Gracefully handle errors by setting an empty default value
                });
            console.log("Get graph data");
        }
    }, [graphData]);

    // If still loading, don't render children
    if (graphData === null) return null;

    return (
        <GraphDataContext.Provider value={graphData}>
            {children}
        </GraphDataContext.Provider>
    );
};

// Custom hook to use the context
export const useGraphData = () => {
    return useContext(GraphDataContext);
};
