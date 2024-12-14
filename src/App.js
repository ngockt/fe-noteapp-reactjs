import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import styled from 'styled-components';

import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import MyFeed from './pages/MyFeed';
import Discover from './pages/Discover';
import About from './pages/About';
import Contact from './pages/Contact';
import Projects from './pages/Projects';
import Graph from './components/Core/Graphs/Graph';

// Adjust content margin based on the sidebar's state
const ContentContainer = styled.div`
  margin-left: ${({ isCollapsed }) => (isCollapsed ? '50px' : '150px')};
  padding: 20px;
  transition: margin-left 0.3s ease;
`;

const App = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <Router>
      <Sidebar setIsCollapsed={setIsCollapsed} isCollapsed={isCollapsed} />
      <ContentContainer isCollapsed={isCollapsed}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/myfeed" element={<MyFeed />} />
          <Route path="/dicovery" element={<Discover />} />
          <Route path="/maps" element={<Graph />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/maps?subject=linear-algebra" element={<Graph url='/maps?subject=linear-algebra' />} />
          <Route path="/projects/calculus" element={<Graph url='/maps?branch=calculus' />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/graph" element={<Graph />} />
        </Routes>
      </ContentContainer>
    </Router>
  );
};

export default App;
