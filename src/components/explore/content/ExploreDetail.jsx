import React from 'react';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const ExploreDetail = () => {
    const { nodeId } = useParams();

    return (
        <div className="container mt-4">
            <h3>Explore Node: {nodeId}</h3>
            <ul className="nav nav-tabs" id="myTab" role="tablist">
                <li className="nav-item" role="presentation">
                    <button
                        className="nav-link active"
                        id="my-cards-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#my-cards"
                        type="button"
                        role="tab"
                        aria-controls="my-cards"
                        aria-selected="true"
                    >
                        My Cards
                    </button>
                </li>
                <li className="nav-item" role="presentation">
                    <button
                        className="nav-link"
                        id="community-cards-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#community-cards"
                        type="button"
                        role="tab"
                        aria-controls="community-cards"
                        aria-selected="false"
                    >
                        Community Cards
                    </button>
                </li>
            </ul>
            <div className="tab-content mt-3" id="myTabContent">
                <div
                    className="tab-pane fade show active"
                    id="my-cards"
                    role="tabpanel"
                    aria-labelledby="my-cards-tab"
                >
                    <div className="alert alert-primary">
                        My Cards content goes here.
                    </div>
                </div>
                <div
                    className="tab-pane fade"
                    id="community-cards"
                    role="tabpanel"
                    aria-labelledby="community-cards-tab"
                >
                    <div className="alert alert-secondary">
                        Community Cards content goes here.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExploreDetail;
