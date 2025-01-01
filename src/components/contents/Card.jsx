import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import Select from 'react-select';
import { FiEdit, FiSave, FiArrowLeft, FiMaximize, FiMinimize } from 'react-icons/fi';
import 'katex/dist/katex.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// If you have specialized components for code blocks:
import Mermaid from './rendering/Mermaid';
import PlantUML from './rendering/PlantUML';

// Your CSS:
import './Card.css';

// Example of your language context or data
import { useLanguagesData } from 'context_data/LanguageDataContext';

const Card = ({ note, onSave, isNew, onCloseEditor }) => {
    // -------------------------------------------
    // 1) Build initial state for all versions
    // -------------------------------------------
    const [versions, setVersions] = useState(() => {
        // Convert note.versions => array of objects like:
        // { version: 'x.y.z', contents: { langId => {title, content}, ... } }
        // or we keep them as arrays with [ { language_id, title, content } ... ]
        // We'll store them as-is, but make sure it's easy to find the right version.
        return note.versions || [];
    });

    // If no versions at all, you might want to create a default
    useEffect(() => {
        if (!versions.length) {
            // Provide a default
            setVersions([
                {
                    version: '1.0.0',
                    contents: []
                }
            ]);
        }
    }, [versions]);

    // Track which version is currently active (by string, e.g. '1.0.0')
    const [activeVersion, setActiveVersion] = useState(
        versions.length ? versions[0].version : ''
    );

    // We still have the concept of "editing mode"
    const [isEditing, setIsEditing] = useState(isNew || false);
    // We also have a fullscreen toggle
    const [isFullScreen, setIsFullScreen] = useState(false);

    // -------------------------------------------
    // 2) Helpers to get/set contents of active version
    // -------------------------------------------
    // Let's find the current version object
    const currentVersionObj = versions.find((v) => v.version === activeVersion);

    // Convert array => object keyed by languageId for easier editing
    const currentContentsMap = React.useMemo(() => {
        if (!currentVersionObj) return {};
        const map = {};
        currentVersionObj.contents.forEach((item) => {
            map[item.language_id] = {
                title: item.title,
                content: item.content,
            };
        });
        return map;
    }, [currentVersionObj]);

    // We'll track which language is currently visible
    const [activeLang, setActiveLang] = useState(() => {
        if (!currentVersionObj || !currentVersionObj.contents.length) return '';
        // Default to the first language in that version
        return currentVersionObj.contents[0].language_id;
    });

    useEffect(() => {
        // Whenever activeVersion changes, reset the language to the first in that version
        if (currentVersionObj && currentVersionObj.contents.length > 0) {
            setActiveLang(currentVersionObj.contents[0].language_id);
        } else {
            setActiveLang('');
        }
    }, [activeVersion]);

    // -------------------------------------------
    // 3) Editing handlers
    // -------------------------------------------
    const handleEdit = () => setIsEditing(true);
    const handleFullScreenToggle = () => setIsFullScreen((prev) => !prev);

    const handleCancel = () => {
        setIsEditing(false);
        if (onCloseEditor) onCloseEditor();
    };

    const handleSave = () => {
        setIsEditing(false);

        // onSave would pass back the entire versions array, or just the current version
        // Typically, you'd pass the updated versions so the server can store them all
        onSave(note.id, versions);

        if (onCloseEditor) onCloseEditor();
    };

    // -------------------------------------------
    // 4) Version dropdown & "Add version"
    // -------------------------------------------
    const [isAddingVersion, setIsAddingVersion] = useState(false);
    const [newVersionInput, setNewVersionInput] = useState('');

    const versionSelectOptions = versions.map((v) => ({
        value: v.version,
        label: v.version
    }));

    // Add an extra option for "Add new version..."
    versionSelectOptions.push({ value: 'addVersion', label: 'Add...' });

    const handleVersionChange = (selectedOption) => {
        if (selectedOption.value === 'addVersion') {
            setIsAddingVersion(true);
        } else {
            setActiveVersion(selectedOption.value);
        }
    };

    const handleAddVersionSubmit = () => {
        const newVer = newVersionInput.trim();
        if (!newVer) {
            setIsAddingVersion(false);
            return;
        }

        // 1. Clone contents from the current version
        let clonedContents = [];
        if (currentVersionObj) {
            // Deep clone so changes won't affect the old version
            clonedContents = JSON.parse(JSON.stringify(currentVersionObj.contents));
        }

        // 2. Create the new version object
        const newVersionObj = {
            version: newVer,
            contents: clonedContents,
        };

        // 3. Add it to state
        setVersions((prev) => [...prev, newVersionObj]);

        // 4. Make it the active version
        setActiveVersion(newVer);

        // 5. Reset UI
        setNewVersionInput('');
        setIsAddingVersion(false);
    };

    // If user cancels the "add new version" flow
    const handleAddVersionCancel = () => {
        setIsAddingVersion(false);
        setNewVersionInput('');
    };

    // -------------------------------------------
    // 5) Language selection & editing
    // -------------------------------------------
    const languagesData = useLanguagesData();

    // We get the language IDs from the current version
    const existingLangIds = currentVersionObj ? currentVersionObj.contents.map((x) => x.language_id) : [];

    const [showAddLang, setShowAddLang] = useState(false);

    const handleLangChange = (selectedOption) => {
        if (selectedOption.value === 'addLanguage') {
            setShowAddLang(true);
        } else {
            setActiveLang(selectedOption.value);
        }
    };

    // Filter out languages that are already used
    const notUsedLanguages = languagesData.filter(
        (ld) => !existingLangIds.includes(ld.id)
    );
    // Options for adding new language
    const addLangOptions = notUsedLanguages.map((ld) => ({
        value: ld.id,
        label: `${ld.name} (${ld.code.toUpperCase()})`,
    }));

    const handleAddNewLangSelected = (selectedOption) => {
        if (!selectedOption) return;
        // We'll insert a new language block with empty content
        const newLangId = selectedOption.value;

        setVersions((prev) => {
            return prev.map((v) => {
                if (v.version === activeVersion) {
                    return {
                        ...v,
                        contents: [
                            ...v.contents,
                            {
                                language_id: newLangId,
                                title: '',
                                content: '',
                            },
                        ],
                    };
                }
                return v;
            });
        });

        setActiveLang(newLangId);
        setShowAddLang(false);
    };

    const handleAddLangCancel = () => {
        setShowAddLang(false);
    };

    // Actually update the title/content for the active version & active language
    const handleTitleChange = (e) => {
        const newTitle = e.target.value;
        setVersions((prev) =>
            prev.map((versionObj) => {
                if (versionObj.version !== activeVersion) return versionObj;

                // for the active version, update the relevant language
                const updatedContents = versionObj.contents.map((item) => {
                    if (item.language_id === activeLang) {
                        return { ...item, title: newTitle };
                    }
                    return item;
                });

                return { ...versionObj, contents: updatedContents };
            })
        );
    };

    const handleContentChange = (e) => {
        const newContent = e.target.value;
        setVersions((prev) =>
            prev.map((versionObj) => {
                if (versionObj.version !== activeVersion) return versionObj;

                const updatedContents = versionObj.contents.map((item) => {
                    if (item.language_id === activeLang) {
                        return { ...item, content: newContent };
                    }
                    return item;
                });

                return { ...versionObj, contents: updatedContents };
            })
        );
    };

    // -------------------------------------------
    // 6) Markdown & code block rendering
    // -------------------------------------------
    const preprocessContent = (text) =>
        text
            .replace(/\\\(/g, '$')
            .replace(/\\\)/g, '$')
            .replace(/\\\[/g, '$$')
            .replace(/\\\]/g, '$$');

    // Custom code block renderer
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

    // If there's no active version or no active language, just show a placeholder
    if (!currentVersionObj || !activeLang) {
        return (
            <div className="card border-primary shadow">
                <div className="card-body">
                    <p>No versions or languages available.</p>
                </div>
            </div>
        );
    }

    const { title, content } = currentContentsMap[activeLang] || { title: '', content: '' };

    // -------------------------------------------
    // 7) Render
    // -------------------------------------------
    return (
        <div
            className={`card border-primary shadow ${isFullScreen ? 'fullscreen-card' : ''}`}
            style={{ maxWidth: '900px', margin: '1rem auto' }}
        >
            {/* Body: split into left content & right icons */}
            <div className="card-body d-flex p-0">
                {/* LEFT COLUMN: Title + markdown content */}
                <div className="card-content p-3 flex-grow-1">
                    {/* Title row */}
                    {isEditing ? (
                        <input
                            type="text"
                            value={title}
                            onChange={handleTitleChange}
                            className="form-control form-control-sm mb-2"
                            placeholder="Enter title"
                        />
                    ) : (
                        <h5 className="mb-2">{title || 'Untitled'}</h5>
                    )}

                    {/* If editing & content is non-empty => show live preview */}
                    {isEditing && content.trim() && (
                        <>
                            <h6 className="mt-2">Live Preview:</h6>
                            <div className="border p-2 mb-3">
                                <ReactMarkdown
                                    components={MarkdownComponents}
                                    remarkPlugins={[remarkMath]}
                                    rehypePlugins={[rehypeKatex]}
                                >
                                    {preprocessContent(content)}
                                </ReactMarkdown>
                            </div>
                        </>
                    )}

                    {/* Editing => Textarea; otherwise => rendered Markdown */}
                    {isEditing ? (
                        <textarea
                            value={content}
                            onChange={handleContentChange}
                            className="form-control"
                            rows="8"
                        />
                    ) : (
                        <ReactMarkdown
                            components={MarkdownComponents}
                            remarkPlugins={[remarkMath]}
                            rehypePlugins={[rehypeKatex]}
                        >
                            {preprocessContent(content)}
                        </ReactMarkdown>
                    )}

                    {/* Save & Cancel Buttons */}
                    {isEditing && (
                        <div className="d-flex gap-2 mt-3">
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

                {/* RIGHT COLUMN: Icon container */}
                <div className="icon-container d-flex flex-column align-items-center p-2">
                    <button
                        onClick={handleEdit}
                        className="btn btn-light btn-sm my-1"
                        aria-label="Edit Title"
                    >
                        <FiEdit />
                    </button>
                    <button
                        onClick={handleFullScreenToggle}
                        className="btn btn-light btn-sm my-1"
                        aria-label="Toggle Fullscreen"
                    >
                        {isFullScreen ? <FiMinimize /> : <FiMaximize />}
                    </button>
                </div>
            </div>

            {/* FOOTER: version & language dropdowns */}
            <div className="card-footer d-flex justify-content-between align-items-center p-2">
                {/* VERSION SELECT OR "Add new version" */}
                {isAddingVersion ? (
                    <div className="d-flex" style={{ width: '160px' }}>
                        <input
                            className="form-control form-control-sm"
                            type="text"
                            placeholder="New version"
                            value={newVersionInput}
                            onChange={(e) => setNewVersionInput(e.target.value)}
                        />
                        <button
                            className="btn btn-sm btn-primary ms-1"
                            onClick={handleAddVersionSubmit}
                        >
                            Add
                        </button>
                        <button
                            className="btn btn-sm btn-secondary ms-1"
                            onClick={handleAddVersionCancel}
                        >
                            Cancel
                        </button>
                    </div>
                ) : (
                    <div style={{ width: '160px' }}>
                        <Select
                            options={versionSelectOptions}
                            value={versionSelectOptions.find((opt) => opt.value === activeVersion)}
                            onChange={handleVersionChange}
                            isSearchable={false}
                        />
                    </div>
                )}

                {/* LANGUAGE SELECT */}
                <div style={{ flex: 1, maxWidth: '240px' }}>
                    {(() => {
                        // Build the dropdown options for existing languages
                        const langOptions = existingLangIds.map((langId) => {
                            const ld = languagesData.find((l) => l.id === langId);
                            return ld
                                ? { value: ld.id, label: `${ld.name} (${ld.code.toUpperCase()})` }
                                : { value: langId, label: langId };
                        });

                        // add "Add new language..."
                        langOptions.push({ value: 'addLanguage', label: 'Add...' });

                        if (!showAddLang) {
                            return (
                                <Select
                                    options={langOptions}
                                    value={langOptions.find((opt) => opt.value === activeLang)}
                                    onChange={handleLangChange}
                                    placeholder="Select Language"
                                    isSearchable
                                />
                            );
                        } else {
                            // Inline flow for picking a new language
                            return (
                                <div className="d-flex align-items-center">
                                    <Select
                                        options={addLangOptions}
                                        onChange={handleAddNewLangSelected}
                                        placeholder="Pick new language"
                                        isSearchable
                                        isClearable
                                        backspaceRemovesValue
                                        autoFocus
                                    />
                                    <button
                                        className="btn btn-sm btn-secondary ms-1"
                                        onClick={handleAddLangCancel}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            );
                        }
                    })()}
                </div>
            </div>
        </div>
    );
};

export default Card;
