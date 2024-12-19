import React, { useState, useEffect } from 'react';
import CardList from 'components/contents/CardList'; // Import the CardList component
import FetchData from 'components/apis/FetchData';
import VisNetworkGraph from './explore/graph/VisNetworkGraph';

const ViewContent = ({ show, onClose, content, data }) => {
    const [activeTab, setActiveTab] = useState('myCards'); // Tracks the active tab
    const [myCards, setMyCards] = useState([]); // Data for "My Cards"
    const [communityCards, setCommunityCards] = useState([]); // Data for "Community Cards"

    useEffect(() => {
        if (activeTab === 'myCards') {
            const fetchMyCards = async () => {
                const data = await FetchData('/content/me');
                setMyCards(data);
            };
            fetchMyCards();
        } else if (activeTab === 'communityCards') {
            const fetchCommunityCards = async () => {
                const data = await FetchData('/content/community');
                setCommunityCards(data);
            };
            fetchCommunityCards();
        }
    }, [activeTab]);

    if (!show) {
        return null;
    }

    const renderTabContent = () => {
        switch (activeTab) {
            case 'myCards':
                return (
                    <div>
                        <CardList notes={myCards} />
                    </div>
                );
            case 'communityCards':
                return (
                    <div>
                        <CardList notes={communityCards} />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="modal show d-block" tabIndex="-1" style={{ background: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '90%' }}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Details</h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body">
                        <ul className="nav nav-tabs">
                            <li className="nav-item">
                                <button
                                    className={`nav-link ${activeTab === 'myCards' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('myCards')}
                                >
                                    My Cards
                                </button>
                            </li>
                            <li className="nav-item">
                                <button
                                    className={`nav-link ${activeTab === 'communityCards' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('communityCards')}
                                >
                                    Community Cards
                                </button>
                            </li>
                        </ul>
                        <div className="mt-3">{renderTabContent()}</div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewContent;
