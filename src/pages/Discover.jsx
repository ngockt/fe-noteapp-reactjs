import React, { useState, useEffect } from 'react';
import Page from '../app_components/Page'; // Import the Page component
import axiosInstance from '../components/Hooks/axiosInstance'; // Import axios instance

const Discover = () => {
    console.log('Init MyFeed')
    const [notes, setNotes] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get('/content/discover'); // API endpoint
                setNotes(response.data); // Set the data in the state
            } catch (error) {
                console.error('Error fetching graph data:', error);
            }
        };
    
        fetchData();
    }, []);



    const handleSave = (id, updatedContent) => {
        setNotes(
            notes.map((note) =>
                note.id === id ? { ...note, content: updatedContent } : note
            )
        );
        console.log('handelsaveevnent')
    };

    return (
        <div>
            <h1>My Notes</h1>
            <Page notes={notes} onSave={handleSave} />
        </div>
    );
};

export default Discover;