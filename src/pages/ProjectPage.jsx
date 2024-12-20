import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import FetchData from 'components/apis/FetchData';
import ProjectOverview from 'components/project/ProjectOverview';
import NewProject from 'components/project/ProjectNew';

const ProjectPage = () => {
    const [projects, setProjects] = useState([]);
    const [nodes, setNodes] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('me'); // State for active tab

    const fetchStudySets = async () => {
        const data = await FetchData('/projects');
        setProjects(data);
    };

    const fetchNodes = async () => {
        const data = await FetchData('/maps/list');
        setNodes(data);
    };

    useEffect(() => {
        fetchStudySets();
        fetchNodes();
    }, []);

    const handleAddProject = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleRefreshData = async () => {
        await fetchStudySets();
        await fetchNodes(); // Refresh nodes after adding a new study set
    };

    const renderProjectsByTab = () => {
        // Filter projects based on activeTab
        // switch (activeTab) {
        //     case 'me':
        //         return projects.filter((p) => p.category === 'me');
        //     case 'group':
        //         return projects.filter((p) => p.category === 'group');
        //     case 'community':
        //         return projects.filter((p) => p.category === 'community');
        //     default:
        //         return projects;
        // }
        return projects;
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
                {renderProjectsByTab().map((s) => (
                    <div className="col-lg-3 col-md-3 col-sm-3 mb-2" key={s.id}>
                        <ProjectOverview id={s.id} title={s.title} category={s.category} tag={s.tag} />
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && <NewProject onClose={closeModal} onRefreshData={handleRefreshData} />}
        </div>
    );
};

export default ProjectPage;
