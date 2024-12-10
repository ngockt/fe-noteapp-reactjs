import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import Mermaid from './Mermaid'; // Import the Mermaid component
import 'katex/dist/katex.min.css';
import { FiEdit, FiSave, FiArrowLeft } from 'react-icons/fi';
import './Card.css';

const Card = ({ note, onSave }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState(note.content);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        setIsEditing(false);
        onSave(note.id, content);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setContent(note.content);
    };

    // Custom renderers for Markdown components
    const MarkdownComponents = {
        code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            if (match && match[1] === 'mermaid') {
                return <Mermaid chart={String(children).replace(/\n$/, '')} />;
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
            <h3>A Card</h3>
            {isEditing ? (
                <div className="editor-preview-container">
                    {/* Editor Section */}
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

                    {/* Preview Section */}
                    <div className="preview-container">
                        <h3>Live Preview:</h3>
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
                    {/* Display Content */}
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
