import React, { useState, useEffect, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { FiEdit, FiSave, FiArrowLeft, FiMaximize, FiMinimize } from 'react-icons/fi';

import 'katex/dist/katex.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import Mermaid from './rendering/Mermaid';
import PlantUML from './rendering/PlantUML';
import './Card.css';

import VersionModal from './VersionModal';
import LanguageModal from './LanguageModal';
import NodeModal from './NodeModal';

import { useLanguagesData } from 'context_data/LanguageDataContext';
import { useGraphData } from 'context_data/GraphDataContext';

const Card = ({ note, onSave, isNew, onCloseEditor }) => {
    // -------------------------------------------------------------------
    // 1) Versions: State & initialization
    // -------------------------------------------------------------------
    const [versions, setVersions] = useState(() => note.versions || []);

    useEffect(() => {
        // If no versions exist, initialize with a default 1.0.0
        if (!versions.length) {
            setVersions([
                {
                    version: '1.0.0',
                    contents: [],
                },
            ]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Active version (string)
    const [activeVersion, setActiveVersion] = useState(
        versions.length ? versions[0].version : ''
    );

    // Controls whether the card is in "edit" mode
    const [isEditing, setIsEditing] = useState(isNew || false);

    // Controls whether the card is displayed fullscreen
    const [isFullScreen, setIsFullScreen] = useState(false);

    // -------------------------------------------------------------------
    // 2) Helpers to access the currently active version & contents
    // -------------------------------------------------------------------
    const currentVersionObj = versions.find((v) => v.version === activeVersion);

    const currentContentsMap = useMemo(() => {
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

    // Active language
    const [activeLang, setActiveLang] = useState(() => {
        if (!currentVersionObj || !currentVersionObj.contents.length) return '';
        return currentVersionObj.contents[0].language_id;
    });

    /**
     * Only reset activeLang if the new version DOES NOT contain the currently activeLang.
     * Otherwise, keep the same activeLang.
     */
    useEffect(() => {
        if (!currentVersionObj) {
            setActiveLang('');
            return;
        }
        const hasActiveLang = currentVersionObj.contents.some(
            (item) => item.language_id === activeLang
        );
        if (!hasActiveLang) {
            // fallback to the first language if available
            if (currentVersionObj.contents.length > 0) {
                setActiveLang(currentVersionObj.contents[0].language_id);
            } else {
                setActiveLang('');
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeVersion, currentVersionObj]);

    // -------------------------------------------------------------------
    // 3) Editing handlers
    // -------------------------------------------------------------------
    const handleEdit = () => setIsEditing(true);
    const handleFullScreenToggle = () => setIsFullScreen((prev) => !prev);

    const handleCancel = () => {
        setIsEditing(false);
        if (onCloseEditor) onCloseEditor();
    };

    // -------------------------------------------------------------------
    // 4) Version selection modal + "Add Version" feature
    // -------------------------------------------------------------------
    const [showVersionModal, setShowVersionModal] = useState(false);

    const handleSelectVersion = (verString) => {
        setActiveVersion(verString);
        setShowVersionModal(false);
    };

    const handleAddVersion = (newVersionString) => {
        const sourceVersionObj = versions.find((v) => v.version === activeVersion);
        if (!sourceVersionObj) return;

        // Deep clone so we don’t mutate
        const clonedContents = JSON.parse(JSON.stringify(sourceVersionObj.contents));

        const newVersionObj = {
            version: newVersionString,
            contents: clonedContents,
        };

        setVersions((prev) => [...prev, newVersionObj]);
        setActiveVersion(newVersionString);
    };

    // -------------------------------------------------------------------
    // 5) Language selection & adding new language
    // -------------------------------------------------------------------
    const [showLanguageModal, setShowLanguageModal] = useState(false);
    const allLanguages = useLanguagesData();

    // Collect an array of language IDs in the current version
    const currentLanguages = currentVersionObj
        ? currentVersionObj.contents.map((item) => item.language_id)
        : [];

    const handleAddLanguageToVersion = (langId) => {
        setVersions((prevVersions) =>
            prevVersions.map((versionObj) => {
                if (versionObj.version !== activeVersion) return versionObj;

                // Check if this language already exists
                const alreadyExists = versionObj.contents.some(
                    (item) => item.language_id === langId
                );
                if (alreadyExists) {
                    // Optionally do nothing or show a message
                    return versionObj;
                }

                const newEntry = {
                    language_id: langId,
                    title: '',
                    content: '',
                };
                return {
                    ...versionObj,
                    contents: [...versionObj.contents, newEntry],
                };
            })
        );
        // Switch to this newly added language immediately
        setActiveLang(langId);
    };

    // -------------------------------------------------------------------
    // 6) Node selection modal
    // -------------------------------------------------------------------
    const [showNodeModal, setShowNodeModal] = useState(false);
    const mapData = useGraphData();
    const nodeList = mapData?.nodes || [];

    const [nodeInfo, setNodeInfo] = useState(note.node_info || null);

    const handleSelectNode = (node) => {
        setNodeInfo({
            id: node.id,
            name: node.name,
            tag: node.tag,
            category: node.category,
        });
        setShowNodeModal(false);
    };

    // -------------------------------------------------------------------
    // 7) Editing title & content
    // -------------------------------------------------------------------
    const handleTitleChange = (e) => {
        const newTitle = e.target.value;
        setVersions((prev) =>
            prev.map((versionObj) => {
                if (versionObj.version !== activeVersion) return versionObj;

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

    // -------------------------------------------------------------------
    // 8) Markdown & code block rendering
    // -------------------------------------------------------------------
    const preprocessContent = (text) =>
        text
            .replace(/\\\(/g, '$')
            .replace(/\\\)/g, '$')
            .replace(/\\\[/g, '$$')
            .replace(/\\\]/g, '$$');

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

    // -------------------------------------------------------------------
    // 9) Final Save
    // -------------------------------------------------------------------
    const handleSave = () => {
        setIsEditing(false);
        onSave(
            {
                ...note,
                versions,
                node_info: nodeInfo,
            },
            versions
        );
        if (onCloseEditor) onCloseEditor();
    };

    // -------------------------------------------------------------------
    // 10) Early return if there's no version or no language
    // -------------------------------------------------------------------
    if (!currentVersionObj || !activeLang) {
        return (
            <div className="card border-primary shadow">
                <div className="card-body">
                    <p>No versions or languages available.</p>
                </div>
            </div>
        );
    }

    // Current title & content
    const { title, content } = currentContentsMap[activeLang] || {
        title: '',
        content: '',
    };

    // -------------------------------------------------------------------
    // Render
    // -------------------------------------------------------------------
    return (
        <>
            <div className={`card border-primary shadow ${isFullScreen ? 'fullscreen-card' : ''}`}>
                <div className="card-body d-flex p-0">
                    {/* LEFT COLUMN: Title + content */}
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
                        <hr className="my-3" />

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

                        {/* Editing => textarea, otherwise => rendered Markdown */}
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

                        {/* Save & Cancel Buttons (when editing) */}
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
                            onClick={handleFullScreenToggle}
                            className="btn btn-light btn-sm my-1"
                            aria-label="Toggle Fullscreen"
                        >
                            {isFullScreen ? <FiMinimize /> : <FiMaximize />}
                        </button>
                        <button
                            onClick={handleEdit}
                            className="btn btn-light btn-sm my-1"
                            aria-label="Edit Title"
                        >
                            <FiEdit />
                        </button>
                    </div>
                </div>

                {/* FOOTER: version, language & node selection via popups */}
                <div className="card-footer d-flex justify-content-start align-items-center p-2 gap-4">
                    {/* VERSION */}
                    <div>
                        <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => setShowVersionModal(true)}
                        >
                            {activeVersion || 'Select Version'}
                        </button>
                    </div>

                    {/* LANGUAGE */}
                    <div>
                        <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => setShowLanguageModal(true)}
                        >
                            {(() => {
                                // Find the language object for activeLang among all languages
                                const found = allLanguages.find((ld) => ld.id === activeLang);
                                return found ? found.name : 'Select Language';
                            })()}
                        </button>
                    </div>

                    {/* NODE */}
                    <div>
                        <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => setShowNodeModal(true)}
                        >
                            {
                                nodeInfo ? (
                                    <>
                                        {nodeInfo.name} 
                                        <span className="badge  text-dark ms-1">
                                            {nodeInfo.category}
                                        </span>
                                    </>
                                ) : (
                                    "Select Node"
                                )
                            }
                        </button>
                    </div>
                </div>
            </div>

            {/* -------------- All the modals -------------- */}
            <VersionModal
                show={showVersionModal}
                onClose={() => setShowVersionModal(false)}
                versions={versions}
                onSelect={handleSelectVersion}
                onAddVersion={handleAddVersion}
            />

            <LanguageModal
                show={showLanguageModal}
                onClose={() => setShowLanguageModal(false)}
                currentLanguages={currentLanguages}
                allLanguages={allLanguages}
                onSelect={(langId) => setActiveLang(langId)}
                onAddLanguage={handleAddLanguageToVersion} // <-- Switch to new language immediately
            />

            <NodeModal
                show={showNodeModal}
                onClose={() => setShowNodeModal(false)}
                nodes={nodeList}
                onSelect={handleSelectNode}
                currentNode={nodeInfo}
            />
        </>
    );
};

export default Card;
