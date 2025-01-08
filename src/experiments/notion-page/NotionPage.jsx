import React, { useState, useRef } from 'react';
import TextBlockMain from './TextBlockMain'; // Assuming TextBlockMain supports editing and saving
import { parseTextBlocks } from './TextBlockParse'; // Import parseBlocks function
import './NotionPage.css';

// Sample initial content
const sampleContent = `
# Notion Style Page
A simple React component inspired by Notion.

## 📝 Notes
This is an example of a text block. You can write and organize your ideas here.

## 📋 Tasks
- Task 1: Set up React environment ✅
- Task 2: Create NotionPage.jsx component
- Task 3: Add inline editing functionality

## 💡 Ideas
- Build a to-do app
- Add drag-and-drop functionality
- Create custom themes for the page
`;

const NotionPage = () => {
  // State for text blocks
  const [blocks, setBlocks] = useState(parseTextBlocks(sampleContent)); // Using parseBlocks
  const [editingIndex, setEditingIndex] = useState(null); // Track which block is being edited
  const [isEditing, setIsEditing] = useState(false); // Track if any block is being edited
  const newBlockRef = useRef(null); // Ref for focusing new blocks

  // Add a new empty block and switch to edit mode
  const addNewBlock = () => {
    if (isEditing) return; // Don't create a new block if editing is active

    setBlocks((prevBlocks) => [...prevBlocks, '']); // Add an empty block
    setEditingIndex(blocks.length); // Set the last block to edit mode

    // Focus the new block after rendering
    setTimeout(() => {
      if (newBlockRef.current) {
        newBlockRef.current.focus();
      }
    }, 0);
  };

  // Save a block's content and remove it if empty
  const saveBlock = (index, text) => {
    const updatedBlocks = [...blocks];
    if (text.trim() === '') {
      // Remove block if empty
      updatedBlocks.splice(index, 1);
    } else {
      // Update the block with new content
      updatedBlocks[index] = text;
    }
    setBlocks(updatedBlocks);
    setEditingIndex(null); // Exit edit mode
    setIsEditing(false); // Mark editing as false
  };

  // Handle click outside to add a new block
  const handlePageClick = (e) => {
    if (e.target === e.currentTarget && !isEditing) {
      addNewBlock();
    }
  };

  return (
    <div className="notion-page" onClick={handlePageClick}>
      {blocks.map((block, index) => (
        <TextBlockMain
          key={index}
          initialText={block}
          isEditing={editingIndex === index} // Pass edit mode status
          onSave={(text) => saveBlock(index, text)} // Save block content
          onFocus={() => setIsEditing(true)} // Track editing state
          onBlur={() => setIsEditing(false)} // Reset editing state on blur
          ref={index === blocks.length - 1 ? newBlockRef : null} // Attach ref to last block
        />
      ))}

      {/* Clickable empty space at the end */}
      <div
        style={{
          height: '100px',
          cursor: 'text',
        }}
        onClick={addNewBlock}
      ></div>
    </div>
  );
};

export default NotionPage;
