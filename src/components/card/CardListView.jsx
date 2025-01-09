// src/components/contents/CardListView.jsx
import React, { useState, useEffect } from 'react';
import CardView from './CardView';
import './CardList.css'; // Reuse the same CSS

const CardListView = ({ cards }) => {
    const [currentCards, setCurrentCards] = useState(cards || []);

    useEffect(() => {
        if (cards) {
            setCurrentCards(cards);
        }
    }, [cards]);

    return (
        <div className="container mt-3">
            <div className="row">
                {currentCards.map((card) => (
                    <div className="col-md-4 mb-3" key={card.id}>
                        <CardView card={card} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CardListView;