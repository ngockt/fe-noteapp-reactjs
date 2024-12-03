import React, { useState, useEffect } from 'react';
import D3Graph from './components/D3Graph'; // Graph with zooming
import VisJsGraph from './components/VisJsGraph'; // Graph without zooming
import axiosInstance from './components/axiosInstance'; // Import axios instance
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import EditPage from './components/EditPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/edit/:noteId" element={<EditPage />} />
      </Routes>
    </Router>
  );
}

export default App;
// const App = () => {
//   const [data, setData] = useState(null);
//   const [showZoomableGraph, setShowZoomableGraph] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axiosInstance.get('/graph'); // API endpoint
//         setData(response.data); // Set the data in the state
//       } catch (error) {
//         console.error('Error fetching graph data:', error);
//       }
//     };

//     fetchData();
//   }, []);


//   const toggleGraphView = () => {
//     setShowZoomableGraph(!showZoomableGraph);
//   };
