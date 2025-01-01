// NotionPage.jsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import {
  FiSave,
  FiArrowLeft,
  FiUpload,
  FiEdit,
  FiPlus,
  FiTrash2
} from 'react-icons/fi';

import 'katex/dist/katex.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { v4 as uuidv4 } from 'uuid'; // For generating UUIDs

import Mermaid from 'components/contents/rendering/Mermaid';
import PlantUML from 'components/contents/rendering/PlantUML';
import './NotionPage.css'; // Import the CSS file

const NotionPage = ({ initialContent = '', onSave, onCloseEditor }) => {
  const [blocks, setBlocks] = useState(() => {
    // Initialize with a single block if initialContent is provided
    if (initialContent) {
      return [{ id: uuidv4(), content: initialContent }];
    }
    return [{ id: uuidv4(), content: '' }];
  });
  const [imageMap, setImageMap] = useState({});
  const fileInputRef = useRef(null);
  const [editingBlock, setEditingBlock] = useState(null);
  const [tempBlockContent, setTempBlockContent] = useState('');
  const [hoveredBlock, setHoveredBlock] = useState(null);
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    blockId: null,
    lineIndex: null,
    lineContent: null,
  });
  const hoverTimeout = useRef(null);
  const textareaRef = useRef(null);

  // -------------------------------------------------------------------
  // 7.1) PASTE IMAGE HANDLER (store image in state as base64)
  // -------------------------------------------------------------------
  const handlePaste = async (e) => {
    const files = e.clipboardData?.files || (e.target?.files ? Array.from(e.target.files) : []);

    if (files.length > 0) {
      const file = files[0];
      if (file && file.type.startsWith('image/')) {
        e.preventDefault();

        // Generate a UUID for the image
        const imageUUID = uuidv4();

        // Read the file as a Data URL
        const reader = new FileReader();
        reader.onload = (loadEvent) => {
          const dataURL = loadEvent.target.result;

          // 1) Store the Data URL in state
          setImageMap(prev => ({...prev, [imageUUID]: dataURL}));

          // 2) Insert a Markdown reference using the custom `ls://<UUID>` syntax
          const markdownRef = `![Pasted Image](${imageUUID})\n`;

          // 3) Update the editor content with the new Markdown reference
          setBlocks(prevBlocks => {
            const updatedBlocks = [...prevBlocks];
            if (editingBlock !== null) {
              const blockIndex = updatedBlocks.findIndex(block => block.id === editingBlock);
              if (blockIndex !== -1) {
                updatedBlocks[blockIndex].content += markdownRef;
              }
            } else {
              updatedBlocks[updatedBlocks.length - 1].content += markdownRef;
            }
            return updatedBlocks;
          });
        };

        reader.readAsDataURL(file);
      }
    }
    if (e.target?.files) {
      // Clear the file input after processing
      e.target.value = null;
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleBlockEdit = (id, blockContent) => {
    setEditingBlock(id); // Set the block as being edited
    setTempBlockContent(blockContent); // Load the block's content for editing
    setContextMenu({ ...contextMenu, visible: false }); // Close context menu
  };

  const handleLineEdit = (blockId, lineIndex, lineContent) => {
    setEditingBlock(blockId); // Set the block ID as being edited
    setTempBlockContent(lineContent); // Load the specific line's content for editing
    setContextMenu({ ...contextMenu, visible: false }); // Close context menu
  };
  const handleBlockChange = (e) => {
    setTempBlockContent(e.target.value);
  };

  const handleBlockBlur = () => {
    if (editingBlock !== null) {
      setBlocks(prevBlocks => {
        return prevBlocks.map(block => {
          if (block.id === editingBlock) {
            return { ...block, content: tempBlockContent };
          }
          return block;
        });
      });
      setEditingBlock(null);
    }
  };

  const handleLineBlur = () => {
    if (editingBlock !== null && contextMenu.lineIndex !== null) {
      setBlocks(prevBlocks => {
        const updatedBlocks = [...prevBlocks];
        const blockIndex = updatedBlocks.findIndex(block => block.id === editingBlock);
        if (blockIndex !== -1) {
          const lines = updatedBlocks[blockIndex].content.split('\n');
          lines[contextMenu.lineIndex] = tempBlockContent; // Update the specific line's content
          updatedBlocks[blockIndex] = { ...updatedBlocks[blockIndex], content: lines.join('\n') };
        }
        return updatedBlocks;
      });
      setEditingBlock(null); // Clear editing state
      setContextMenu({ ...contextMenu, lineIndex: null, lineContent: null, visible: false });
    } else {
      handleBlockBlur(); // If no specific line is edited, save the whole block
    }
  };
  const handleBlockSave = () => {
    handleBlockBlur();
  };

  const handleAddBlock = () => {
    setBlocks(prevBlocks => [...prevBlocks, { id: uuidv4(), content: '' }]);
  };

  const handleBlockDelete = (id) => {
    setBlocks(prevBlocks => prevBlocks.filter(block => block.id !== id));
    setHoveredBlock(null);
    setContextMenu({ ...contextMenu, visible: false });
  };

  const handleBlockMouseEnter = (id) => {
    hoverTimeout.current = setTimeout(() => {
      setHoveredBlock(id);
    }, 300); // Delay of 300ms
  };

  const handleBlockMouseLeave = () => {
    clearTimeout(hoverTimeout.current);
    setHoveredBlock(null);
  };

  const handleBlockContextMenu = (e, id, blockContent) => {
    e.preventDefault();
    const lines = blockContent.split('\n');
    const lineHeight = 20; // Approximate line height
    const lineIndex = Math.floor((e.clientY - e.target.offsetTop) / lineHeight);
    let lineContent = null;
    if (lineIndex >= 0 && lineIndex < lines.length) {
      lineContent = lines[lineIndex];
    }
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      blockId: id,
      lineIndex: lineIndex >= 0 && lineIndex < lines.length ? lineIndex : null,
      lineContent: lineContent,
    });
  };

  const handleContextMenuClose = () => {
    setContextMenu({ ...contextMenu, visible: false });
  };

  useEffect(() => {
    document.addEventListener('click', handleContextMenuClose);
    return () => {
      document.removeEventListener('click', handleContextMenuClose);
    };
  }, []);

  useEffect(() => {
    if (editingBlock && textareaRef.current) {
      const screenHeight = window.innerHeight;
      textareaRef.current.style.maxHeight = `${screenHeight * 0.3}px`;
    }
  }, [editingBlock]);

  // -------------------------------------------------------------------
  // 8) Markdown & code block rendering
  // -------------------------------------------------------------------
  const preprocessContent = (text) =>
    text
      .replace(/\\\(/g, '$')
      .replace(/\\\)/g, '$')
      .replace(/\\\[/g, '$$')
      .replace(/\\\]/g, '$$');

  // Custom image renderer
  const ImageRenderer = ({ src, alt }) => {
    const dataURL = imageMap[src] || '';
    return dataURL ? <img src={dataURL} alt={alt} style={{maxWidth: '100%'}} /> : null;
  };

  // You can still add custom renderers for code blocks (mermaid, plantuml, etc.)
  const MarkdownComponents = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      if (match) {
        switch (match[1]) {
          case 'mermaid':
            return <Mermaid chart={String(children).replace(/\n$/, '')} />;
          case 'plantuml':
            return <PlantUML content={String(children).replace(/\n$/, '')} />;
          default:
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
        }
      }
      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
    img: ImageRenderer, // Use the custom image renderer
  };

  // -------------------------------------------------------------------
  // 9) Final Save
  // -------------------------------------------------------------------
  const handleSave = () => {
    const allContent = blocks.map(block => block.content).join('\n');
    onSave(allContent);
    if (onCloseEditor) onCloseEditor();
  };

  const handleCancel = () => {
    if (onCloseEditor) onCloseEditor();
  };

  return (
    <div className="notion-page-container">
      <div className="editor-preview-container">
        <div className="content-container">
          {blocks.map((block, index) => (
            <div
              key={block.id}
              className={`block border rounded p-2 mb-2 ${editingBlock === block.id ? 'editing' : ''}`}
              onMouseEnter={() => handleBlockMouseEnter(block.id)}
              onMouseLeave={handleBlockMouseLeave}
              onContextMenu={(e) => handleBlockContextMenu(e, block.id, block.content)}
            >
              {editingBlock === block.id ? (
                <div className="inline-editor">
                  <textarea
                    ref={textareaRef}
                    value={tempBlockContent}
                    onChange={handleBlockChange}
                    onBlur={handleLineBlur}
                    onKeyDown={(e) => {if (e.key === 'Enter') handleBlockSave()}}
                    className="inline-textarea"
                    autoFocus
                  />
                  <div className="d-flex gap-2 mt-2 justify-content-end">
                    <button onClick={handleBlockSave} className="btn btn-success btn-sm">
                      <FiSave className="me-1" />
                      Save
                    </button>
                    <button onClick={handleLineBlur} className="btn btn-secondary btn-sm">
                      <FiArrowLeft className="me-1" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rendered-block">
                  <ReactMarkdown
                    components={MarkdownComponents}
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                  >
                    {preprocessContent(block.content)}
                  </ReactMarkdown>
                  {hoveredBlock === block.id && (
                    <div className="block-options">
                      <button
                        className="edit-button"
                        onClick={() => handleBlockEdit(block.id, block.content)}
                      >
                        <FiEdit />
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => handleBlockDelete(block.id)}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          <div className="add-block-container">
            <button className="add-block-button" onClick={handleAddBlock}>
              <FiPlus />
            </button>
          </div>
        </div>
        <div className="d-flex justify-content-end mt-1">
          <button
            onClick={handleUploadClick}
            className="btn btn-light btn-sm"
            aria-label="Upload Image"
          >
            <FiUpload />
          </button>
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={handlePaste}
          />
        </div>
      </div>
      <div className="d-flex gap-2 mt-3 justify-content-end">
        <button onClick={handleSave} className="btn btn-success btn-sm">
          <FiSave className="me-1" />
          Save
        </button>
        <button onClick={handleCancel} className="btn btn-secondary btn-sm">
          <FiArrowLeft className="me-1" />
          Cancel
        </button>
      </div>
      {contextMenu.visible && (
        <div
          className="context-menu"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button
            className="context-menu-item"
            onClick={() => handleBlockEdit(contextMenu.blockId, contextMenu.blockContent)}
          >
            <FiEdit /> Edit Block
          </button>
          <button
            className="context-menu-item"
            onClick={() => handleBlockDelete(contextMenu.blockId)}
          >
            <FiTrash2 /> Delete Block
          </button>
          {contextMenu.lineIndex !== null && (
            <button
              className="context-menu-item"
              onClick={() => handleLineEdit(contextMenu.blockId, contextMenu.lineIndex, contextMenu.lineContent)}
            >
              <FiEdit /> Edit Line
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default NotionPage;