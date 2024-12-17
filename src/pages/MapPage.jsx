import { useLocation } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
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
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1); // Active suggestion index

    const searchInputRef = useRef(null); // Reference to the search input

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
            setActiveSuggestionIndex(-1); // Reset active suggestion when suggestions change
        } else {
            setSuggestions([]);
            setActiveSuggestionIndex(-1);
        }
    }, [searchQuery, mapData, showSuggestions]);

    // Handle search selection
    const handleSelect = (nodeName) => {
        const node = mapData.nodes.find(n => n.name === nodeName);

        // Clear suggestions and hide the suggestion box
        setShowSuggestions(false);
        setSuggestions([]);
        setActiveSuggestionIndex(-1);

        // Update search query and selected node
        setSearchQuery(nodeName);
        setSelectedNode(null); // Reset selectedNode to trigger focus effect
        setTimeout(() => {
            setSelectedNode(node);
        }, 0); // Allow React to reset the state before setting it again
    };

    // Handle key down events for navigation
    const handleKeyDown = (e) => {
        if (showSuggestions && suggestions.length > 0) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActiveSuggestionIndex(prevIndex => {
                    const nextIndex = prevIndex + 1;
                    return nextIndex >= suggestions.length ? 0 : nextIndex;
                });
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActiveSuggestionIndex(prevIndex => {
                    const nextIndex = prevIndex - 1;
                    return nextIndex < 0 ? suggestions.length - 1 : nextIndex;
                });
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (activeSuggestionIndex >= 0 && activeSuggestionIndex < suggestions.length) {
                    handleSelect(suggestions[activeSuggestionIndex].name);
                }
            } else if (e.key === 'Escape') {
                setShowSuggestions(false);
            }
        }
    };

    // Handle clicking outside to close suggestions
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="container mt-2" style={{ height: '100vh', display: 'flex', flexDirection: 'column', maxWidth: '90%', margin: '0 auto' }}>
            {/* Fixed Search Bar */}
            <div style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: 'white', paddingBottom: '0px' }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h1 className="mb-0">The Maps</h1>

                    {/* Replaced div with fieldset for better accessibility */}
                    <fieldset className="btn-group" aria-label="View Toggle">
                        {/* Visually hidden legend for accessibility */}
                        {/* <legend className="visually-hidden">View Toggle</legend> */}
                        <button
                            type="button"
                            className={`btn ${isPageView ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => setIsPageView(true)}
                            aria-pressed={isPageView}
                        >
                            Page View
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
                <div className="mb-1 position-relative" ref={searchInputRef}>
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
                        onKeyDown={handleKeyDown} // Handle keyboard navigation
                        aria-autocomplete="list"
                        aria-controls="search-suggestions"
                        aria-activedescendant={
                            activeSuggestionIndex >= 0 ? `suggestion-${activeSuggestionIndex}` : undefined
                        }
                    />
                    {showSuggestions && suggestions.length > 0 && (
                        <ul
                            className="list-group position-absolute w-100"
                            style={{ zIndex: 10, maxHeight: '200px', overflowY: 'auto' }}
                            id="search-suggestions"
                            role="listbox"
                        >
                            {suggestions.map((suggestion, index) => (
                                <li
                                    key={index}
                                    id={`suggestion-${index}`}
                                    className={`list-group-item list-group-item-action ${index === activeSuggestionIndex ? 'list-group-item-primary' : ''}`}
                                    onClick={() => handleSelect(suggestion.name)}
                                    role="option"
                                    aria-selected={index === activeSuggestionIndex}
                                >
                                    <strong>{suggestion.name}</strong>
                                    <span className="badge bg-light text-dark ms-1">{suggestion.category}</span>
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
