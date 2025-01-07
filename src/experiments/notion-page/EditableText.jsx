import React, { useState } from 'react';
import Markdown from 'markdown-to-jsx';
import './EditableText.css';

const EditableText = ({ initialText }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState(initialText);

    const handleTextClick = () => {
        setIsEditing(true);
    };

    const handleInputChange = (e) => {
        setText(e.target.value);
    };

    const handleInputBlur = () => {
        setIsEditing(false);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            setIsEditing(false);
        }
    };

    return isEditing ? (
        <textarea
            value={text}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyPress={handleKeyPress}
            autoFocus
            className="editable-input"
        />
    ) : (
        <div onClick={handleTextClick} className="editable-markdown">
            <Markdown>{text}</Markdown>
        </div>
    );
};

export default EditableText;
