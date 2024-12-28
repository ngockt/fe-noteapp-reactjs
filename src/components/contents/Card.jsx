import React, { useState, useEffect } from 'react';
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
import languages from './languages.json';

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
        setDropdownVisible(false);
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
            setActiveTab(langCode); // Set the new language tab as active
            setIsEditing(true); // Enable editing mode
        }
        setDropdownVisible(false);
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
                {isEditing ? (
                    <input
                        type="text"
                        value={content[activeTab]?.title || ''}
                        onChange={handleTitleChange}
                        className="form-control form-control-sm"
                        placeholder="Enter title"
                    />
                ) : (
                    <h5 className="mb-0 text-primary">{content[activeTab]?.title || 'Untitled'}</h5>
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
                                    {content[lang]?.content?.trim() ? (
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
                                    <textarea
                                        value={content[lang]?.content || ''}
                                        onChange={handleContentChange}
                                        className="form-control mb-3"
                                        rows="3"
                                        placeholder={`Enter your Markdown for ${lang.toUpperCase()} here...`}
                                    />
                                </>
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
        </div>
    );
};

export default Card;
