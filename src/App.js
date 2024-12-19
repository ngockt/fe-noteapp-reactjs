import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from 'pages/HomePage';
import DashBoardPage from 'pages/DashboardPage';
import Explore from 'pages/ExplorePage';
import About from 'pages/AboutPage';
import Contact from 'pages/ContactPage';
import Header from 'pages/sub-components/Header';
import Maps from 'pages/MapPage';
import Footer from 'pages/sub-components/Footer';
import StudySetDetail from 'components/study-set/StudySetDetail';
import './App.css'; // Import the CSS file
import CardPage from 'pages/CardPage';
import ProjectPage from 'pages/ProjectPage';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <div className="content-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/dashboard" element={<DashBoardPage />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/projects" element={<ProjectPage />} />
            <Route path="/projects/:id" element={<StudySetDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
