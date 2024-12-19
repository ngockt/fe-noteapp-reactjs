import React from 'react';
import { useParams } from 'react-router-dom';

const StudySetDetails = () => {
  const { id } = useParams(); // Retrieve the dynamic parameter `id`

  return (
    <div>
      <h1>Project Details</h1>
      <p>Project ID: {id}</p>
      {/* Add logic to fetch and display study set details based on the ID */}
    </div>
  );
};

export default StudySetDetails;
