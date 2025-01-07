import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import ENDPOINTS from 'apis/endpoints';
import { getRequest } from 'apis/services';
import CardListView from 'components/card/CardListView';
const DashBoardPage = () => {
    const [cards, setCards] = useState([]);
    const [activeTab, setActiveTab] = useState('Me'); // State to manage active tab

    useEffect(() => {
        const setData = async () => {
            let endpoint;
            switch (activeTab) {
                case 'Me':
                    endpoint = ENDPOINTS.CARDS.ME;
                    break;
                case 'Community':
                    endpoint = ENDPOINTS.CARDS.COMMUNITY;
                    break;
                case 'Group':
                    endpoint = ENDPOINTS.CARDS.GROUP;
                    break;
                default:
                    alert("Do not support", activeTab)
            }
            const data = await getRequest(endpoint)
            console.log(endpoint, data);
            setCards(data);
        };
        setData();
    }, [activeTab]); // Refetch data when activeTab changes

    return (
        <div className="container mt-4">
            {/* Bootstrap Tabs */}
            <ul className="nav nav-tabs">
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'Me' ? 'active' : ''}`}
                        onClick={() => setActiveTab('Me')}
                    >
                        Me
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'Group' ? 'active' : ''}`}
                        onClick={() => setActiveTab('Group')}
                    >
                        Group
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'Community' ? 'active' : ''}`}
                        onClick={() => setActiveTab('Community')}
                    >
                        Community
                    </button>
                </li>
            </ul>

            {/* Content */}
            <div className="mt-3">
                <CardListView cards={cards} />
            </div>
        </div>
    );
};

export default DashBoardPage;
