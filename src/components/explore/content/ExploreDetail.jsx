// src/components/pages/ExploreDetail.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import CardListView from 'components/contents/CardListView';
import ENDPOINTS from 'apis/endpoints';
import { getRequest } from 'apis/services';

const ExploreDetail = () => {
    const { nodeId } = useParams();
    const [meCards, setMeCards] = useState([]);
    const [groupCards, setGroupCards] = useState([]);
    const [communityCards, setCommunityCards] = useState([]);
    const [activeTab, setActiveTab] = useState('me');


    useEffect(() => {
        const fetchData = async () => {
            try {
                const meEndpoint = ENDPOINTS.CARDS.NODE_ME(nodeId);
                const groupEndpoint = ENDPOINTS.CARDS.NODE_GROUP(nodeId);
                const communityEndpoint = ENDPOINTS.CARDS.NODE_COMMUNITY(nodeId);

                const meData = await getRequest(meEndpoint);
                const groupData = await getRequest(groupEndpoint);
                const communityData = await getRequest(communityEndpoint);

                console.log('Fetched data:', { meData, groupData, communityData });
                setMeCards(meData);
                setGroupCards(groupData);
                setCommunityCards(communityData);
            } catch (error) {
                console.error('Error fetching cards:', error);
            }
        };

        fetchData();
    }, [nodeId]);


    return (
        <div className="container mt-4">
            <h3>Explore Node: {nodeId}</h3>
            <ul className="nav nav-tabs" id="myTab" role="tablist">
                <li className="nav-item" role="presentation">
                    <button
                        className={`nav-link ${activeTab === 'me' ? 'active' : ''}`}
                        id="me-tab"
                        type="button"
                        role="tab"
                        aria-controls="me"
                        aria-selected={activeTab === 'me'}
                        onClick={() => setActiveTab('me')}

                    >
                        Me
                    </button>
                </li>
                <li className="nav-item" role="presentation">
                    <button
                         className={`nav-link ${activeTab === 'group' ? 'active' : ''}`}
                        id="group-tab"
                         type="button"
                        role="tab"
                        aria-controls="group"
                        aria-selected={activeTab === 'group'}
                        onClick={() => setActiveTab('group')}
                    >
                        Group
                    </button>
                </li>
                <li className="nav-item" role="presentation">
                    <button
                         className={`nav-link ${activeTab === 'community' ? 'active' : ''}`}
                        id="community-tab"
                         type="button"
                        role="tab"
                        aria-controls="community"
                        aria-selected={activeTab === 'community'}
                        onClick={() => setActiveTab('community')}
                    >
                        Community
                    </button>
                </li>
            </ul>
            <div className="tab-content mt-3" id="myTabContent">
                <div
                    className={`tab-pane fade ${activeTab === 'me' ? 'show active' : ''}`}
                    id="me"
                    role="tabpanel"
                    aria-labelledby="me-tab"
                >
                     <CardListView cards={meCards} />
                </div>
                <div
                    className={`tab-pane fade ${activeTab === 'group' ? 'show active' : ''}`}
                    id="group"
                    role="tabpanel"
                    aria-labelledby="group-tab"
                >
                    <CardListView cards={groupCards} />
                </div>
                <div
                    className={`tab-pane fade ${activeTab === 'community' ? 'show active' : ''}`}
                    id="community"
                    role="tabpanel"
                    aria-labelledby="community-tab"
                >
                      <CardListView cards={communityCards} />
                </div>
            </div>
        </div>
    );
};

export default ExploreDetail;