import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { FiSave, FiArrowLeft, FiPlus } from 'react-icons/fi';
import 'katex/dist/katex.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { v4 as uuidv4 } from 'uuid';

const Line = ({
  content,
  onDoubleClick,
  isEditing,
  onChange,
  onBlur,
  caretPosition,
  onEnter,
  onDelete
}) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      if (caretPosition !== null) {
        textareaRef.current.setSelectionRange(caretPosition, caretPosition);
      }
    }
  }, [isEditing, caretPosition]);

  const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
          e.preventDefault(); // Prevent adding a new line in the textarea
          onEnter();
      }
      if (e.key === "Backspace" && content === '') {
          e.preventDefault(); // Prevent cursor from going back a line.
          onDelete();
      }
  }


  return isEditing ? (
    <textarea
      ref={textareaRef}
      value={content}
      onChange={onChange}
      onBlur={onBlur}
      onKeyDown={handleKeyDown}
      className="form-control"
      style={{ minHeight: '30px', height: 'auto', width: '100%', overflow: 'hidden'}}
    />
  ) : (
    <div
      onDoubleClick={onDoubleClick}
      style={{ cursor: 'pointer', padding: '5px', borderBottom: '1px solid #ddd' }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};


const NotionPage = ({ onSave, onCloseEditor }) => {
  const [blocks, setBlocks] = useState([]);
  const [currentBlockId, setCurrentBlockId] = useState(null);
  const [editingLine, setEditingLine] = useState(null);
  const [caretPosition, setCaretPosition] = useState(null);

  const handleAddBlock = () => {
    const newBlock = { id: uuidv4(), content: [''] };
    setBlocks([...blocks, newBlock]);
    setCurrentBlockId(newBlock.id);
  };

   const handleAddLine = (blockId, lineIndex) => {
     setBlocks(blocks.map(block => {
         if (block.id === blockId) {
           const updatedContent = [...block.content];
             updatedContent.splice(lineIndex+1, 0, '');
             return {...block, content: updatedContent};
         }
         return block;
     }));
     setEditingLine(lineIndex + 1);
     setCurrentBlockId(blockId);
     setCaretPosition(0);

   }

   const handleDeleteLine = (blockId, lineIndex) => {
      if (blocks.length === 1 && blocks[0].content.length === 1) return;
      setBlocks(blocks.map(block => {
          if (block.id === blockId) {
              const updatedContent = [...block.content];
              if (updatedContent.length > 1) {
                updatedContent.splice(lineIndex, 1);
                return {...block, content: updatedContent};
              }
              else {
                  // Delete the whole block, if there is only one line
                  return null;
              }

          }
          return block;
      }).filter(block => block !== null));
       setEditingLine(null);
       setCurrentBlockId(null);
       setCaretPosition(null);

   }


  const handleDoubleClickLine = (blockId, lineIndex, content, clickEvent) => {
    setCurrentBlockId(blockId);
    setEditingLine(lineIndex);

    const clickX = clickEvent.clientX;
    const clickY = clickEvent.clientY;

    const targetElement = clickEvent.target;
    const textContent = targetElement.innerText;

    const range = document.createRange();
    range.setStart(targetElement.firstChild || targetElement, 0);
    range.setEnd(targetElement.firstChild || targetElement, textContent.length);

    const rects = range.getClientRects();
    let caretIndex = 0;

    Array.from(rects).forEach(rect => {
      if (clickY >= rect.top && clickY <= rect.bottom) {
        const relativeX = clickX - rect.left;
        const charWidth = rect.width / textContent.length;
        caretIndex += Math.floor(relativeX / charWidth);
      }
    });

    setCaretPosition(Math.min(caretIndex, textContent.length));
  };

 const handleLineChange = (blockId, lineIndex, e) => {
        setBlocks(blocks.map(block => {
            if (block.id === blockId) {
                const updatedContent = [...block.content];
                updatedContent[lineIndex] = e.target.value;
                return {...block, content: updatedContent}
            }
           return block;
        }));
    };


  const handleLineBlur = () => {
    setEditingLine(null);
    setCaretPosition(null);
  };

  const handleSave = () => {
    onSave(blocks);
  };

  return (
    <div className="notion-page-container">
      <div className="content-container">
        {blocks.map(block => (
          <div key={block.id} className="block border rounded p-2 mb-2">
            {block.content.map((line, index) => (
              <Line
                key={index}
                content={line}
                onDoubleClick={(e) => handleDoubleClickLine(block.id, index, line, e)}
                isEditing={currentBlockId === block.id && editingLine === index}
                onChange={(e) => handleLineChange(block.id, index, e)}
                onBlur={handleLineBlur}
                caretPosition={currentBlockId === block.id && editingLine === index ? caretPosition : null}
                onEnter={() => handleAddLine(block.id, index)}
                onDelete={() => handleDeleteLine(block.id, index)}
              />
            ))}
          </div>
        ))}
        <div className="add-block-container mt-3">
          <button className="btn btn-primary" onClick={handleAddBlock}>
            <FiPlus />
          </button>
        </div>
      </div>
      <div className="d-flex gap-2 mt-3 justify-content-end">
        <button onClick={handleSave} className="btn btn-success btn-sm">
          <FiSave className="me-1" />
          Save All
        </button>
        {onCloseEditor && (
          <button onClick={onCloseEditor} className="btn btn-secondary btn-sm">
            <FiArrowLeft className="me-1" />
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default NotionPage;