import React, { useState, useEffect } from 'react';

const SearchBar = ({ items, onItemSelected }) => {
    const [searchQuery, setSearchQuery] = useState(""); // State for search input
    const [suggestions, setSuggestions] = useState([]); // State for suggestions

    // Update suggestions based on search query
    useEffect(() => {
        if (items && searchQuery) {
            const filteredSuggestions = items.filter(item =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setSuggestions(filteredSuggestions);
        } else {
            setSuggestions([]);
        }
    }, [searchQuery, items]);

    // Handle item selection
    const handleSelect = (event) => {
        const selectedName = event.target.value;
        const selectedItem = items.find(item => item.name === selectedName);

        if (selectedItem) {
            setSearchQuery(selectedName); // Update search query
            setSuggestions([]); // Clear suggestions
            onItemSelected(selectedName); // Notify parent of the selected item
        }
    };

    return (
        <div className="mb-1 position-relative">
            <input
                type="text"
                className="form-control"
                list="search-suggestions"
                placeholder="Search for a node..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onInput={handleSelect} // Handle item selection as the user types
            />
            <datalist id="search-suggestions">
                {suggestions.map(suggestion => (
                    <option key={suggestion.id} value={suggestion.name}>
                        {suggestion.category}
                    </option>
                ))}
            </datalist>
        </div>
    );
};

export default SearchBar;
