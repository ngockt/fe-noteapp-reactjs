import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

const TextEditorContainer = styled.div`
    padding: 20px;
    font-family: sans-serif;
`;

const BlockContainer = styled.div`
    margin-bottom: 20px;
    border: 1px solid #ddd;
    border-radius: 5px;
    cursor: pointer;
    position: relative;
    display: flex;
    flex-direction: column;
    min-height: fit-content;
`;


const BlockInput = styled.div`
    white-space: pre-wrap;
    width: 100%;
    padding: 10px;
    font-size: 1rem;
    border-radius: 3px;
    overflow-wrap: break-word;
    min-height: fit-content;
    border: none;
    outline: none;
    &[contenteditable="true"]{
        border: 1px solid #ddd;
        outline: auto;
    }
`;

const ContextMenu = styled.div`
    position: absolute;
    background-color: white;
    border: 1px solid #ccc;
    padding: 5px 0;
    border-radius: 4px;
    z-index: 10;
    top: ${({ top }) => `${top}px`};
    left: ${({ left }) => `${left}px`};
`;

const ContextMenuItem = styled.div`
    padding: 5px 15px;
    cursor: pointer;
    &:hover {
        background-color: #f0f0f0;
    }
    &.delete {
        color: #dc3545;
        &:hover {
            background-color: #f8d7da;
        }
    }
`;

const AddBlockButton = styled.div`
    background-color: #f0f0f0;
    padding: 15px;
    margin-bottom: 10px;
    text-align: center;
    cursor: pointer;
    border-radius: 5px;
    &:hover {
        background-color: #e0e0e0;
    }
`;

const NotionPage = () => {
  const [textBlocks, setTextBlocks] = useState([]);
  const [editingBlockId, setEditingBlockId] = useState(null);
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, blockId: null });
  const blockRefs = useRef({});


  const addTextBlock = () => {
    const newBlock = { id: uuidv4(), text: '' };
    setTextBlocks([...textBlocks, newBlock]);
    setEditingBlockId(newBlock.id);
  };


  const handleTextChange = (id, newText) => {
    setTextBlocks(
      textBlocks.map((block) => (block.id === id ? { ...block, text: newText } : block))
    );
  };

  const deleteTextBlock = (id) => {
    setTextBlocks(textBlocks.filter((block) => block.id !== id));
    setContextMenu({ ...contextMenu, visible: false });
  };


  const handleSave = (id) => {
    if (blockRefs.current[id]?.textContent.trim() === "") {
      setTextBlocks(textBlocks.filter((block) => block.id !== id));
      return;
    }
    setEditingBlockId(null)
  };

  const handleBlockClick = (id) => {
    setEditingBlockId(id);
  };

  const handleBlockBlur = (id) => {
    handleSave(id);
  }

  const handleContextMenu = (event, blockId) => {
    event.preventDefault();
    setContextMenu({
      visible: true,
      x: event.clientX,
      y: event.clientY,
      blockId: blockId,
    });
  };

  useEffect(() => {
    const handleClickOutside = () => {
      setContextMenu({ ...contextMenu, visible: false });
    };
    if (contextMenu.visible) {
      window.addEventListener('click', handleClickOutside);
    }

    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, [contextMenu.visible]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === 'Enter' && editingBlockId) {
        handleSave(editingBlockId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [editingBlockId]);

  return (
    <TextEditorContainer>
      {textBlocks.map((block) => (
        <BlockContainer
          key={block.id}
          onClick={() => handleBlockClick(block.id)}
          onContextMenu={(event) => handleContextMenu(event, block.id)}
        >
          <BlockInput
            ref={(el) => (blockRefs.current[block.id] = el)}
            contentEditable={editingBlockId === block.id}
            onBlur={() => handleBlockBlur(block.id)}
            onInput={(e) => handleTextChange(block.id, e.target.textContent)}
            suppressContentEditableWarning={true}
          >{block.text}</BlockInput>

          {contextMenu.visible && contextMenu.blockId === block.id && (
            <ContextMenu top={contextMenu.y} left={contextMenu.x}>
              <ContextMenuItem
                className="delete"
                onClick={() => deleteTextBlock(block.id)}
              >
                Delete
              </ContextMenuItem>
            </ContextMenu>
          )}
        </BlockContainer>
      ))}
      <AddBlockButton onClick={addTextBlock}>
        Click to add new block
      </AddBlockButton>
    </TextEditorContainer>
  );
};

export default NotionPage;