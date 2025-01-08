import React, { useState, useRef, useEffect } from 'react';
import TextBlockMain from './TextBlockMain'; // Supports editing and saving
import { parseTextBlocks } from './TextBlockParse'; // Parse blocks into content and type
import { getRequest } from 'apis/services';
import './NotionPage.css';
import ENDPOINTS from 'apis/endpoints';

const NotionPage = () => {
  const [noteContent, setNoteContent] = useState(''); // Raw content
  const [blocks, setBlocks] = useState([]); // Parsed blocks
  const [editingIndex, setEditingIndex] = useState(null); // Track which block is being edited
  const [isEditing, setIsEditing] = useState(false); // Editing state
  const newBlockRef = useRef(null); // Ref for focusing new blocks

  // Fetch and parse content
  useEffect(() => {
    getRequest(ENDPOINTS.CARDS.DETAIL('c65a1197-7a05-4519-84d2-309d3514785c'))
      .then((data) => {
        const content = data.versions[0].contents[0].content || ''; // Fallback to empty string
        setNoteContent(content); // Store raw content
        const parsedBlocks = parseTextBlocks(noteContent); // Parse blocks into content + type
        setBlocks(parsedBlocks); // Update parsed blocks
      })
      .catch((error) => {
        console.error('Error fetching card data:', error);
        setNoteContent('Empty section'); // Graceful fallback
        setBlocks([]); // Default to empty blocks
      });
  }, []); // Run only once on component mount

  // Add a new empty block
  const addNewBlock = () => {
    if (isEditing) return; // Prevent adding if editing is active
    setBlocks((prevBlocks) => [...prevBlocks, { type: 'markdown', content: '' }]); // Add empty markdown block
    setEditingIndex(blocks.length); // Focus on new block

    setTimeout(() => {
      if (newBlockRef.current) {
        newBlockRef.current.focus();
      }
    }, 0);
  };

  // Save a block's content and type
  const saveBlock = (index, content, type = 'markdown') => {
    const updatedBlocks = [...blocks];
    if (content.trim() === '') {
      updatedBlocks.splice(index, 1); // Remove block if empty
    } else {
      updatedBlocks[index] = { content, type }; // Update block content and type
    }
    setBlocks(updatedBlocks);
    setEditingIndex(null); // Exit edit mode
    setIsEditing(false); // Mark editing as false
  };


  return (
    <div className="notion-page">
      {blocks.map((block, index) => (
        <TextBlockMain
          key={index}
          initialContent={block.content} // Pass content
          initialType={block.type} // Pass type
          isEditing={editingIndex === index}
          onSave={(content, type) => saveBlock(index, content, type)}
          onFocus={() => setIsEditing(true)}
          onBlur={() => setIsEditing(false)}
          ref={index === blocks.length - 1 ? newBlockRef : null}
        />
      ))}
      {/* Empty space for adding a new block */}
      <div
        style={{ height: '50px', cursor: 'text' }}
        onClick={addNewBlock}
      ></div>
    </div>
  );
};

export default NotionPage;
