import React from 'react';
import { useParams } from 'react-router-dom';

const StudySetDetails = () => {
  const { id } = useParams(); // Retrieve the dynamic parameter `id`

  return (
    <div>
      <h1>Study Set Details</h1>
      <p>Study Set ID: {id}</p>
      {/* Add logic to fetch and display study set details based on the ID */}
    </div>
  );
};

export default StudySetDetails;
