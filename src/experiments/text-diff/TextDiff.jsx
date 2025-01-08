import React, { useState } from 'react';
import { DiffEditor } from '@monaco-editor/react'; // Import Monaco Editor
import styles from './TextDiff.module.css'; // Import CSS module

const TextDiff = () => {
    // State to manage original and modified text
    const originalText = 'This is the original text. Modify the text on the right to see the differences in real-time.';
    const [modifiedText, setModifiedText] = useState('');

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Monaco Editor - Real-Time Diff Tool</h2>

            <div className={styles.editorContainer}>
                {/* Diff Editor for side-by-side comparison */}
                <DiffEditor
                    height="80vh"
                    language="plaintext" // Use plaintext for simple text comparison
                    original={originalText} // Original text
                    modified={modifiedText} // Modified text
                    onChange={(value) => setModifiedText(value)} // Update modified text dynamically
                    options={{
                        renderSideBySide: true, // Enable split view
                        readOnly: false, // Allow editing both sides
                        lineNumbers: 'on', // Show line numbers
                        minimap: { enabled: false }, // Disable minimap
                        scrollBeyondLastLine: false, // Prevent scrolling past the last line
                        fontSize: 14, // Font size
                        wordWrap: 'on', // Enable word wrap
                        diffWordWrap: 'on', // Wrap long words in diff
                        automaticLayout: true, // Adjust layout automatically
                        theme: 'vs-light', // Theme: 'vs-dark', 'vs-light', etc.
                    }}
                />
            </div>
        </div>
    );
};

export default TextDiff;
