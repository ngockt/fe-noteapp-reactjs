// src/components/contents/CardView.js
import React, { useState, useEffect, useMemo } from 'react';
import { FiEdit, FiMaximize, FiMinimize } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import './Card.css';

import VersionModal from './VersionModal';
import LanguageModal from './LanguageModal';

import { useLanguagesData } from 'context_data/LanguageDataContext';
import { useGraphData } from 'context_data/GraphDataContext';
import CardContentRender from './rendering/CardContentRender';

const CardView = ({ card }) => {
    const [versions, setVersions] = useState(() => card.versions || []);

    useEffect(() => {
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

    const [activeVersion, setActiveVersion] = useState(
        versions.length ? versions[0].version : ''
    );

    const [isFullScreen, setIsFullScreen] = useState(false);

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
            if (currentVersionObj.contents.length > 0) {
                setActiveLang(currentVersionObj.contents[0].language_id);
            } else {
                setActiveLang('');
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeVersion, currentVersionObj]);

    const handleFullScreenToggle = () => setIsFullScreen((prev) => !prev);

    const [showVersionModal, setShowVersionModal] = useState(false);

    const handleSelectVersion = (verString) => {
        setActiveVersion(verString);
        setShowVersionModal(false);
    };

    const [showLanguageModal, setShowLanguageModal] = useState(false);
    const allLanguages = useLanguagesData();

    const mapData = useGraphData();
    const nodeList = mapData?.nodes || [];

    const [nodeInfo, setNodeInfo] = useState(card.node_info || null);

    const navigate = useNavigate();

    const handleEditClick = () => {
        navigate(`/card/detail/${card.id}`);
    };

    if (!currentVersionObj || !activeLang) {
        return (
            <div className="card border-primary shadow">
                <div className="card-content-container">
                    <p>No versions or languages available.</p>
                </div>
            </div>
        );
    }

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
                <div className="card-header d-flex align-items-center justify-content-between">
                    <div className="card-title-container">
                        <h5 className="mb-0">{title || 'Untitled'}</h5>
                    </div>

                    <div className="icon-container d-flex align-items-center">
                        <button
                            onClick={handleEditClick}
                            className="btn btn-light btn-sm p-1"
                            aria-label="Edit"
                        >
                            <FiEdit />
                        </button>

                        <button
                            onClick={handleFullScreenToggle}
                            className="btn btn-light btn-sm p-1"
                            aria-label="Toggle Fullscreen"
                        >
                            {isFullScreen ? <FiMinimize /> : <FiMaximize />}
                        </button>
                    </div>
                </div>

                <div className="card-content-container">
                    <CardContentRender content={content} isEditing={false} />
                </div>

                <div className="card-footer d-flex flex-wrap align-items-center gap-2 p-2">
                    <div>
                        <button
                            className="btn btn-sm btn-outline-primary p-1"
                            onClick={() => setShowVersionModal(true)}
                        >
                            {activeVersion || 'Select Version'}
                        </button>
                    </div>

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

                    <div>
                        <button className="btn btn-sm btn-outline-secondary p-1" disabled>
                            {nodeInfo ? (
                                <>
                                    {nodeInfo.name}
                                    <span className="badge text-dark ms-1">
                                        {nodeInfo.category}
                                    </span>
                                </>
                            ) : (
                                'Node'
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <VersionModal
                show={showVersionModal}
                onClose={() => setShowVersionModal(false)}
                versions={versions}
                onSelect={handleSelectVersion}
                isEditing={false}
            />

            <LanguageModal
                show={showLanguageModal}
                onClose={() => setShowLanguageModal(false)}
                currentLanguages={currentVersionObj.contents.map(
                    (content) => content.language_id
                )}
                allLanguages={allLanguages}
                onSelect={(langId) => setActiveLang(langId)}
                isEditing={false}
            />
        </>
    );
};

export default CardView;