import React, { useState } from 'react';
import Card from './Card';
import './Page.css';

const Page = ({ notes }) => {
    const [currentNotes, setCurrentNotes] = useState(notes);

    const handleSave = (id, updatedContent) => {
        setCurrentNotes(
            currentNotes.map((note) =>
                note.id === id ? { ...note, content: updatedContent } : note
            )
        );
    };

    return (
        <div className="page">
            {currentNotes.map((note) => (
                <Card key={note.id} note={note} onSave={handleSave} />
            ))}
        </div>
    );
};

export default Page;
