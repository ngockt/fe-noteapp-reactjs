import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import Mermaid from './Mermaid';
import 'katex/dist/katex.min.css';
import { FiEdit, FiSave, FiArrowLeft } from 'react-icons/fi';
import './Card.css';
import PlantUML from './PlantUML';

const Card = ({ note, onSave, isNew, onCloseEditor }) => {
    const [isEditing, setIsEditing] = useState(isNew || false); // Open editor if isNew is true
    const [content, setContent] = useState(note.content);

    useEffect(() => {
        if (isNew) {
            setIsEditing(true);
        }
    }, [isNew]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        setIsEditing(false);
        onSave(note.id, content);
        if (onCloseEditor) onCloseEditor(); // Notify parent to close editor for a new card
    };

    const handleCancel = () => {
        setIsEditing(false);
        setContent(note.content);
        if (onCloseEditor) onCloseEditor(); // Notify parent to close editor for a new card
    };

    const MarkdownComponents = {
        code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            if (match && match[1] === 'mermaid') {
                return <Mermaid chart={String(children).replace(/\n$/, '')} />;
            } else if (match && match[1] === 'plantuml') {
                return <PlantUML content={String(children).replace(/\n$/, '')} />;
            }
            return (
                <code className={className} {...props}>
                    {children}
                </code>
            );
        },
    };

    return (
        <div className="card">
            {isEditing ? (
                <div className="editor-preview-container">
                    <div className="editor-container">
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="editor-textarea"
                        />
                        <div className="editor-buttons">
                            <button onClick={handleSave} className="save-button">
                                <FiSave className="icon" />
                                Save
                            </button>
                            <button onClick={handleCancel} className="cancel-button">
                                <FiArrowLeft className="icon" />
                                Cancel
                            </button>
                        </div>
                    </div>

                    <div className="preview-container">
                        <div className="preview-content">
                            <ReactMarkdown
                                components={MarkdownComponents}
                                children={content}
                                remarkPlugins={[remarkMath]}
                                rehypePlugins={[rehypeKatex]}
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <ReactMarkdown
                        components={MarkdownComponents}
                        children={note.content}
                        remarkPlugins={[remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                    />
                    <button onClick={handleEdit} className="edit-button">
                        <FiEdit className="icon" />
                        Edit
                    </button>
                </>
            )}
        </div>
    );
};

export default Card;
