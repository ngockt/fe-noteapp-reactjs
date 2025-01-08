import React, { useState, useRef, useEffect } from 'react';
import TextBlockMain from './TextBlockMain'; // Assuming TextBlockMain supports editing and saving
import { parseTextBlocks } from './TextBlockParse'; // Import parseBlocks function
import { getRequest } from 'apis/services';
import './NotionPage.css';
import ENDPOINTS from 'apis/endpoints';

const NotionPage = () => {
  // State for text blocks
  const [noteContent, setNoteContent] = useState('');
  const [blocks, setBlocks] = useState([]); // Parsed text blocks
  const [editingIndex, setEditingIndex] = useState(null); // Track editing index
  const [isEditing, setIsEditing] = useState(false); // Editing state
  const newBlockRef = useRef(null); // Ref for focusing new blocks

  // Fetch data and parse content
  useEffect(() => {
    getRequest(ENDPOINTS.CARDS.DETAIL('c65a1197-7a05-4519-84d2-309d3514785c'))
      .then((data) => {
        const content = data.versions[0].contents[0].content || ''; // Fallback to empty string
        setNoteContent(content); // Set raw content
        const parsedBlocks = parseTextBlocks(noteContent); // Parse blocks
        setBlocks(parsedBlocks); // Set parsed blocks
      })
      .catch((error) => {
        console.error('Error fetching card data:', error);
        setNoteContent('Empty section'); // Graceful fallback
        setBlocks([]); // Default to empty blocks
      });
  }, [noteContent]); // Empty dependency array ensures this runs only once

  // Add a new empty block and switch to edit mode
  const addNewBlock = () => {
    if (isEditing) return; // Prevent adding if editing is active

    setBlocks((prevBlocks) => [...prevBlocks, '']); // Add empty block
    setEditingIndex(blocks.length); // Focus on the new block

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
      // Update block content
      updatedBlocks[index] = text;
    }
    setBlocks(updatedBlocks);
    setEditingIndex(null); // Exit edit mode
    setIsEditing(false); // Mark editing as false
  };

  // Handle click outside to add a new block
  const handlePageClick = (e) => {
    // Check if the click happened directly on the page (not inside a block or input field)
    const isClickOutside = e.target === e.currentTarget;

    // Prevent adding a new block if:
    // 1. Editing is active, or
    // 2. The click is inside a block (e.target is not the notion-page div)
    if (isEditing || !isClickOutside) return;

    addNewBlock(); // Add a new block only when clicking outside
  };

  return (
    <div className="notion-page" onClick={handlePageClick}>
      {blocks.map((block, index) => (
        <TextBlockMain
          key={index}
          initialText={block.content}
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
