import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import Select from 'react-select'; // For searchable dropdown
import 'katex/dist/katex.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { FiEdit, FiSave, FiArrowLeft, FiMaximize, FiMinimize } from 'react-icons/fi';
import './Card.css';
import Mermaid from './rendering/Mermaid';
import PlantUML from './rendering/PlantUML';
import languages from './languages.json'; // Import JSON file containing all languages

const Card = ({ note, onSave, isNew, onCloseEditor }) => {
    const [isEditing, setIsEditing] = useState(isNew || false);
    const [content, setContent] = useState({
        en: note.content,
        cn: '',
        jp: '',
        kr: '',
        vi: '',
    });

    const [title, setTitle] = useState(note.title || 'Untitled');
    const [isEditingTitle, setIsEditingTitle] = useState(false); // Track title edit mode
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [activeTab, setActiveTab] = useState('en');
    const [tabOrder, setTabOrder] = useState(['en']);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [dropdownOptions, setDropdownOptions] = useState([]);

    useEffect(() => {
        const options = languages
            .filter((lang) => !tabOrder.includes(lang.code))
            .map((lang) => ({
                value: lang.code,
                label: `${lang.name} (${lang.code.toUpperCase()})`,
            }));
        setDropdownOptions(options);
    }, [tabOrder]);

    useEffect(() => {
        if (isNew) setIsEditing(true);
    }, [isNew]);

    const handleEdit = () => setIsEditing(true);
    const handleSave = () => {
        setIsEditing(false);
        onSave(note.id, content);
        if (onCloseEditor) onCloseEditor();
    };

    const handleCancel = () => {
        setIsEditing(false);
        setContent((prev) => ({ ...prev, en: note.content }));
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
        setDropdownVisible(false);
        setActiveTab(tab);
    };

    const handleAddLanguage = (selectedOption) => {
        const langCode = selectedOption.value;
        if (!tabOrder.includes(langCode)) {
            setTabOrder([...tabOrder, langCode]);
            setContent((prev) => ({ ...prev, [langCode]: '' }));
        }
        setDropdownVisible(false);
    };

    const handleTitleClick = () => setIsEditingTitle(true);

    const handleTitleChange = (e) => setTitle(e.target.value);

    const handleTitleBlur = () => setIsEditingTitle(false); // Save and exit edit mode

    const handleTitleKeyDown = (e) => {
        if (e.key === 'Enter') setIsEditingTitle(false); // Save on Enter
    };

    return (
        <div className={`card border-primary my-0 shadow ${isFullScreen ? 'fullscreen-card' : ''}`}>
            <div className="card-header d-flex justify-content-between align-items-center bg-white border-bottom-0">
                {/* Inline Editable Title */}
                {isEditingTitle ? (
                    <input
                        type="text"
                        value={title}
                        onChange={handleTitleChange}
                        onBlur={handleTitleBlur}
                        onKeyDown={handleTitleKeyDown}
                        className="form-control form-control-sm"
                        autoFocus
                    />
                ) : (
                    <h5
                        className="mb-0 text-primary"
                        onClick={handleTitleClick}
                        style={{ cursor: 'pointer' }}
                    >
                        {title}
                    </h5>
                )}
                <button
                    onClick={handleFullScreenToggle}
                    className="btn btn-light btn-sm p-1"
                    aria-label="Toggle Fullscreen"
                >
                    {isFullScreen ? <FiMinimize /> : <FiMaximize />}
                </button>
            </div>
            <div className="card-body">
                <ul className="nav nav-tabs d-flex align-items-center w-100">
                    {tabOrder.map((lang) => (
                        <li key={lang} className="nav-item">
                            <button
                                className={`nav-link ${activeTab === lang ? 'active' : ''}`}
                                onClick={() => handleTabChange(lang)}
                            >
                                {languages.find((l) => l.code === lang)?.code.toUpperCase() || lang.toUpperCase()}
                            </button>
                        </li>
                    ))}
                    <li key="add-language" className="nav-item">
                        <button
                            className={`nav-link ${dropdownVisible ? 'active' : ''}`}
                            onClick={() => setDropdownVisible((prev) => !prev)}
                        >
                            +
                        </button>
                    </li>

                    {/* Edit Button in Same Row */}
                    {!isEditing && (
                        <li className="ms-auto nav-item">
                            <button
                                onClick={handleEdit}
                                className="btn btn-primary btn-sm ms-2"
                            >
                                <FiEdit className="me-1" />
                                Edit
                            </button>
                        </li>
                    )}
                </ul>
                {dropdownVisible && (
                    <div className="mt-2">
                        <Select
                            options={dropdownOptions}
                            onChange={handleAddLanguage}
                            placeholder="Select Language"
                            isSearchable
                            menuPlacement="auto"
                        />
                    </div>
                )}
                <div className="tab-content mt-3">
                    {tabOrder.map((lang) => (
                        <div
                            key={lang}
                            className={`tab-pane fade ${activeTab === lang ? 'show active' : ''}`}
                        >
                            {isEditing ? (
                                <>
                                    <h5 className="card-title mt-4">Edit Note ({lang.toUpperCase()})</h5>
                                    <textarea
                                        value={content[lang] || ''}
                                        onChange={(e) =>
                                            setContent((prev) => ({ ...prev, [lang]: e.target.value }))
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
