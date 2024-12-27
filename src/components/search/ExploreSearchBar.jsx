import React, { useState, useRef, useEffect } from 'react';

const SearchBar = ({ items, onItemSelected }) => {
    const [searchQuery, setSearchQuery] = useState(""); // State for search input
    const [suggestions, setSuggestions] = useState([]); // State for suggestions
    const [showSuggestions, setShowSuggestions] = useState(false); // State to control suggestion box visibility
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1); // Active suggestion index
    const searchInputRef = useRef(null); // Reference to the search input

    // Update suggestions based on search query
    useEffect(() => {
        if (items && searchQuery && showSuggestions) {
            const filteredSuggestions = items
                .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map(item => ({
                    name: item.name,
                    category: item.category,
                }));
            setSuggestions(filteredSuggestions);
            setActiveSuggestionIndex(-1);
        } else {
            setSuggestions([]);
        }
    }, [searchQuery, items, showSuggestions]);

    // Handle item selection
    const handleSelect = (itemName) => {
        setSearchQuery(itemName); // Update search query
        setShowSuggestions(false); // Hide suggestions
        setSuggestions([]); // Clear suggestions
        setActiveSuggestionIndex(-1); // Reset active suggestion index
        onItemSelected(itemName); // Notify parent of the selected item
    };

    // Handle keyboard navigation
    const handleKeyDown = (e) => {
        if (showSuggestions && suggestions.length > 0) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActiveSuggestionIndex((prevIndex) => (prevIndex + 1) % suggestions.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActiveSuggestionIndex((prevIndex) =>
                    prevIndex <= 0 ? suggestions.length - 1 : prevIndex - 1
                );
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (activeSuggestionIndex >= 0) {
                    handleSelect(suggestions[activeSuggestionIndex].name);
                }
            } else if (e.key === 'Escape') {
                setShowSuggestions(false);
            }
        }
    };

    // Close suggestions when clicking outside
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
    );
};

export default SearchBar;
