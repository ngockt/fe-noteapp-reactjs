import React, { useState, useEffect, useRef, forwardRef, useCallback } from 'react';
import TextBlockRender from './TexBlockRender';
import './TextBlock.css';

// Use forwardRef to handle refs properly
const TextBlockMain = forwardRef(({
    initialText,
    isEditing: initialEditing = false,
    onSave,
    onFocus: parentOnFocus,
    onBlur // New prop to handle blur
}, ref) => {
    const [isEditing, setIsEditing] = useState(initialEditing);
    const [text, setText] = useState(initialText);
    const textareaRef = useRef(null);

    // Memoize the onFocus callback to avoid re-renders
    const onFocus = useCallback(() => {
        if (parentOnFocus) parentOnFocus();
    }, [parentOnFocus]);

    // Auto-resize textarea height
    const adjustTextareaHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    };

    // Resize when text changes or entering edit mode
    useEffect(() => {
        if (isEditing) {
            adjustTextareaHeight();
        }
    }, [text, isEditing]);

    // Focus the textarea when entering edit mode
    useEffect(() => {
        if (isEditing && textareaRef.current) {
            textareaRef.current.focus();
            onFocus(); // Notify parent that editing has started
        }
    }, [isEditing, onFocus]); // Added onFocus as a dependency

    // Handle entering edit mode
    const handleTextClick = () => {
        setIsEditing(true);
        onFocus(); // Notify parent when focused
    };

    // Handle text change
    const handleInputChange = (e) => {
        setText(e.target.value);
        adjustTextareaHeight();
    };

    // Handle save action
    const handleSave = () => {
        const trimmedText = text.trim();
        onSave(trimmedText); // Save changes or remove block if empty
        setIsEditing(false); // Exit edit mode
        if (onBlur) onBlur(); // Notify parent that editing has ended
    };

    // Handle Enter key to save
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSave();
        }
    };

    return isEditing ? (
        // Edit Mode
        <textarea
            ref={(el) => {
                textareaRef.current = el; // Store in local ref
                if (typeof ref === 'function') ref(el); // Forward ref
                else if (ref) ref.current = el;
            }}
            value={text}
            onChange={handleInputChange}
            onBlur={handleSave} // Save on blur
            onKeyDown={handleKeyPress}
            autoFocus
            className="text-input"
        />
    ) : (
        // Display Mode
        <div onClick={handleTextClick} className="text-display">
            <TextBlockRender content={text} />
        </div>
    );
});

// Add display name for debugging
TextBlockMain.displayName = 'TextBlockMain';

export default TextBlockMain;
