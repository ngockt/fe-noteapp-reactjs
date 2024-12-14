import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Ensure Bootstrap JS is included
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
        <div className="card border-primary my-3 shadow">
            {isEditing ? (
                <div className="card-body">
                    <div className="mt-4 border-top pt-3">
                        <h6 className="text-primary">Preview</h6>
                        <div className="border rounded p-3 bg-light">
                            <ReactMarkdown
                                components={MarkdownComponents}
                                remarkPlugins={[remarkMath]}
                                rehypePlugins={[rehypeKatex]}
                            >
                                {preprocessContent(content)}
                            </ReactMarkdown>
                        </div>
                    </div>
                    <h5 className="card-title">Edit Note</h5>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="form-control mb-3"
                        rows="3"
                        placeholder="Enter your Markdown with LaTeX, Mermaid, or PlantUML here..."
                    />
                    <div className="d-flex justify-content-start align-items-center gap-2">
                        <button onClick={handleSave} className="btn btn-success btn-sm">
                            <FiSave className="me-1" />
                            Save
                        </button>
                        <button onClick={handleCancel} className="btn btn-secondary btn-sm">
                            <FiArrowLeft className="me-1" />
                            Cancel
                        </button>
                    </div>

                </div>
            ) : (
                <div className="card-body">
                    <ReactMarkdown
                        components={MarkdownComponents}
                        remarkPlugins={[remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                    >
                        {preprocessContent(note.content)}
                    </ReactMarkdown>
                    <button onClick={handleEdit} className="btn btn-primary mt-3">
                        <FiEdit className="me-2" />
                        Edit
                    </button>
                </div>
            )}
        </div>
    );
};

export default Card;
