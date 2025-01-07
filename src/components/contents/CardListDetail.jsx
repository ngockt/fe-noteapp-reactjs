// src/components/contents/CardListDetail.js
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CardList.css'; // Your CSS
import { FiEdit } from 'react-icons/fi';

// Contexts
import { useLanguagesData } from 'context_data/LanguageDataContext';
import { useGraphData } from 'context_data/GraphDataContext';
import CardView from './CardView';

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

const CardListDetail = ({ cards }) => {
    const [currentCards, setCurrentCards] = useState(cards || []);

    // State for "New Card" modal
    const [showNewCardModal, setShowNewCardModal] = useState(false);

    useEffect(() => {
        if (cards) {
            setCurrentCards(cards);
        }
    }, [cards]);

    // Show/hide modal
    const handleOpenNewCardModal = () => setShowNewCardModal(true);
    const handleCloseNewCardModal = () => setShowNewCardModal(false);

    // Create the new card
    const handleAddCard = (language_id, nodeInfo) => {
        const newId = Date.now(); // Unique ID

        const newCard = {
            id: newId,
            node_info: nodeInfo,
            versions: [
                {
                    version: '1.0.0',
                    contents: [
                        {
                            language_id: language_id,
                            title: 'Untitled',
                            content: '',
                        },
                    ],
                },
            ],
        };

        // Insert at top
        setCurrentCards((prev) => [newCard, ...prev]);
    };

    return (
        <div className="container mt-4">
            {/* "Create New Card" modal */}
            <NewCardModal
                show={showNewCardModal}
                onClose={handleCloseNewCardModal}
                onCreate={(langId, nodeObj) => {
                    handleAddCard(langId, nodeObj);
                    handleCloseNewCardModal();
                }}
            />

            <div className="d-flex justify-content-end mb-3">
                <button
                    onClick={handleOpenNewCardModal}
                    className="btn btn-primary d-flex align-items-center"
                >
                    <FiEdit className="me-2" />
                    New Card
                </button>
            </div>

            <div className="row">
                {currentCards.map((card) => (
                    <div className="col-md-4 mb-3" key={card.id}>
                        <CardView
                            card={card}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CardListDetail;
