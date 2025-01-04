// src/components/contents/Card.jsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import {
  FiEdit,
  FiSave,
  FiArrowLeft,
  FiMaximize,
  FiMinimize,
  FiUpload
} from 'react-icons/fi';

import 'katex/dist/katex.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { v4 as uuidv4 } from 'uuid'; // For generating UUIDs

import Mermaid from './rendering/Mermaid';
import PlantUML from './rendering/PlantUML';
import './Card.css';

import VersionModal from './VersionModal';
import LanguageModal from './LanguageModal';
import NodeModal from './NodeModal';

import { useLanguagesData } from 'context_data/LanguageDataContext';
import { useGraphData } from 'context_data/GraphDataContext';


const Card = ({ card, onSave, isNew, onCloseEditor }) => {
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

  const [nodeInfo, setNodeInfo] = useState(card.node_info || null);

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
  // 7.1) PASTE IMAGE HANDLER (store image in state as base64)
  // -------------------------------------------------------------------
  const [imageMap, setImageMap] = useState({});
  const fileInputRef = useRef(null);

  const handlePaste = async (e) => {
    if (!isEditing) return; // Only handle if in edit mode

    const files = e.clipboardData?.files || (e.target?.files ? Array.from(e.target.files) : []);

    if (files.length > 0) {
      const file = files[0];
      if (file && file.type.startsWith('image/')) {
        e.preventDefault();

        // Generate a UUID for the image
        const imageUUID = uuidv4();

        // Read the file as a Data URL
        const reader = new FileReader();
        reader.onload = (loadEvent) => {
          const dataURL = loadEvent.target.result;

          // 1) Store the Data URL in state
          setImageMap(prev => ({ ...prev, [imageUUID]: dataURL }));

          // 2) Insert a Markdown reference using the custom `ls://<UUID>` syntax
          const markdownRef = `![Pasted Image](${imageUUID})\n`;

          // 3) Update the editor content with the new Markdown reference
          setVersions((prevVersions) =>
            prevVersions.map((versionObj) => {
              if (versionObj.version !== activeVersion) return versionObj;

              const updatedContents = versionObj.contents.map((item) => {
                if (item.language_id === activeLang) {
                  const updatedContent = (item.content || '') + markdownRef;
                  return { ...item, content: updatedContent };
                }
                return item;
              });

              return { ...versionObj, contents: updatedContents };
            })
          );
        };

        reader.readAsDataURL(file);
      }
    }
    if (e.target?.files) {
      // Clear the file input after processing
      e.target.value = null;
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };


  // -------------------------------------------------------------------
  // 8) Markdown & code block rendering
  // -------------------------------------------------------------------
  const preprocessContent = (text) => {
    text = text
      // Convert \( ... \) to $ ... $
      .replace(/\\\(([\s\S]*?)\\\)/g, function (match, p1) {
        return `$${p1}$`;
      })

      // Convert \[ ... \] to $$ ... $$
      .replace(/\\\[([\s\S]*?)\\\]/g, function (match, p1) {
        return `$$${p1}$$`;
      });
    return text;
  };

  // Custom image renderer
  const ImageRenderer = ({ src, alt }) => {
    console.log("ImageRenderer called with src:", src, "alt:", alt);
    const dataURL = imageMap[src] || '';
    return dataURL ? <img src={dataURL} alt={alt} style={{ maxWidth: '100%' }} /> : null;
  };

  // You can still add custom renderers for code blocks (mermaid, plantuml, etc.)
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
    img: ImageRenderer, // Use the custom image renderer
  };

  // -------------------------------------------------------------------
  // 9) Final Save
  // -------------------------------------------------------------------
  const handleSave = () => {
    setIsEditing(false);
    onSave(
      {
        ...card,
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

  // Before rendering, transform "ls://<uuid>" references -> data URLs
  const processedContent = content;

  // Determine the extra class if in fullscreen + editing
  const contentContainerClass =
    isFullScreen && isEditing ? 'fullscreen-edit-mode' : '';

  return (
    <>
      <div className={`card border-primary shadow ${isFullScreen ? 'fullscreen-card' : ''}`}>
        {/* --- CARD HEADER (title on the left, icons on the right) --- */}
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
              className="btn btn-light btn-sm"
              aria-label="Edit Title"
            >
              <FiEdit />
            </button>
            <button
              onClick={handleFullScreenToggle}
              className="btn btn-light btn-sm me-2"
              aria-label="Toggle Fullscreen"
            >
              {isFullScreen ? <FiMinimize /> : <FiMaximize />}
            </button>
          </div>
        </div>

        {/* --- CARD BODY (main content) --- */}
        <div className="card-body">
          <div className={`card-content-container ${contentContainerClass}`}>
            {/* Live Preview (only shown when editing & there's content) */}
            {isEditing && content.trim() && (
              <>
                <h6 className="mt-2">Live Preview:</h6>
                <div className="live-preview">
                  <ReactMarkdown
                    components={MarkdownComponents}
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                  >
                    {preprocessContent(processedContent)}
                  </ReactMarkdown>
                </div>
              </>
            )}

            {isEditing ? (
              <>
                <textarea
                  value={content}
                  onChange={handleContentChange}
                  onPaste={handlePaste}
                  className="form-control editor-textarea"
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
              </>
            ) : (
              <ReactMarkdown
                components={MarkdownComponents}
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
              >
                {preprocessContent(processedContent)}
              </ReactMarkdown>
            )}
          </div>

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

        {/* --- CARD FOOTER (versions, language, node selection) --- */}
        <div className="card-footer d-flex flex-wrap align-items-center gap-2 p-2">
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
        onAddVersion={handleAddVersion}
      />

      {/* -- Language Modal -- */}
      <LanguageModal
        show={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
        currentLanguages={currentLanguages}
        allLanguages={allLanguages}
        onSelect={(langId) => setActiveLang(langId)}
        onAddLanguage={handleAddLanguageToVersion}
      />

      {/* -- Node Modal -- */}
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