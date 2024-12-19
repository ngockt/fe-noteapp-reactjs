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
                        id="me-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#me"
                        type="button"
                        role="tab"
                        aria-controls="me"
                        aria-selected="true"
                    >
                        Me
                    </button>
                </li>
                <li className="nav-item" role="presentation">
                    <button
                        className="nav-link"
                        id="group-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#group"
                        type="button"
                        role="tab"
                        aria-controls="group"
                        aria-selected="false"
                    >
                        Group
                    </button>
                </li>
                <li className="nav-item" role="presentation">
                    <button
                        className="nav-link"
                        id="community-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#community"
                        type="button"
                        role="tab"
                        aria-controls="community"
                        aria-selected="false"
                    >
                        Community
                    </button>
                </li>
            </ul>
            <div className="tab-content mt-3" id="myTabContent">
                <div
                    className="tab-pane fade show active"
                    id="me"
                    role="tabpanel"
                    aria-labelledby="me-tab"
                >
                    <div className="alert alert-primary">
                        Me content goes here.
                    </div>
                </div>
                <div
                    className="tab-pane fade"
                    id="group"
                    role="tabpanel"
                    aria-labelledby="group-tab"
                >
                    <div className="alert alert-warning">
                        Group content goes here.
                    </div>
                </div>
                <div
                    className="tab-pane fade"
                    id="community"
                    role="tabpanel"
                    aria-labelledby="community-tab"
                >
                    <div className="alert alert-secondary">
                        Community content goes here.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExploreDetail;
