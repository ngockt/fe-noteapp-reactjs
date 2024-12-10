import React, { useState, useEffect } from 'react';
import Card from './Card';
import './Page.css';

const Page = ({ notes }) => {
    const [currentNotes, setCurrentNotes] = useState(notes);

    useEffect(() => {
        if (notes) {
            setCurrentNotes(notes || []);
            console.log('set note', notes)
        }
    }, [notes]);

    const handleSave = (id, updatedContent) => {
        setCurrentNotes(
            currentNotes.map((note) =>
                note.id === id ? { ...note, content: updatedContent } : note
            )
        );
    };

    return (
        <div className="page">
            <h2>A Page</h2>
            {currentNotes.map((note) => (
                <Card key={note.id} note={note} onSave={handleSave} />
            ))}
        </div>
    );
};

export default Page;
