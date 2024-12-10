import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { FiEdit, FiSave, FiArrowLeft } from 'react-icons/fi';
import './Card.css';
import Mermaid from './Mermaid';
import PlantUML from './PlantUML';

const Card = ({ note, onSave, isNew, onCloseEditor }) => {
    const [isEditing, setIsEditing] = useState(isNew || false);
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
        if (onCloseEditor) onCloseEditor();
    };

    const handleCancel = () => {
        setIsEditing(false);
        setContent(note.content);
        if (onCloseEditor) onCloseEditor();
    };

    const preprocessContent = (text) => {
        // Convert \( and \[ to $ and $$ for compatibility with remark-math
        return text
            .replace(/\\\(/g, '$')
            .replace(/\\\)/g, '$')
            .replace(/\\\[/g, '$$')
            .replace(/\\\]/g, '$$');
    };

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
                            placeholder="Enter your Markdown with LaTeX, Mermaid, or PlantUML here..."
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
                                remarkPlugins={[remarkMath]}
                                rehypePlugins={[rehypeKatex]}
                            >
                                {preprocessContent(content)}
                            </ReactMarkdown>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <ReactMarkdown
                        components={MarkdownComponents}
                        remarkPlugins={[remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                    >
                        {preprocessContent(note.content)}
                    </ReactMarkdown>
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
