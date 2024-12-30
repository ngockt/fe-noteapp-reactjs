import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ProjectOverview from 'components/project/ProjectOverview';
import NewProject from 'components/project/ProjectNew';
import { getRequest } from 'apis/apiService';
import ENDPOINTS from 'apis/endpoints';

const ProjectPage = () => {
    const [projects, setProjects] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('me'); // State for active tab

    const fetchProjects = async () => {
        let endpoint;

        // Determine the endpoint based on the activeTab
        switch (activeTab) {
            case 'me':
                endpoint = ENDPOINTS.PROJECTS.ME;
                break;
            case 'group':
                endpoint = ENDPOINTS.PROJECTS.GROUP;
                break;
            case 'community':
                endpoint = ENDPOINTS.PROJECTS.COMMUNITY;
                break;
            default:
                endpoint = ENDPOINTS.PROJECTS.ME;
        }

        // Fetch projects from the determined endpoint
        try {
            const data = await getRequest(endpoint);
            setProjects(data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, [activeTab]); // Re-fetch projects whenever the activeTab changes

    const handleAddProject = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleRefreshData = async () => {
        await fetchProjects(); // Refresh data after adding a new study set
    };

    return (
        <div className="container mt-4">
            {/* Header Section */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">Projects</h2>
                <button className="btn btn-primary" onClick={handleAddProject}>
                    New Project
                </button>
            </div>

            {/* Tabs Section */}
            <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'me' ? 'active' : ''}`}
                        onClick={() => setActiveTab('me')}
                    >
                        Me
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'group' ? 'active' : ''}`}
                        onClick={() => setActiveTab('group')}
                    >
                        Group
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'community' ? 'active' : ''}`}
                        onClick={() => setActiveTab('community')}
                    >
                        Community
                    </button>
                </li>
            </ul>

            {/* Projects Grid */}
            <div className="row">
                {projects.length > 0 ? (
                    projects.map((project) => (
                        <div
                            className="col-lg-4 col-md-6 col-sm-12 mb-4 d-flex align-items-stretch"
                            key={project.id}
                        >
                            <ProjectOverview
                                id={project.id}
                                title={project.title}
                                category={project.node_info.category}
                                tag={project.node_info.tag}
                            />
                        </div>
                    ))
                ) : (
                    <div className="col-12 text-center">
                        <p>No projects available to display.</p>
                    </div>
                )}
            </div>


            {/* Modal */}
            {isModalOpen && <NewProject onClose={closeModal} onRefreshData={handleRefreshData} />}
        </div>
    );
};

export default ProjectPage;
