import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CardList from 'components/contents/CardList'; // Import the CardList component
import { getRequest } from 'apis/apiService';
import ENDPOINTS from 'apis/endpoints';

const ProjectDetail = () => {
    const { id } = useParams(); // Retrieve the dynamic parameter `id`
    const [project, setProject] = useState(null); // Store the entire project response
    const [projectType, setProjectType] = useState("Public"); // Default project type

    useEffect(() => {
        const fetchProjectContent = async () => {
            try {
                const data = await getRequest(ENDPOINTS.PROJECTS.WITH_ID(id)); // Fetch data with project ID
                console.log(data);
                setProject(data); // Update state with the fetched project data
                setProjectType(data.visibility.charAt(0).toUpperCase() + data.visibility.slice(1)); // Update project type based on visibility
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

    if (!project) {
        return <div>Loading...</div>; // Show loading state while fetching data
    }

    const { title, node_info, cards } = project;

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h1 className="h4 mb-0">{title}</h1>
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

            <div className="mb-3">
                <h2 className="h5">Node Info</h2>
                <p><strong>Name:</strong> {node_info.name}</p>
                <p><strong>Tag:</strong> {node_info.tag}</p>
                <p><strong>Category:</strong> {node_info.category}</p>
            </div>

            <CardList notes={cards.map(card => ({
                id: card.id,
                contents: card.contents.map(content => ({
                    id: content.id,
                    title: content.title,
                    content: content.content
                }))
            }))} /> {/* Render CardList with the fetched cards */}
        </div>
    );
};

export default ProjectDetail;
