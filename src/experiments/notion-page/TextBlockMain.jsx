import React, { useState, useEffect, useRef, forwardRef, useCallback } from 'react';
import TextBlockRender from './TextBlockRender';
import './TextBlock.css';

const TextBlockMain = forwardRef(
    ({ initialContent, initialType = 'markdown', isEditing: initialEditing = false, onSave, onFocus, onBlur }, ref) => {
        const [isEditing, setIsEditing] = useState(initialEditing);
        const [content, setContent] = useState(initialContent);
        const [type, setType] = useState(initialType); // Track block type
        const textareaRef = useRef(null);

        // Adjust textarea height
        const adjustTextareaHeight = () => {
            const textarea = textareaRef.current;
            if (textarea) {
                textarea.style.height = 'auto';
                textarea.style.height = `${textarea.scrollHeight}px`;
            }
        };

        // Resize when text changes or entering edit mode
        useEffect(() => {
            if (isEditing) adjustTextareaHeight();
        }, [content, isEditing]);

        // Focus the textarea when entering edit mode
        useEffect(() => {
            if (isEditing && textareaRef.current) {
                textareaRef.current.focus();
                if (onFocus) onFocus(); // Notify parent
            }
        }, [isEditing, onFocus]);

        // Handle saving changes
        const handleSave = () => {
            onSave(content, type); // Save content and type
            setIsEditing(false);
            if (onBlur) onBlur(); // Notify parent
        };

        // // Handle Enter key
        const handleKeyPress = (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                e.preventDefault();
                handleSave();
            }
        };

        return isEditing ? (
            // Editing mode with textarea
            <textarea
                ref={(el) => {
                    textareaRef.current = el;
                    if (typeof ref === 'function') ref(el);
                    else if (ref) ref.current = el;
                }}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyPress}
                autoFocus
                className="text-input"
            />
        ) : (
            // Display mode using TextBlockRender
            <div onDoubleClick={() => setIsEditing(true)} className="text-display">
                <TextBlockRender content={content} type={type} />
            </div>
        );
    }
);

TextBlockMain.displayName = 'TextBlockMain';

export default TextBlockMain;
