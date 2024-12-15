import { useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import VisNetworkGraph from 'components/map-views/graph-view/VisNetworkGraph';
import FetchData from 'components/apis/FetchData';
import PageView from 'components/map-views/page-view/PageView';
import 'bootstrap/dist/css/bootstrap.min.css';

const Maps = () => {
    const location = useLocation();
    const url = location.pathname + location.search;

    const [mapData, setMapData] = useState(null);
    const [isPageView, setIsPageView] = useState(true); // State to toggle views

    useEffect(() => {
        const setData = async () => {
            const data = await FetchData(url);
            console.log(data);
            setMapData(data); // Set the data in the state
        };
        setData();
    }, [url]);

    return (
        <div className="container mt-4">
            {/* Title and Toggle Button Row */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1 className="mb-0">The Maps</h1>
                <div className="btn-group" role="group" aria-label="View Toggle">
                    <button 
                        type="button" 
                        className={`btn ${isPageView ? 'btn-primary' : 'btn-outline-primary'}`} 
                        onClick={() => setIsPageView(true)}>
                        Page View
                    </button>
                    <button 
                        type="button" 
                        className={`btn ${!isPageView ? 'btn-primary' : 'btn-outline-primary'}`} 
                        onClick={() => setIsPageView(false)}>
                        Graph View
                    </button>
                </div>
            </div>

            {/* Conditional Rendering */}
            {isPageView ? (
                <PageView data={mapData} />
            ) : (
                <VisNetworkGraph data={mapData} />
            )}
        </div>
    );
};

export default Maps;
