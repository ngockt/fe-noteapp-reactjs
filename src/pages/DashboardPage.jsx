import React, { useState, useEffect } from 'react';
import CardList from 'components/contents/CardList'; // Import the CardList component
import FetchData from 'apis/FetchData';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const DashBoardPage = () => {
    const [notes, setNotes] = useState([]);
    const [activeTab, setActiveTab] = useState('Me'); // State to manage active tab

    useEffect(() => {
        const setData = async () => {
            let endpoint;
            switch (activeTab) {
                case 'Me':
                    endpoint = '/content/me';
                    break;
                case 'Community':
                    endpoint = '/content/community';
                    break;
                case 'Group':
                    endpoint = '/content/group';
                    break;
                default:
                    endpoint = '/content/me';
            }
            const data = await FetchData(endpoint);
            console.log(endpoint, data);
            setNotes(data);
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
                <CardList notes={notes} />
            </div>
        </div>
    );
};

export default DashBoardPage;
