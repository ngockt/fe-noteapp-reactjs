import React, { useState, useEffect } from 'react';
import Page from '../components/contents/Page'; // Import the Page component
import AxiosInstance from 'AxiosInstance'; // Import axios instance

const Discover = () => {
    console.log('Init MyFeed')
    const [notes, setNotes] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await AxiosInstance.get('/content/discover'); // API endpoint
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