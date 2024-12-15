import { useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import VisNetworkGraph from 'components/map-views/graph-view/VisNetworkGraph';
import FetchData from 'components/apis/FetchData';


const Maps = () => {
    const location = useLocation();
    const url = location.pathname + location.search;

    const [mapData, setMapData] = useState(null);
    useEffect(() => {
        const setData = async () => {
            const data = await FetchData(url)
            setMapData(data); // Set the data in the state
        };
        setData();
    }, [url]);

    return (
        <VisNetworkGraph data={mapData} />
    );
};

export default Maps;
