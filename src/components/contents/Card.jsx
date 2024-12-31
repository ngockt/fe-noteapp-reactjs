import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import Select from 'react-select';
import 'katex/dist/katex.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { FiEdit, FiSave, FiArrowLeft, FiMaximize, FiMinimize } from 'react-icons/fi';
import './Card.css';
import Mermaid from './rendering/Mermaid';
import PlantUML from './rendering/PlantUML';
import { useLanguagesData } from 'context_data/LanguageDataContext';

const Card = ({ note, onSave, isNew, onCloseEditor }) => {
    const initialContents = note.contents.reduce((acc, curr) => {
        acc[curr.language_code] = { title: curr.title, content: curr.content };
        return acc;
    }, {});

    const [isEditing, setIsEditing] = useState(isNew || false);
    const [content, setContent] = useState(initialContents);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [activeTab, setActiveTab] = useState(Object.keys(initialContents)[0] || 'en');
    const [tabOrder, setTabOrder] = useState(Object.keys(initialContents));

    const dropdownRef = useRef(null); // Ref for the dropdown

    // Get languages data from the shared context
    const languagesData = useLanguagesData();

    const dropdownOptions = languagesData
        .filter((lang) => !tabOrder.includes(lang.code))
        .map((lang) => ({
            value: lang.code,
            label: `${lang.name} (${lang.code.toUpperCase()})`,
        }));

    useEffect(() => {
        if (activeTab === 'add' && dropdownRef.current) {
            dropdownRef.current.focus(); // Focus on dropdown when the "+" tab is active
        }
    }, [activeTab]);

    const handleEdit = () => setIsEditing(true);

    const handleSave = () => {
        setIsEditing(false);
        const updatedContents = Object.entries(content).map(([code, { title, content }]) => ({
            language_code: code,
            title,
            content,
        }));
        onSave(note.id, updatedContents);
        if (onCloseEditor) onCloseEditor();
    };

    const handleCancel = () => {
        setIsEditing(false);
        setContent(initialContents);
        if (onCloseEditor) onCloseEditor();
    };

    const handleFullScreenToggle = () => setIsFullScreen(!isFullScreen);

    const preprocessContent = (text) =>
        text.replace(/\\\(/g, '$').replace(/\\\)/g, '$').replace(/\\\[/g, '$$').replace(/\\\]/g, '$$');

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

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const handleAddLanguage = (selectedOption) => {
        const langCode = selectedOption.value;
        if (!tabOrder.includes(langCode)) {
            setTabOrder((prev) => [...prev, langCode]);
            setContent((prev) => ({
                ...prev,
                [langCode]: { title: '', content: '' },
            }));
            setActiveTab(langCode);
            setIsEditing(true);
        }
    };

    const handleTitleChange = (e) => {
        setContent((prev) => ({
            ...prev,
            [activeTab]: { ...prev[activeTab], title: e.target.value },
        }));
    };

    const handleContentChange = (e) => {
        setContent((prev) => ({
            ...prev,
            [activeTab]: { ...prev[activeTab], content: e.target.value },
        }));
    };

    return (
        <div className={`card border-primary my-0 shadow ${isFullScreen ? 'fullscreen-card' : ''}`}>
            <div className="card-header d-flex justify-content-between align-items-center bg-white border-bottom-0">
                <div className="flex-grow-1 overflow-hidden">
                    {isEditing ? (
                        <input
                            type="text"
                            value={content[activeTab]?.title || ''}
                            onChange={handleTitleChange}
                            className="form-control form-control-sm"
                            placeholder="Enter title"
                        />
                    ) : (
                        <h5 className="mb-0 text-truncate">{content[activeTab]?.title || 'Untitled'}</h5>
                    )}
                </div>
                <button
                    onClick={handleEdit}
                    className="btn btn-light btn-sm p-1 ms-2"
                    aria-label="Edit Title"
                >
                    <FiEdit />
                </button>
            </div>
            <div className="card-body">
                <div className="tab-content mt-0">
                    {tabOrder.map((lang) => (
                        <div
                            key={lang}
                            className={`tab-pane fade ${activeTab === lang ? 'show active' : ''}`}
                        >
                            {isEditing && content[lang]?.content?.trim() ? (
                                <>
                                    <h6 className="mt-3">Live Preview:</h6>
                                    <div className="border p-2 mb-3">
                                        <ReactMarkdown
                                            components={MarkdownComponents}
                                            remarkPlugins={[remarkMath]}
                                            rehypePlugins={[rehypeKatex]}
                                        >
                                            {preprocessContent(content[lang]?.content || '')}
                                        </ReactMarkdown>
                                    </div>
                                </>
                            ) : null}
                            {isEditing ? (
                                <textarea
                                    value={content[lang]?.content || ''}
                                    onChange={handleContentChange}
                                    className="form-control"
                                    rows="5"
                                    placeholder={`Enter your Markdown for ${lang.toUpperCase()} here...`}
                                />
                            ) : (
                                <ReactMarkdown
                                    components={MarkdownComponents}
                                    remarkPlugins={[remarkMath]}
                                    rehypePlugins={[rehypeKatex]}
                                >
                                    {preprocessContent(content[lang]?.content || '')}
                                </ReactMarkdown>
                            )}
                        </div>
                    ))}
                    {activeTab === 'add' && (
                        <div className="tab-pane fade show active">
                            <div className="mt-3">
                                <h6 className="text-primary mb-3">Select a Language</h6>
                                <Select
                                    ref={dropdownRef} // Attach ref to the dropdown
                                    options={dropdownOptions}
                                    onChange={handleAddLanguage}
                                    placeholder="Select Language"
                                    isSearchable
                                    menuPlacement="auto"
                                />
                            </div>
                        </div>
                    )}
                </div>
                {isEditing && (
                    <div className="d-flex justify-content-start align-items-center gap-2 mt-3">
                        <button onClick={handleSave} className="btn btn-success btn-sm">
                            <FiSave className="me-1" />
                            Save
                        </button>
                        <button onClick={handleCancel} className="btn btn-secondary btn-sm">
                            <FiArrowLeft className="me-1" />
                            Cancel
                        </button>
                    </div>
                )}
            </div>
            <div className="card-footer d-flex justify-content-between align-items-center">
                <ul className="nav nav-tabs">
                    {tabOrder.map((lang) => (
                        <li key={lang} className="nav-item">
                            <button
                                className={`nav-link p-2 py-0 ${activeTab === lang ? 'active' : ''}`}
                                onClick={() => handleTabChange(lang)}
                            >
                                {languagesData.find((l) => l.code === lang)?.code.toLowerCase() || lang.toLowerCase()}
                            </button>
                        </li>
                    ))}
                    <li key="add-language" className="nav-item">
                        <button
                            className={`nav-link p-2 py-0 ${activeTab === 'add' ? 'active' : ''}`}
                            onClick={() => handleTabChange('add')}
                        >
                            +
                        </button>
                    </li>
                </ul>
                <button
                    onClick={handleFullScreenToggle}
                    className="btn btn-light btn-sm p-1"
                    aria-label="Toggle Fullscreen"
                >
                    {isFullScreen ? <FiMinimize /> : <FiMaximize />}
                </button>
            </div>
        </div>
    );
};

export default Card;
