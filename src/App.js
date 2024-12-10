import React from 'react';
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

// Main content container, pushing it aside to make room for the sidebar
const ContentContainer = styled.div`
  margin-left: 250px;
  padding: 20px;
`;

const App = () => {
  console.log('initApp')
  return (
    <Router>
      <Sidebar />
      <ContentContainer>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/myfeed" element={<MyFeed />} />
          <Route path="/dicovery" element={<Discover />} />
          <Route path="/the-maps" element={<Graph url='/graph/fields' />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/linear-algebra" element={<Graph url='/graph/linear-algebra' />} />
          <Route path="/projects/calculus" element={<Graph url='/graph/calculus' />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/graph" element={<Graph />} />
        </Routes>
      </ContentContainer>
    </Router>
  );
};

export default App;
