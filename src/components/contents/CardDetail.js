// src/components/contents/CardDetail.js
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { FiEdit, FiSave, FiArrowLeft, FiUpload } from 'react-icons/fi';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { v4 as uuidv4 } from 'uuid';

import './Card.css';

import VersionModal from './VersionModal';
import LanguageModal from './LanguageModal';
import NodeModal from './NodeModal';

import { useLanguagesData } from 'context_data/LanguageDataContext';
import { useGraphData } from 'context_data/GraphDataContext';
import { getRequest } from 'apis/services';
import ENDPOINTS from 'apis/endpoints';
import CardContentRender from './rendering/CardContentRender';

const CardDetail = () => {
    const { id } = useParams();
    const cardId = id;

    const [card, setCard] = useState(null);
    const [nodeInfo, setNodeInfo] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getRequest(ENDPOINTS.CARDS.DETAIL(cardId));
                setCard(response);
                if (response.node_info) {
                    setNodeInfo(response.node_info);
                }
            } catch (error) {
                console.error('Error fetching card data:', error);
            }
        };

        fetchData();
    }, [cardId]);

    const [versions, setVersions] = useState([]);

    useEffect(() => {
        if (card && card.versions) {
            setVersions(card.versions);
        }
    }, [card]);

    const [activeVersion, setActiveVersion] = useState('');

    useEffect(() => {
        if (card && card.versions && card.versions.length > 0) {
            setActiveVersion(card.versions[0].version);
        }
    }, [card]);

    const [isEditing, setIsEditing] = useState(true);

    const currentContentsMap = useMemo(() => {
        const currentVersionObj = versions.find((v) => v.version === activeVersion);

        if (!currentVersionObj) {
            return {};
        }

        const map = {};
        currentVersionObj.contents.forEach((item) => {
            map[item.language_id] = {
                title: item.title,
                content: item.content,
            };
        });
        return map;
    }, [versions, activeVersion]);

    const [activeLang, setActiveLang] = useState('');

    useEffect(() => {
        if (!currentContentsMap || Object.keys(currentContentsMap).length === 0) {
            setActiveLang('');
            return;
        }

        const languageKeys = Object.keys(currentContentsMap);
        const hasActiveLang = languageKeys.includes(activeLang);

        if (!hasActiveLang) {
            setActiveLang(languageKeys[0]);
        }
    }, [activeVersion, currentContentsMap, activeLang]);

    const handleEdit = () => setIsEditing(true);

    const handleCancel = () => {
        setIsEditing(false);
    };

    const [showVersionModal, setShowVersionModal] = useState(false);

    const handleSelectVersion = (verString) => {
        setActiveVersion(verString);
        setShowVersionModal(false);
    };

    const handleAddVersion = (newVersionString) => {
        const sourceVersionObj = versions.find((v) => v.version === activeVersion);
        if (!sourceVersionObj) return;

        const clonedContents = JSON.parse(JSON.stringify(sourceVersionObj.contents));

        const newVersionObj = {
            id: uuidv4(),
            version: newVersionString,
            contents: clonedContents,
        };

        setVersions((prev) => [...prev, newVersionObj]);
        setActiveVersion(newVersionString);
    };

    const [showLanguageModal, setShowLanguageModal] = useState(false);
    const allLanguages = useLanguagesData();

    const currentLanguages = useMemo(() => {
        const currentVersionObj = versions.find((v) => v.version === activeVersion);
        return currentVersionObj
            ? currentVersionObj.contents.map((item) => item.language_id)
            : [];
    }, [versions, activeVersion]);

    const handleAddLanguageToVersion = (langId) => {
        setVersions((prevVersions) =>
            prevVersions.map((versionObj) => {
                if (versionObj.version !== activeVersion) return versionObj;

                const alreadyExists = versionObj.contents.some(
                    (item) => item.language_id === langId
                );
                if (alreadyExists) {
                    return versionObj;
                }

                const newEntry = {
                    id: uuidv4(),
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
        setActiveLang(langId);
    };

    const [showNodeModal, setShowNodeModal] = useState(false);
    const mapData = useGraphData();
    const nodeList = mapData?.nodes || [];

    const handleSelectNode = (node) => {
        setNodeInfo({
            id: node.id,
            name: node.name,
            tag: node.tag,
            category: node.category,
        });
        setShowNodeModal(false);
    };

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

    const handleContentChange = (newContent) => {
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

    const [imageMap, setImageMap] = useState({});
    const fileInputRef = useRef(null);

    const handlePaste = async (e) => {
        const files =
            e.clipboardData?.files ||
            (e.target?.files ? Array.from(e.target.files) : []);

        if (files.length > 0) {
            const file = files[0];
            if (file && file.type.startsWith('image/')) {
                e.preventDefault();

                const imageUUID = uuidv4();

                const reader = new FileReader();
                reader.onload = (loadEvent) => {
                    const dataURL = loadEvent.target.result;

                    setImageMap((prev) => ({ ...prev, [imageUUID]: dataURL }));

                    const markdownRef = `![Pasted Image](${imageUUID})\n`;
                    handleContentChange((content || '') + markdownRef);
                };

                reader.readAsDataURL(file);
            }
        }
        if (e.target?.files) {
            e.target.value = null;
        }
    };

    const handleUploadClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleSave = () => {
        setIsEditing(false);
    };

    if (!card) {
        return (
            <div className="fullscreen-card">
                <p>Loading...</p>
            </div>
        );
    }

    if (card && versions.length === 0) {
        return (
            <div className="fullscreen-card">
                <p>No versions or languages available.</p>
            </div>
        );
    }

    const title = currentContentsMap[activeLang]?.title || '';
    const content = currentContentsMap[activeLang]?.content || '';

    return (
        <div className="card fullscreen-card">
            <div className="card-header d-flex align-items-center justify-content-between">
                <div className="card-title-container">
                    {isEditing ? (
                        <input
                            type="text"
                            value={title}
                            onChange={handleTitleChange}
                            className="form-control form-control-sm"
                            placeholder="Enter title"
                        />
                    ) : (
                        <h5 className="mb-0">{title || 'Untitled'}</h5>
                    )}
                </div>

                <div className="icon-container d-flex align-items-center">
                    <button
                        onClick={handleEdit}
                        className="btn btn-light btn-sm p-1"
                        aria-label="Edit Title"
                    >
                        <FiEdit />
                    </button>
                </div>
            </div>

            {/* -- Main Content -- */}
            <div className="card-content-container d-flex flex-column">
                {!isEditing && (
                    <div className="flex-grow-1">
                        <CardContentRender content={content} imageMap={imageMap} />
                    </div>
                )}

                {isEditing && (
                    <>
                        <div className="card-live-preview flex-grow-1">
                            <CardContentRender content={content} imageMap={imageMap} />
                        </div>
                        <textarea
                            value={content || ''}
                            onChange={(e) => handleContentChange(e.target.value)}
                            onPaste={handlePaste}
                            className="form-control editor-textarea flex-grow-1"
                            rows="8"
                        />
                        <div className="d-flex justify-content-end mt-1">
                            <button
                                onClick={handleUploadClick}
                                className="btn btn-light btn-sm"
                                aria-label="Upload Image"
                            >
                                <FiUpload />
                            </button>
                            <input
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                ref={fileInputRef}
                                onChange={handlePaste}
                            />
                        </div>
                        <div className="d-flex gap-2 mt-3">

                            <button
                                onClick={handleSave}
                                className="btn btn-success btn-sm p-2"
                            >
                                <FiSave className="me-1" />
                                Save
                            </button>
                            <button
                                onClick={handleCancel}
                                className="btn btn-secondary btn-sm p-2"
                            >
                                <FiArrowLeft className="me-1" />
                                Cancel
                            </button>
                        </div>
                    </>
                )}

            </div>

            {/* -- Footer -- */}
            <div className="card-footer">
                <div className="d-flex flex-wrap align-items-center gap-2">
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

            {/* -- Modals -- */}
            <VersionModal
                show={showVersionModal}
                onClose={() => setShowVersionModal(false)}
                versions={versions}
                onSelect={handleSelectVersion}
                onAddVersion={handleAddVersion}
                isEditing={true}
            />

            <LanguageModal
                show={showLanguageModal}
                onClose={() => setShowLanguageModal(false)}
                currentLanguages={currentLanguages}
                allLanguages={allLanguages}
                onSelect={(langId) => setActiveLang(langId)}
                onAddLanguage={handleAddLanguageToVersion}
                isEditing={true}
            />

            <NodeModal
                show={showNodeModal}
                onClose={() => setShowNodeModal(false)}
                nodes={nodeList}
                onSelect={handleSelectNode}
                currentNode={nodeInfo}
            />
        </div>
    );
};

export default CardDetail;