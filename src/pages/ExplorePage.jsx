import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import VisNetworkGraph from 'components/explore/graph/VisNetworkGraph';
import FetchData from 'components/apis/FetchData';
import PageView from 'components/explore/classic/ClassicView';
import SearchBar from 'components/SearchBar'; // Import the new SearchBar component
import 'bootstrap/dist/css/bootstrap.min.css';

const Explore = () => {
    const location = useLocation();
    const url = location.pathname + location.search;

    const [mapData, setMapData] = useState(null);
    const [isPageView, setIsPageView] = useState(true); // State to toggle views
    const [selectedNode, setSelectedNode] = useState(null); // Selected node

    useEffect(() => {
        const setData = async () => {
            const data = await FetchData('/maps?depth=10');
            setMapData(data);
        };
        setData();
    }, [url]);

    const handleItemSelected = (nodeName) => {
        const node = mapData?.nodes.find((n) => n.name === nodeName);
        setSelectedNode(null); // Reset selectedNode to trigger focus effect
        setTimeout(() => {
            setSelectedNode(node);
        }, 0); // Allow React to reset the state before setting it again
    };

    return (
        <div className="container mt-2" style={{ height: '100vh', display: 'flex', flexDirection: 'column', maxWidth: '90%', margin: '0 auto' }}>
            {/* Fixed Search Bar */}
            <div style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: 'white', paddingBottom: '0px' }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h1 className="mb-0">Explore Community Contents</h1>
                    <fieldset className="btn-group" aria-label="View Toggle">
                        <button
                            type="button"
                            className={`btn ${isPageView ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => setIsPageView(true)}
                            aria-pressed={isPageView}
                        >
                            Classic View
                        </button>
                        <button
                            type="button"
                            className={`btn ${!isPageView ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => setIsPageView(false)}
                            aria-pressed={!isPageView}
                        >
                            Graph View
                        </button>
                    </fieldset>
                </div>

                {/* Search Bar */}
                <SearchBar
                    items={mapData?.nodes || []}
                    onItemSelected={handleItemSelected}
                />
            </div>

            {/* Scrollable Results Container */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
                {isPageView ? (
                    <PageView data={mapData} selectedNode={selectedNode} />
                ) : (
                    <VisNetworkGraph data={mapData} selectedNode={selectedNode} />
                )}
            </div>
        </div>
    );
};

export default Explore;
