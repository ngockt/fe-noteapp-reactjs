import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import FetchData from 'components/apis/FetchData';
import StudySetOverview from 'components/study-set/StudySetOverview';
import NewStudySet from 'components/study-set/NewStudySet';

const StudySetPage = () => {
    const [studySets, setStudySets] = useState([]);
    const [nodes, setNodes] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchStudySets = async () => {
        const data = await FetchData('/study-sets');
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
        <div>
            <h2>Study Sets</h2>
            <button className="btn btn-primary mb-3" onClick={handleAddNewSet}>
                Add New Study Set
            </button>
            <div className="container">
                <div className="row">
                    {studySets.map((s) => (
                        <div className="col-md-4 mb-3" key={s.id}>
                            <StudySetOverview id={s.id} title={s.title} category={s.category} tag={s.tag} />
                        </div>
                    ))}
                </div>
            </div>
            {isModalOpen && <NewStudySet onClose={closeModal} onRefreshData={handleRefreshData} />}
        </div>
    );
};

export default StudySetPage;
