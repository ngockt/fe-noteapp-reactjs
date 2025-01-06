// src/components/contents/CardView.jsx
import React, { useState, useEffect, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { FiEdit, FiMaximize, FiMinimize } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom'; // For navigation

import 'katex/dist/katex.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import Mermaid from './rendering/Mermaid';
import PlantUML from './rendering/PlantUML';
import './Card.css'; // Use the same CSS as Card.jsx

import VersionModal from './VersionModal';
import LanguageModal from './LanguageModal';
import NodeModal from './NodeModal';

import { useLanguagesData } from 'context_data/LanguageDataContext';
import { useGraphData } from 'context_data/GraphDataContext';

const CardView = ({ card }) => {
    // -------------------------------------------------------------------
    // 1) Versions: State & initialization
    // -------------------------------------------------------------------
    const [versions, setVersions] = useState(() => card.versions || []);

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
    // 3) Full screen mode (view only)
    // -------------------------------------------------------------------
    const handleFullScreenToggle = () => setIsFullScreen((prev) => !prev);

    // -------------------------------------------------------------------
    // 4) Version selection modal
    // -------------------------------------------------------------------
    const [showVersionModal, setShowVersionModal] = useState(false);

    const handleSelectVersion = (verString) => {
        setActiveVersion(verString);
        setShowVersionModal(false);
    };

    // -------------------------------------------------------------------
    // 5) Language selection modal
    // -------------------------------------------------------------------
    const [showLanguageModal, setShowLanguageModal] = useState(false);
    const allLanguages = useLanguagesData();

    // -------------------------------------------------------------------
    // 6) Node selection modal
    // -------------------------------------------------------------------
    const [showNodeModal, setShowNodeModal] = useState(false);
    const mapData = useGraphData();
    const nodeList = mapData?.nodes || [];

    const [nodeInfo, setNodeInfo] = useState(card.node_info || null);

    // -------------------------------------------------------------------
    // 7) Markdown & code block rendering
    // -------------------------------------------------------------------
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
    // 8) Navigation to CardDetail
    // -------------------------------------------------------------------
    const navigate = useNavigate();

    const handleEditClick = () => {
        navigate(`/card/detail/${card.id}`);
    };

    // -------------------------------------------------------------------
    // 9) Early return if there's no version or no language
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

    return (
        <>
            <div
                className={`card border-primary shadow ${isFullScreen ? 'fullscreen-card' : ''
                    }`}
            >
                {/* --- CARD HEADER (title on the left, icons on the right) --- */}
                <div className="card-header d-flex align-items-center justify-content-between">
                    <div className="card-title-container">
                        <h5 className="mb-0">{title || 'Untitled'}</h5>
                    </div>

                    <div className="icon-container d-flex align-items-center">
                        {/* Edit icon - navigate to CardDetail */}
                        <button
                            onClick={handleEditClick}
                            className="btn btn-light btn-sm p-1"
                            aria-label="Edit"
                        >
                            <FiEdit />
                        </button>

                        {/* Fullscreen toggle */}
                        <button
                            onClick={handleFullScreenToggle}
                            className="btn btn-light btn-sm p-1"
                            aria-label="Toggle Fullscreen"
                        >
                            {isFullScreen ? <FiMinimize /> : <FiMaximize />}
                        </button>
                    </div>
                </div>

                {/* --- CARD BODY (main content) --- */}
                <div className="card-body">
                    <div className="card-content-container">
                        <ReactMarkdown
                            components={MarkdownComponents}
                            remarkPlugins={[remarkMath]}
                            rehypePlugins={[rehypeKatex]}
                        >
                            {content}
                        </ReactMarkdown>
                    </div>
                </div>

                {/* --- CARD FOOTER (versions, language, node selection) --- */}
                <div className="card-footer d-flex flex-wrap align-items-center gap-2 p-2">
                    {/* VERSION */}
                    <div>
                        <button
                            className="btn btn-sm btn-outline-primary p-1"
                            onClick={() => setShowVersionModal(true)}
                        >
                            {activeVersion || 'Select Version'}
                        </button>
                    </div>

                    {/* LANGUAGE */}
                    <div>
                        <button
                            className="btn btn-sm btn-outline-primary p-1"
                            onClick={() => setShowLanguageModal(true)}
                        >
                            {(() => {
                                const found = allLanguages.find((ld) => ld.id === activeLang);
                                return found ? found.name : 'Select Language';
                            })()}
                        </button>
                    </div>

                    {/* NODE */}
                    <div>
                        <button
                            className="btn btn-sm btn-outline-primary p-1"
                            onClick={() => setShowNodeModal(true)}
                        >
                            {nodeInfo ? (
                                <>
                                    {nodeInfo.name}
                                    <span className="badge text-dark ms-1">
                                        {nodeInfo.category}
                                    </span>
                                </>
                            ) : (
                                'Select Node'
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* -- Version Modal -- */}
            <VersionModal
                show={showVersionModal}
                onClose={() => setShowVersionModal(false)}
                versions={versions}
                onSelect={handleSelectVersion}
            />

            {/* -- Language Modal -- */}
            <LanguageModal
                show={showLanguageModal}
                onClose={() => setShowLanguageModal(false)}
                currentLanguages={[]} // Not used in view-only mode
                allLanguages={allLanguages}
                onSelect={(langId) => setActiveLang(langId)}
            />

            {/* -- Node Modal -- */}
            <NodeModal
                show={showNodeModal}
                onClose={() => setShowNodeModal(false)}
                nodes={nodeList}
                onSelect={() => { }} // No selection logic in view-only mode
                currentNode={nodeInfo}
            />
        </>
    );
};

export default CardView;