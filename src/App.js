import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import styled from 'styled-components';

import Home from 'pages/Home';
import MyFeed from 'pages/MyFeed';
import Discover from 'pages/Discover';
import About from 'pages/About';
import Contact from 'pages/Contact';
import Header from 'pages/sub-components/Header';
import StudySets from 'pages/StudySets';
import Maps from 'pages/Maps';

// Adjust content margin based on the sidebar's state
const ContentContainer = styled.div`
  padding: 5px;
  transition: margin-left 0.3s ease;
`;

const App = () => {

  return (
    <Router>
      <Header />
      {/* <Sidebar setIsCollapsed={setIsCollapsed} isCollapsed={isCollapsed} /> */}
      <ContentContainer >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/myfeed" element={<MyFeed />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/maps" element={<Maps />} />
          <Route path="/study-sets" element={<StudySets />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </ContentContainer>
    </Router>
  );
};

export default App;
