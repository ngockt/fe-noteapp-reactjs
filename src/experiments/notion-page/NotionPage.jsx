import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Import UUID for unique IDs
import TextBlockMain from './TextBlockMain';
import { parseTextBlocks } from './TextBlockParse';
import { getRequest } from 'apis/services';
import './NotionPage.css';
import ENDPOINTS from 'apis/endpoints';

const NotionPage = () => {
  const [blocks, setBlocks] = useState([]); // Use blocks directly with UUIDs
  const [editingId, setEditingId] = useState(null); // Track the editing block's ID
  const [menuBlock, setMenuBlock] = useState({ id: null, x: 0, y: 0 }); // Menu block state
  const newBlockRef = useRef(null); // Ref for focusing new blocks

  // Fetch and parse content
  useEffect(() => {
    getRequest(ENDPOINTS.CARDS.DETAIL('c65a1197-7a05-4519-84d2-309d3514785c'))
      .then((data) => {
        const content = data.versions[0].contents[0].content || '';
        const parsedBlocks = parseTextBlocks(content).map((block) => ({
          ...block,
          id: uuidv4(), // Assign a unique ID to each block
        }));
        setBlocks(parsedBlocks); // Update blocks with UUIDs
      })
      .catch((error) => {
        console.error('Error fetching card data:', error);
        setBlocks([]); // Default to empty blocks
      });
  }, []); // Fetch on component mount

  // Add a new block
  const addNewBlock = (id, position = 'below') => {
    const newBlock = { id: uuidv4(), type: 'markdown', content: '' };
    const index = blocks.findIndex((block) => block.id === id);
    const updatedBlocks = [...blocks];

    // Insert new block based on position
    if (position === 'above') {
      updatedBlocks.splice(index, 0, newBlock);
    } else {
      updatedBlocks.splice(index + 1, 0, newBlock);
    }

    setBlocks(updatedBlocks);
    setEditingId(newBlock.id); // Focus on new block

    setTimeout(() => {
      if (newBlockRef.current) {
        newBlockRef.current.focus();
      }
    }, 0);
  };

  // Delete a block
  const deleteBlock = (id) => {
    const updatedBlocks = blocks.filter((block) => block.id !== id);
    setBlocks(updatedBlocks);
    setMenuBlock({ id: null, x: 0, y: 0 }); // Hide menu
  };

  // Save block content
  const saveBlock = (id, content, type = 'markdown') => {
    const updatedBlocks = blocks.map((block) =>
      block.id === id ? { ...block, content, type } : block
    );

    // Remove block if content is empty
    const filteredBlocks = updatedBlocks.filter(
      (block) => block.content.trim() !== ''
    );

    setBlocks(filteredBlocks);
    setEditingId(null);
  };

  // Handle context menu (right-click)
  const handleContextMenu = (e, blockId) => {
    e.preventDefault(); // Prevent the default right-click menu
    setMenuBlock({ id: blockId, x: e.pageX, y: e.pageY });
  };

  // Hide menu when clicking elsewhere
  const handleClickOutside = () => {
    setMenuBlock({ id: null, x: 0, y: 0 });
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="notion-page">
      {blocks.map((block) => (
        <div
          key={block.id}
          className="block-container"
          onContextMenu={(e) => handleContextMenu(e, block.id)} // Right-click to show menu
        >
          {/* Block Content */}
          <TextBlockMain
            initialContent={block.content}
            initialType={block.type}
            isEditing={editingId === block.id}
            onSave={(content, type) => saveBlock(block.id, content, type)}
            onFocus={() => setEditingId(block.id)}
            onBlur={() => setEditingId(null)}
            ref={editingId === block.id ? newBlockRef : null}
          />
        </div>
      ))}

      {/* Context Menu */}
      {menuBlock.id && (
        <div
          className="menu-block-options"
          style={{ top: menuBlock.y, left: menuBlock.x, position: 'absolute' }}
        >
          <button onClick={() => addNewBlock(menuBlock.id, 'above')}>+ Above</button>
          <button onClick={() => addNewBlock(menuBlock.id, 'below')}>+ Below</button>
          <button onClick={() => deleteBlock(menuBlock.id)}>🗑️ Delete</button>
        </div>
      )}
    </div>
  );
};

export default NotionPage;
