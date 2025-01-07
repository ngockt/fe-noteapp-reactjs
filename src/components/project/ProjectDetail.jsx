import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CardListDetail from 'components/card/CardListDetail'; // Import the CardListDetail component
import { getRequest, postRequest } from 'apis/services'; // Assuming a postRequest for saving changes
import ENDPOINTS from 'apis/endpoints';

const ProjectDetail = () => {
    const { id } = useParams(); // Retrieve the dynamic parameter `id`
    const [project, setProject] = useState(null); // Store the entire project response
    const [projectType, setProjectType] = useState("Public"); // Default project type
    const [isEditingTitle, setIsEditingTitle] = useState(false); // Track title editing state
    const [title, setTitle] = useState(""); // Store editable title

    // Fetch Project Details
    useEffect(() => {
        const fetchProjectContent = async () => {
            try {
                const data = await getRequest(ENDPOINTS.PROJECTS.WITH_ID(id)); // Fetch data with project ID
                setProject(data); // Update state with the fetched project data
                setProjectType(data.visibility.charAt(0).toUpperCase() + data.visibility.slice(1)); // Update project type
                setTitle(data.title); // Initialize the editable title
            } catch (error) {
                console.error('Error fetching project content:', error);
            }
        };

        fetchProjectContent();
    }, [id]);

    // Handle Project Type Change
    const handleProjectTypeChange = (e) => {
        setProjectType(e.target.value);
        console.log('Project Type changed to:', e.target.value);
    };

    // Handle Invite Click
    const handleInvite = () => {
        console.log('Invite button clicked');
    };

    // Handle Ask to Join Click
    const handleAskToJoin = () => {
        console.log('Ask to Join button clicked');
    };

    // Handle Title Click - Switch to Edit Mode
    const handleTitleClick = () => {
        setIsEditingTitle(true);
    };

    // Handle Title Change
    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    // Save Title and Exit Edit Mode
    const saveTitle = async () => {
        try {
            await postRequest(ENDPOINTS.PROJECTS.UPDATE_TITLE(id), { title });
            setIsEditingTitle(false); // Exit edit mode
        } catch (error) {
            console.error('Error saving title:', error);
            setIsEditingTitle(false);
        }
    };

    const handleTitleBlur = () => saveTitle(); // Save title on blur
    const handleTitleKeyDown = (e) => {
        if (e.key === 'Enter') saveTitle();
        else if (e.key === 'Escape') setIsEditingTitle(false); // Cancel edit
    };

    if (!project) {
        return <div className="text-center py-5">Loading...</div>;
    }

    const { node_info, cards } = project;

    return (
        <div className="container py-4">
            {/* Header Section */}
            <div className="d-flex justify-content-between align-items-center">
                <div>
                    {/* Editable Title */}
                    {isEditingTitle ? (
                        <input
                            type="text"
                            value={title}
                            onChange={handleTitleChange}
                            onBlur={handleTitleBlur}
                            onKeyDown={handleTitleKeyDown}
                            autoFocus
                            className="form-control form-control-sm"
                        />
                    ) : (
                        <h1
                            className="h4 mb-1 clickable"
                            onClick={handleTitleClick}
                            style={{ cursor: 'pointer' }}
                        >
                            {title}
                        </h1>
                    )}
                    <p className="small text-muted mb-0">ID: {id}</p>
                    {node_info.name}
                    <span className="badge  text-dark ms-1">
                        {node_info.category}
                    </span>
                </div>

                {/* Header Actions */}
                <div className="d-flex align-items-center">
                    {/* Visibility Dropdown */}
                    <select
                        id="projectType"
                        className="form-select form-select-sm w-auto me-2"
                        value={projectType}
                        onChange={handleProjectTypeChange}
                    >
                        <option value="Public">Public</option>
                        <option value="Private">Private</option>
                    </select>

                    {/* Action Buttons */}
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

            <CardListDetail cards={cards} />
        </div>
    );
};

export default ProjectDetail;
