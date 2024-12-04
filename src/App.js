import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';

import NewFeed from './components/NewFeed';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import Graph from './components/Graph';
import styled from 'styled-components';

// Main content container, pushing it aside to make room for the sidebar
const ContentContainer = styled.div`
  margin-left: 250px;
  padding: 20px;
`;

const App = () => {
  return (
    <Router>
      <Sidebar />
      <ContentContainer>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/newfeed" element={<NewFeed />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/graph" element={<Graph />} />
        </Routes>
      </ContentContainer>
    </Router>
  );
};

export default App;
