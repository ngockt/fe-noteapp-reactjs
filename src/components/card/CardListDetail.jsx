// src/components/contents/CardListDetail.js
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CardList.css'; // Your CSS
import { FiEdit } from 'react-icons/fi';

// Contexts
import CardView from './CardView';
import NewCardModal from './NewCardModal';


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
        <div className="container mt-3">
            {/* "Create New Card" modal */}
            <NewCardModal
                show={showNewCardModal}
                onClose={handleCloseNewCardModal}
                onCreate={(langId, nodeObj) => {
                    handleAddCard(langId, nodeObj);
                    handleCloseNewCardModal();
                }}
            />

            <div className="d-flex justify-content-end mb-1">
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
