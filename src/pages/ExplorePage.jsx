import React, { useState } from 'react';
import VisNetworkGraph from 'components/explore/graph/VisNetworkGraph';
import ClassicView from 'components/explore/classic/ClassicView';
import SearchBar from 'components/search/ExploreSearchBar'; // Import the new SearchBar component
import 'bootstrap/dist/css/bootstrap.min.css';
import { useGraphData } from 'context_data/GraphDataContext';

const Explore = () => {

    const mapData = useGraphData(); // Get data from the custom hook
    const [isPageView, setIsPageView] = useState(true); // State to toggle views
    const [selectedNode, setSelectedNode] = useState(null); // Selected node

    const handleItemSelected = (nodeName) => {
        const node = mapData?.nodes.find((n) => n.name === nodeName);
        setSelectedNode(null); // Reset selectedNode to trigger focus effect
        setTimeout(() => {
            setSelectedNode(node);
        }, 0); // Allow React to reset the state before setting it again
    };

    if (!mapData) return <div>Loading...</div>; // Gracefully handle loading state

    return (
        <div className="container mt-2 mx-0" style={{ height: '100vh', display: 'flex', flexDirection: 'column', maxWidth: '100%', margin: '0 auto' }}>
            {/* Fixed Search Bar */}
            <div style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: 'white', paddingBottom: '0px' }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h1 className="mb-0">Explore Community Contents</h1>

                    <div>
                        <fieldset className="btn-group" aria-label="View Toggle">
                            <button
                                type="button"
                                className={`btn ${isPageView ? 'btn-primary' : 'btn-outline-primary'}`}
                                onClick={() => setIsPageView(true)}
                                aria-pressed={isPageView}
                            >
                                Classic
                            </button>
                            <button
                                type="button"
                                className={`btn ${!isPageView ? 'btn-primary' : 'btn-outline-primary'}`}
                                onClick={() => setIsPageView(false)}
                                aria-pressed={!isPageView}
                            >
                                Graph
                            </button>
                        </fieldset>
                    </div>
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
                    <ClassicView data={mapData} selectedNode={selectedNode} />
                ) : (
                    <VisNetworkGraph data={mapData} selectedNode={selectedNode} />
                )}
            </div>
        </div>
    );
};

export default Explore;
