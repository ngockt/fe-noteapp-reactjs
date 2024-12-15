import React, { useState, useEffect } from 'react';
import Page from '../components/contents/Page'; // Import the Page component
import FetchData from "components/apis/FetchData"

const Discover = () => {
    console.log('Init MyFeed')
    const [notes, setNotes] = useState([]);
    useEffect(() => {
        const setData = async () => {
            const data =  await FetchData('/content/discover')
            setNotes(data)
        }
        setData();
    }, []);



    const handleSave = (id, updatedContent) => {
        setNotes(
            notes.map((note) =>
                note.id === id ? { ...note, content: updatedContent } : note
            )
        );
        console.log('handle save event')

    };

    return (
        <div>
            <h1>My Notes</h1>
            <Page notes={notes} onSave={handleSave} />
        </div>
    );
};

export default Discover;