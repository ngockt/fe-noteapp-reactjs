import React, { useState, useEffect, useRef } from 'react';
import ContentRender from './ContentRender'; // Import the renderer
import './TextBlock.css'; // Custom styles

const TextBlock = ({ initialText }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState(initialText);
    const textareaRef = useRef(null); // Reference for textarea

    // Automatically resize textarea height to match content
    const adjustTextareaHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto'; // Reset height to auto
            textarea.style.height = `${textarea.scrollHeight}px`; // Set to scrollHeight
        }
    };

    // Trigger resize when text changes
    useEffect(() => {
        if (isEditing) {
            adjustTextareaHeight();
        }
    }, [text, isEditing]);

    const handleTextClick = () => {
        setIsEditing(true);
    };

    const handleInputChange = (e) => {
        setText(e.target.value);
        adjustTextareaHeight(); // Adjust height on input
    };

    const handleInputBlur = () => {
        setIsEditing(false);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            setIsEditing(false);
        }
    };

    return isEditing ? (
        <textarea
            ref={textareaRef} // Reference to textarea
            value={text}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyPress}
            autoFocus
            className="text-input"
        />
    ) : (
        <div onClick={handleTextClick} className="text-display">
            {/* Render the ContentRender component */}
            <ContentRender content={text} />
        </div>
    );
};

export default TextBlock;
