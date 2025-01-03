import React, { useState, useCallback, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './NotionPage.css';
import { DndProvider, useDrop, useDrag } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { v4 as uuidv4 } from 'uuid';
import { FiEdit, FiPlus, FiTrash2 } from 'react-icons/fi';

const NotionPage = () => {
  const [blocks, setBlocks] = useState([
    { type: 'heading', level: 1, id: uuidv4(), text: 'My Notion-like Page' },
    { type: 'paragraph', id: uuidv4(), text: 'This is a sample paragraph with some text.' },
    {
      type: 'list',
      listType: 'bullet',
      id: uuidv4(),
      items: ['First list item', 'Second list item', 'Third list item'],
    },
    { type: 'code', language: 'javascript', id: uuidv4(), code: 'console.log("Hello World!");' },
    {
      type: 'image',
      src: 'https://placekitten.com/200/150',
      id: uuidv4(),
      alt: 'Cute Kitten',
    },
  ]);

  const [hoveredBlock, setHoveredBlock] = useState(null);
  const handleMouseEnter = (id) => setHoveredBlock(id);
  const handleMouseLeave = () => setHoveredBlock(null);


  const addBlock = (type, options = {}) => {
    const newBlock = {
      type,
      id: uuidv4(),
      ...options,
      text: options.text || (type === 'paragraph' ? 'New paragraph' : ''),
    };
    setBlocks([...blocks, newBlock]);
  };


  const deleteBlock = (id) => {
    setBlocks(blocks.filter((block) => block.id !== id));
  };


  const updateTextBlock = (id, newText) => {
    setBlocks(
      blocks.map((block) => {
        if (block.id === id && (block.type === 'paragraph' || block.type === 'heading')) {
          return { ...block, text: newText };
        }
        return block;
      })
    );
  };

  const updateListItem = (blockId, itemId, newItemText) => {
    setBlocks(blocks.map(block => {
      if (block.id === blockId && block.type === 'list') {
        return {
          ...block,
          items: block.items.map((item, index) => index === itemId ? newItemText : item),
        };
      }
      return block;
    }));
  };

  const addListItem = (blockId) => {
    setBlocks(blocks.map(block => {
      if (block.id === blockId && block.type === 'list') {
        return { ...block, items: [...block.items, 'New Item'] }
      }
      return block;
    }))
  }


  const deleteListItem = (blockId, itemId) => {
    setBlocks(blocks.map(block => {
      if (block.id === blockId && block.type === 'list') {
        return { ...block, items: block.items.filter((_, index) => index !== itemId) };
      }
      return block;
    })
    )
  };


  const moveBlock = useCallback((dragIndex, hoverIndex) => {
    const dragBlock = blocks[dragIndex];
    const newBlocks = [...blocks];
    newBlocks.splice(dragIndex, 1);
    newBlocks.splice(hoverIndex, 0, dragBlock);
    setBlocks(newBlocks);
  }, [blocks, setBlocks]);


  const renderBlock = (block, index) => {
    switch (block.type) {
      case 'heading':
        const HeadingTag = `h${block.level}`;
        return (
          <DraggableBlock key={block.id} index={index} id={block.id} moveBlock={moveBlock}>
            <div
              className="card block-container"
              onMouseEnter={() => handleMouseEnter(block.id)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="card-body d-flex justify-content-between align-items-center">
                <HeadingTag
                  contentEditable
                  onBlur={(e) => updateTextBlock(block.id, e.target.innerText)}
                  suppressContentEditableWarning
                >
                  {block.text}
                </HeadingTag>
                {hoveredBlock === block.id && (
                  <div className="block-icons">
                    <FiTrash2
                      onClick={() => deleteBlock(block.id)}
                      className="icon delete-icon"
                    />
                  </div>
                )}
              </div>
            </div>
          </DraggableBlock>
        );
      case 'paragraph':
        return (
          <DraggableBlock key={block.id} index={index} id={block.id} moveBlock={moveBlock}>
            <div
              className="card block-container"
              onMouseEnter={() => handleMouseEnter(block.id)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="card-body d-flex justify-content-between align-items-center">
                <p
                  contentEditable
                  onBlur={(e) => updateTextBlock(block.id, e.target.innerText)}
                  suppressContentEditableWarning
                >
                  {block.text}
                </p>
                {hoveredBlock === block.id && (
                  <div className="block-icons">
                    <FiTrash2
                      onClick={() => deleteBlock(block.id)}
                      className="icon delete-icon"
                    />
                  </div>
                )}
              </div>
            </div>
          </DraggableBlock>
        );
      case 'list':
        const ListTag = block.listType === 'bullet' ? 'ul' : 'ol';
        return (
          <DraggableBlock key={block.id} index={index} id={block.id} moveBlock={moveBlock}>
            <div
              className="card block-container"
              onMouseEnter={() => handleMouseEnter(block.id)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="card-body d-flex justify-content-between align-items-center">
                <ListTag>
                  {block.items.map((item, i) => (
                    <li key={i} className='d-flex align-items-center justify-content-between'>
                      <span
                        contentEditable
                        onBlur={(e) => updateListItem(block.id, i, e.target.innerText)}
                        suppressContentEditableWarning
                      >
                        {item}
                      </span>
                      {hoveredBlock === block.id && (
                        <div className='list-buttons'>
                          <FiTrash2 onClick={() => deleteListItem(block.id, i)} className='icon delete-item-icon' />
                        </div>
                      )}
                    </li>
                  ))}
                </ListTag>
                {hoveredBlock === block.id && (
                  <div className="list-buttons">
                    <FiPlus onClick={() => addListItem(block.id)} className='icon add-item-icon' />
                    <FiTrash2 onClick={() => deleteBlock(block.id)} className='icon delete-icon' />
                  </div>
                )}
              </div>
            </div>
          </DraggableBlock>
        );
      case 'code':
        return (
          <DraggableBlock key={block.id} index={index} id={block.id} moveBlock={moveBlock}>
            <div
              className="card block-container"
              onMouseEnter={() => handleMouseEnter(block.id)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="card-body d-flex justify-content-between align-items-center">
                <pre className='flex-grow-1'>
                  <code className={`language-${block.language}`}>{block.code}</code>
                </pre>
                {hoveredBlock === block.id && (
                  <div className="block-icons">
                    <FiTrash2
                      onClick={() => deleteBlock(block.id)}
                      className="icon delete-icon"
                    />
                  </div>
                )}
              </div>
            </div>
          </DraggableBlock>
        );
      case 'image':
        return (
          <DraggableBlock key={block.id} index={index} id={block.id} moveBlock={moveBlock}>
            <div
              className="card block-container"
              onMouseEnter={() => handleMouseEnter(block.id)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="card-body d-flex justify-content-between align-items-center">
                <img src={block.src} alt={block.alt} />
                {hoveredBlock === block.id && (
                  <div className="block-icons">
                    <FiTrash2
                      onClick={() => deleteBlock(block.id)}
                      className="icon delete-icon"
                    />
                  </div>
                )}
              </div>
            </div>
          </DraggableBlock>
        );
      default:
        return <div key={index}>Unsupported block type</div>;
    }
  };


  return (
    <DndProvider backend={HTML5Backend}>
      <div className="notion-page">
        {blocks.map((block, index) => renderBlock(block, index))}
        <div className="mt-3">
          <div className="dropdown">
            <button className="btn btn-secondary dropdown-toggle" type="button" id="addBlockDropdown" data-bs-toggle="dropdown" aria-expanded="false">
              Add
            </button>
            <ul className="dropdown-menu" aria-labelledby="addBlockDropdown">
              <li><button className="dropdown-item" onClick={() => addBlock('heading', { level: 2 })}>Add Heading</button></li>
              <li><button className="dropdown-item" onClick={() => addBlock('paragraph')}>Add Paragraph</button></li>
              <li><button className="dropdown-item" onClick={() => addBlock('list')}>Add List</button></li>
              <li><button className="dropdown-item" onClick={() => addBlock('code')}>Add Code Block</button></li>
            </ul>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};



const DraggableBlock = ({ id, index, moveBlock, children }) => {
  const ref = useRef(null);


  const [, drop] = useDrop({
    accept: 'block',
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      moveBlock(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });
  const [{ isDragging }, drag] = useDrag({
    type: 'block',
    item: () => {
      return { id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  drag(drop(ref));

  return (
    <div ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }}>
      {children}
    </div>
  );
};


export default NotionPage;