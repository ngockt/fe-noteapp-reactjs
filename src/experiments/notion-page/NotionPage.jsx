import React, { useState, useCallback, useRef, useMemo } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './NotionPage.css';
import { DndProvider, useDrop, useDrag } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { v4 as uuidv4 } from 'uuid';
import { FiEdit, FiPlus, FiTrash2, FiUpload } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import Mermaid from 'components/contents/rendering/Mermaid';
import PlantUML from 'components/contents/rendering/PlantUML';


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
  const fileInputRef = useRef(null);

  // PASTE IMAGE HANDLER (store image in state as base64)
  const [imageMap, setImageMap] = useState({});


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

  const handlePaste = async (e, blockId) => {
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
          setImageMap(prev => ({ ...prev, [imageUUID]: dataURL }));

          // 2) Insert a Markdown reference using the custom `ls://<UUID>` syntax
          const markdownRef = `![Pasted Image](${imageUUID})\n`;

          // 3) Update the editor content with the new Markdown reference
          setBlocks((prev) =>
            prev.map((block) => {
              if (block.id === blockId && (block.type === 'paragraph')) {
                const updatedContent = (block.text || '') + markdownRef;
                return { ...block, text: updatedContent };
              }
              return block;
            })
          );
        };

        reader.readAsDataURL(file);
      }
    }
    if (e.target?.files) {
      // Clear the file input after processing
      e.target.value = null;
    }
  };
  const handleUploadClick = (blockId) => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
      fileInputRef.current.blockId = blockId;
    }
  };

  const handleFileChange = async (e) => {
    const blockId = fileInputRef.current?.blockId;
    handlePaste(e, blockId);
    if (fileInputRef.current) {
      fileInputRef.current.blockId = null;
    }
  };


  const preprocessContent = (text) =>
    text
      ?.replace(/\\\(/g, '$')
      .replace(/\\\)/g, '$')
      .replace(/\\\[/g, '$$')
      .replace(/\\\]/g, '$$');

  // Custom image renderer
  const ImageRenderer = ({ src, alt }) => {
    const dataURL = imageMap[src] || '';
    return dataURL ? <img src={dataURL} alt={alt} style={{ maxWidth: '100%' }} /> : null;
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
              <div className="card-body d-flex  align-items-center">
                <div className='flex-grow-1'>
                  <ReactMarkdown
                    components={MarkdownComponents}
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                  >
                    {preprocessContent(block.text)}
                  </ReactMarkdown>
                  {hoveredBlock === block.id && (
                    <div className="d-flex justify-content-end">
                      <button
                        onClick={() => handleUploadClick(block.id)}
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
                        onChange={handleFileChange}
                      />
                    </div>
                  )}
                  {hoveredBlock === block.id && (
                    <div className="block-icons">
                      <FiTrash2
                        onClick={() => deleteBlock(block.id)}
                        className="icon delete-icon"
                      />
                    </div>
                  )}

                </div>
                {hoveredBlock === block.id && (
                  <div className="block-icons">
                    <FiEdit
                      onClick={() => {
                        const newText = prompt('Edit text:', block.text);
                        if (newText !== null) {
                          updateTextBlock(block.id, newText);
                        }
                      }}
                      className="icon edit-icon"
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