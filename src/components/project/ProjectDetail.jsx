import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CardList from 'components/contents/CardList'; // Import the CardList component
import FetchData from 'apis/FetchData'; // Import the FetchData utility

const ProjectDetail = () => {
    const { id } = useParams(); // Retrieve the dynamic parameter `id`
    const [notes, setNotes] = useState([]);
    const [projectType, setProjectType] = useState("Public"); // Default project type

    useEffect(() => {
        const fetchProjectContent = async () => {
            try {
                const data = await FetchData(`/content/me?id=${id}`); // Fetch data with project ID
                setNotes(data); // Update state with the fetched notes
            } catch (error) {
                console.error('Error fetching project content:', error);
            }
        };

        fetchProjectContent();
    }, [id]);

    const handleProjectTypeChange = (e) => {
        setProjectType(e.target.value);
        console.log('Project Type changed to:', e.target.value);
        // Add logic to handle project type update on the backend if needed
    };

    const handleInvite = () => {
        console.log('Invite button clicked');
        // Add your invite logic here
    };

    const handleAskToJoin = () => {
        console.log('Ask to Join button clicked');
        // Add your ask-to-join logic here
    };

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h1 className="h4 mb-0">Project Details</h1>
                    <div className="d-flex align-items-center">
                        <p className="small text-muted mb-0 me-3">Project ID: {id}</p>
                        <select 
                            id="projectType" 
                            className="form-select form-select-sm w-auto" 
                            value={projectType} 
                            onChange={handleProjectTypeChange}
                        >
                            <option value="Public">Public</option>
                            <option value="Private">Private</option>
                        </select>
                    </div>
                </div>
                <div className="d-flex">
                    <button 
                        className="btn btn-sm btn-primary me-2" 
                        onClick={handleInvite}
                    >
                        Invite
                    </button>
                    <button 
                        className="btn btn-sm btn-secondary" 
                        onClick={handleAskToJoin}
                    >
                        Ask to Join
                    </button>
                </div>
            </div>

            <CardList notes={notes} /> {/* Render CardList with the fetched notes */}
        </div>
    );
};

export default ProjectDetail;
