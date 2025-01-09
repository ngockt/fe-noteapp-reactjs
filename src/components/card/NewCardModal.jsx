// src/components/contents/CardListDetail.js
import React, { useState } from 'react';
import './CardList.css'; // Your CSS

// Contexts
import { useLanguagesData } from 'context_data/LanguageDataContext';
import { useGraphData } from 'context_data/GraphDataContext';

// ----------------------------------------------------------------
// Modal for creating a new card
// ----------------------------------------------------------------
const NewCardModal = ({ show, onClose, onCreate }) => {
    const allLanguages = useLanguagesData();
    const graphData = useGraphData();

    // Safe checks
    const languages = allLanguages || [];
    const nodes = graphData?.nodes || [];

    // Local state for choices
    const [selectedLang, setSelectedLang] = useState('');
    const [selectedNode, setSelectedNode] = useState('');

    // Handle "Create" button in modal
    const handleCreate = () => {
        if (!selectedLang || !selectedNode) {
            return;
        }

        // Find the node object from the ID
        const foundNode = nodes.find((n) => n.id === selectedNode);

        onCreate(selectedLang, foundNode);
    };

    if (!show) return null;

    return (
        <div
            className="modal show"
            style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }}
            tabIndex="-1"
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    {/* HEADER */}
                    <div className="modal-header">
                        <h5 className="modal-title">Create New Card</h5>
                        <button
                            type="button"
                            className="btn-close"
                            aria-label="Close"
                            onClick={onClose}
                        />
                    </div>

                    {/* BODY */}
                    <div className="modal-body">
                        <div className="mb-3">
                            <label htmlFor="languageSelect" className="form-label">
                                Language
                            </label>
                            <select
                                id="languageSelect"
                                className="form-select"
                                value={selectedLang}
                                onChange={(e) => setSelectedLang(e.target.value)}
                            >
                                <option value="">-- Select a language --</option>
                                {languages.map((lang) => (
                                    <option key={lang.id} value={lang.id}>
                                        {lang.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="nodeSelect" className="form-label">
                                Node
                            </label>
                            <select
                                id="nodeSelect"
                                className="form-select"
                                value={selectedNode}
                                onChange={(e) => setSelectedNode(e.target.value)}
                            >
                                <option value="">-- Select a node --</option>
                                {nodes.map((node) => (
                                    <option key={node.id} value={node.id}>
                                        {node.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* FOOTER */}
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleCreate}
                        >
                            Create
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewCardModal;
