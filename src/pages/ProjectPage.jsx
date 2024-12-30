import React, { useState, useEffect, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ProjectOverview from 'components/project/ProjectOverview';
import ProjectNew from 'components/project/ProjectNew';
import { getRequest } from 'apis/apiService';
import ENDPOINTS from 'apis/endpoints';

const ProjectPage = () => {
    const [projects, setProjects] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('me');

    const fetchProjects = useCallback(async () => {
        let endpoint;

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

        try {
            const data = await getRequest(endpoint);
            setProjects(data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    }, [activeTab]);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const handleAddProject = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleRefreshData = async () => {
        await fetchProjects();
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
            {isModalOpen && <ProjectNew onClose={closeModal} onRefreshData={handleRefreshData} />}
        </div>
    );
};

export default ProjectPage;
