import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CardListDetail.css';
import { FiEdit } from 'react-icons/fi';

// We'll use our contexts to get the list of languages and nodes
import { useLanguagesData } from 'context_data/LanguageDataContext';
import { useGraphData } from 'context_data/GraphDataContext';
import CardView from './CardView';

// ----------------------------------------------------------------
// Modal for creating a new card
// ----------------------------------------------------------------
const NewCardModal = ({ show, onClose, onCreate }) => {
    const allLanguages = useLanguagesData();
    const graphData = useGraphData();

    // Safe checks (you can adapt these if your data structure differs)
    const languages = allLanguages || [];
    const nodes = graphData?.nodes || [];

    // Local state for the user’s choices
    const [selectedLang, setSelectedLang] = useState('');
    const [selectedNode, setSelectedNode] = useState('');

    // Called when user clicks "Create" in the modal
    const handleCreate = () => {
        // If either is not selected, you might want to show a warning or just prevent creation
        if (!selectedLang || !selectedNode) {
            // For example, do nothing or show an alert
            return;
        }

        // Find the node object from the ID
        const foundNode = nodes.find((n) => n.id === selectedNode);

        // We pass the selected language + node up to the parent
        onCreate(selectedLang, foundNode);
    };

    // If `show` is false, we don’t render anything
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

    // State that determines whether the "New Card" modal is visible
    const [showNewCardModal, setShowNewCardModal] = useState(false);

    useEffect(() => {
        if (cards) {
            setCurrentCards(cards);
        }
    }, [cards]);

    // Show the "New Card" modal
    const handleOpenNewCardModal = () => {
        setShowNewCardModal(true);
    };

    // Hide the "New Card" modal
    const handleCloseNewCardModal = () => {
        setShowNewCardModal(false);
    };

    // Actually create the new card
    // Called once user selects language + node in the popup and clicks "Create"
    const handleAddCard = (language_id, nodeInfo) => {
        const newId = Date.now(); // Unique ID for the new card

        // Example structure to match your Card.jsx usage:
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

        // Insert the new card at the top
        setCurrentCards((prev) => [newCard, ...prev]);

        // onCardSaved(newCard); // Notify the parent component about the new card
    };

    return (
        <div className="container mt-4">
            {/* Our "Create New Card" modal */}
            <NewCardModal
                show={showNewCardModal}
                onClose={handleCloseNewCardModal}
                onCreate={(langId, nodeObj) => {
                    // Create the card
                    handleAddCard(langId, nodeObj);
                    // Close modal
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