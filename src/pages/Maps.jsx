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
    const [searchQuery, setSearchQuery] = useState(""); // State for search input
    const [suggestions, setSuggestions] = useState([]); // State for suggestions
    const [showSuggestions, setShowSuggestions] = useState(false); // State to control suggestion box visibility
    const [selectedNode, setSelectedNode] = useState(null); // Selected node

    useEffect(() => {
        const setData = async () => {
            const data = await FetchData(url);
            setMapData(data); // Set the data in the state
        };
        setData();
    }, [url]);

    // Handle search suggestions
    useEffect(() => {
        if (mapData && mapData.nodes && searchQuery && showSuggestions) {
            const filteredSuggestions = mapData.nodes
                .filter(node => node.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map(node => ({
                    name: node.name,
                    category: node.category, // Include category in suggestions
                }));
            setSuggestions(filteredSuggestions);
        } else {
            setSuggestions([]);
        }
    }, [searchQuery, mapData, showSuggestions]);

    // Handle search selection
    const handleSelect = (nodeName) => {
        const node = mapData.nodes.find(n => n.name === nodeName);

        // Clear suggestions and hide the suggestion box
        setShowSuggestions(false);
        setSuggestions([]);

        // Update search query and selected node
        setSearchQuery(nodeName);
        setSelectedNode(null); // Reset selectedNode to trigger focus effect
        setTimeout(() => {
            setSelectedNode(node);
        }, 0); // Allow React to reset the state before setting it again
    };

    return (
        <div className="container mt-4" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Fixed Search Bar */}
            <div style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: 'white', paddingBottom: '0px'}}>
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

                {/* Search Bar */}
                <div className="mb-1 position-relative">
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Search for a node..." 
                        value={searchQuery} 
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setShowSuggestions(true); // Show suggestions while typing
                        }} 
                        onFocus={() => setShowSuggestions(true)} // Show suggestions on focus
                    />
                    {showSuggestions && suggestions.length > 0 && (
                        <ul className="list-group position-absolute" style={{ zIndex: 10 }}>
                            {suggestions.map((suggestion, index) => (
                                <li 
                                    key={index} 
                                    className="list-group-item list-group-item-action" 
                                    onClick={() => handleSelect(suggestion.name)}
                                >
                                    <strong>{suggestion.name}</strong> - <span >{suggestion.category}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
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

export default Maps;
