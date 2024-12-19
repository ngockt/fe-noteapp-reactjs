import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CardList from 'components/contents/CardList'; // Import the CardList component
import FetchData from 'components/apis/FetchData'; // Import the FetchData utility

const ProjectDetail = () => {
    const { id } = useParams(); // Retrieve the dynamic parameter `id`
    const [notes, setNotes] = useState([]);

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

    return (
        <div>
            <h1>Project Details</h1>
            <p>Project ID: {id}</p>
            <CardList notes={notes} /> {/* Render CardList with the fetched notes */}
        </div>
    );
};

export default ProjectDetail;
