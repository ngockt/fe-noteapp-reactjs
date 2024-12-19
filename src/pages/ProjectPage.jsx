import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import FetchData from 'components/apis/FetchData';
import StudySetOverview from 'components/project/ProjectOverview';
import NewStudySet from 'components/project/NewProject';

const ProjectPage = () => {
    const [studySets, setStudySets] = useState([]);
    const [nodes, setNodes] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchStudySets = async () => {
        const data = await FetchData('/projects');
        setStudySets(data);
    };

    const fetchNodes = async () => {
        const data = await FetchData('/maps/list');
        setNodes(data);
    };

    useEffect(() => {
        fetchStudySets();
        fetchNodes();
    }, []);

    const handleAddNewSet = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleRefreshData = async () => {
        await fetchStudySets();
        await fetchNodes(); // Refresh nodes after adding a new study set
    };

    return (
        <div className="container mt-4">
            {/* Header Section */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">Projects</h2>
                <button className="btn btn-primary" onClick={handleAddNewSet}>
                    New Project
                </button>
            </div>

            {/* Projects Grid */}
            <div className="row">
                {studySets.map((s) => (
                    <div className="col-lg-3 col-md-3 col-sm-3 mb-2" key={s.id}>
                        <StudySetOverview id={s.id} title={s.title} category={s.category} tag={s.tag} />
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && <NewStudySet onClose={closeModal} onRefreshData={handleRefreshData} />}
        </div>
    );
};

export default ProjectPage;
