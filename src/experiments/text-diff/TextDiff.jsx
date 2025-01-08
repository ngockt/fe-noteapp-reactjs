import React, { useState } from 'react';
import { DiffEditor } from '@monaco-editor/react'; // Monaco Diff Editor
import styles from './TextDiff.module.css'; // Import CSS module

const TextDiff = () => {
  // States for original and modified text
  const [originalText, setOriginalText] = useState(
    'This is the original text.\nModify this text to see changes in real-time.'
  );
  const [modifiedText, setModifiedText] = useState(
    'This is the original text.\nMake some edits here to test the diff.'
  );

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>VS Code-Like Diff Editor</h2>

      <div className={styles.editorContainer}>
        {/* Monaco Diff Editor */}
        <DiffEditor
          height="80vh"
          language="python" // Change language for syntax highlighting
          original={originalText} // Original text (left side)
          modified={modifiedText} // Modified text (right side)
          onChange={(value) => setModifiedText(value)} // Real-time updates
          options={{
            renderSideBySide: true, // Side-by-side diff view
            readOnly: false, // Editable
            lineNumbers: 'on', // Show line numbers
            minimap: { enabled: false }, // Disable minimap
            scrollBeyondLastLine: false, // Prevent scrolling beyond last line
            fontSize: 14, // Font size
            wordWrap: 'on', // Word wrap for long lines
            diffWordWrap: 'on', // Word wrap for differences
            automaticLayout: true, // Auto-resize editor
            renderIndicators: true, // Show change indicators
            renderOverviewRuler: false, // Hide overview ruler
            highlightActiveIndentGuide: true, // Highlight indent guides
            originalEditable: true, // Allow editing original text (optional)
          }}
        />
      </div>
    </div>
  );
};

export default TextDiff;
