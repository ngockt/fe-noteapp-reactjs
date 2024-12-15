import React, { useState, useEffect } from 'react';
import Card from './Card';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Page.css';
import { FiEdit } from 'react-icons/fi';

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
        <div className="container mt-4">
            <div className="d-flex justify-content-end mb-3">
                <button onClick={handleAddCard} className="btn btn-primary d-flex align-items-center">
                    <FiEdit className="me-2" />
                    New Card
                </button>
            </div>
            <div className="row">
                {currentNotes.map((note) => (
                    <div className="col-md-4 mb-3" key={note.id}>
                        <Card
                            note={note}
                            onSave={handleSave}
                            isNew={newCardId === note.id} // Open editor if it's a new card
                            onCloseEditor={handleEditorClose}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Page;
