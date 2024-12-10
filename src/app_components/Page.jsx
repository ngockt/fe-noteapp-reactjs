import React, { useState, useEffect } from 'react';
import Card from './Card';
import './Page.css';

const Page = ({ notes }) => {
    const [currentNotes, setCurrentNotes] = useState(notes);
    const [newCardId, setNewCardId] = useState(null); // Track the newly created card ID

    useEffect(() => {
        if (notes) {
            setCurrentNotes(notes || []);
        }
    }, [notes]);

    const handleSave = (id, updatedContent) => {
        setCurrentNotes(
            currentNotes.map((note) =>
                note.id === id ? { ...note, content: updatedContent } : note
            )
        );
    };

    const handleAddCard = () => {
        const newId = Date.now(); // Unique ID for the new card
        const newCard = { id: newId, content: '' }; // Default new card content
        setCurrentNotes([newCard, ...currentNotes]); // Add the new card to the top of the list
        setNewCardId(newId); // Track the ID of the new card to open its editor
    };

    const handleEditorClose = () => {
        setNewCardId(null); // Reset the newCardId when the editor is closed
    };

    return (
        <div className="page">
            <div>
                <button onClick={handleAddCard} className="new-card-button">
                    New Card
                </button>
            </div>
            {currentNotes.map((note) => (
                <Card
                    key={note.id}
                    note={note}
                    onSave={handleSave}
                    isNew={newCardId === note.id} // Open editor if it's a new card
                    onCloseEditor={handleEditorClose}
                />
            ))}
        </div>
    );
};

export default Page;
