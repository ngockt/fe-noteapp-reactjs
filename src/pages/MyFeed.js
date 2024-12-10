import React, { useState } from 'react';
import Page from '../app_components/Page'; // Import the Page component

const MyFeed = () => {
    const [notes, setNotes] = useState([
        { id: 1, content: 'This is a sample note. $E = mc^2$' },
        { id: 2, content: '# Hello World\nThis is another note with **markdown**.' },
        {
            id: 3,
            content: '```mermaid\ngraph LR;\nA-->B;\nB-->C;\nC-->D;\n```',
        },
    ]);

    const handleSave = (id, updatedContent) => {
        setNotes(
            notes.map((note) =>
                note.id === id ? { ...note, content: updatedContent } : note
            )
        );
    };

    return (
        <div>
            <h1>My Notes</h1>
            <Page notes={notes} onSave={handleSave} />
        </div>
    );
};

export default MyFeed;
