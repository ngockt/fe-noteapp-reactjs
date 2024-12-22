import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { FiEdit, FiSave, FiArrowLeft, FiMaximize, FiMinimize } from 'react-icons/fi';
import './Card.css';
import Mermaid from './rendering/Mermaid';
import PlantUML from './rendering/PlantUML';

const Card = ({ note, onSave, isNew, onCloseEditor }) => {
    const [isEditing, setIsEditing] = useState(isNew || false);
    const [content, setContent] = useState({
        en: note.content, // Initialize English with the original note content
        cn: '',
        jp: '',
        kr: '',
        vi: '',
    });
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [activeTab, setActiveTab] = useState('en');

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
        setContent((prev) => ({
            ...prev,
            en: note.content, // Restore the original English content
        }));
        if (onCloseEditor) onCloseEditor();
    };

    const handleFullScreenToggle = () => {
        setIsFullScreen(!isFullScreen);
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

    // Determine the title, default to "Title" if empty
    const cardTitle = note.title && note.title.trim() !== '' ? note.title : 'Title';

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className={`card border-primary my-0 shadow ${isFullScreen ? 'fullscreen-card' : ''}`}>
            <div className="card-header d-flex justify-content-between align-items-center bg-white border-bottom-0">
                <h5 className="mb-0">{cardTitle}</h5>
                <button
                    onClick={handleFullScreenToggle}
                    className="btn btn-light btn-sm p-1"
                    aria-label="Toggle Fullscreen"
                >
                    {isFullScreen ? <FiMinimize /> : <FiMaximize />}
                </button>
            </div>
            <div className="card-body">
                <ul className="nav nav-tabs">
                    {['en', 'cn', 'jp', 'kr', 'vi'].map((lang) => (
                        <li className="nav-item" key={lang}>
                            <button
                                className={`nav-link ${activeTab === lang ? 'active' : ''}`}
                                onClick={() => handleTabChange(lang)}
                            >
                                {lang.toUpperCase()}
                            </button>
                        </li>
                    ))}
                </ul>
                <div className="tab-content mt-3">
                    {['en', 'cn', 'jp', 'kr', 'vi'].map((lang) => (
                        <div
                            key={lang}
                            className={`tab-pane fade ${
                                activeTab === lang ? 'show active' : ''
                            }`}
                        >
                            {isEditing ? (
                                <>
                                    <h6 className="text-primary">Preview</h6>
                                    <div className="border rounded p-3 bg-light">
                                        <ReactMarkdown
                                            components={MarkdownComponents}
                                            remarkPlugins={[remarkMath]}
                                            rehypePlugins={[rehypeKatex]}
                                        >
                                            {preprocessContent(content[lang] || '')}
                                        </ReactMarkdown>
                                    </div>
                                    <h5 className="card-title mt-4">Edit Note ({lang.toUpperCase()})</h5>
                                    <textarea
                                        value={content[lang] || ''}
                                        onChange={(e) =>
                                            setContent((prev) => ({
                                                ...prev,
                                                [lang]: e.target.value,
                                            }))
                                        }
                                        className="form-control mb-3"
                                        rows="3"
                                        placeholder={`Enter your Markdown for ${lang.toUpperCase()} here...`}
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
                                </>
                            ) : (
                                <>
                                    <ReactMarkdown
                                        components={MarkdownComponents}
                                        remarkPlugins={[remarkMath]}
                                        rehypePlugins={[rehypeKatex]}
                                    >
                                        {preprocessContent(content[lang] || '')}
                                    </ReactMarkdown>
                                    <button
                                        onClick={handleEdit}
                                        className="btn btn-primary mt-3"
                                    >
                                        <FiEdit className="me-2" />
                                        Edit
                                    </button>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Card;
