import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'; // Import the CSS file
import Home from 'pages/HomePage';
import DashBoardPage from 'pages/DashboardPage';
import Explore from 'pages/ExplorePage';
import About from 'pages/AboutPage';
import Contact from 'pages/ContactPage';
import Header from 'pages/sub-components/Header';
import Footer from 'pages/sub-components/Footer';
import ProjectDetail from 'components/project/ProjectDetail';
import ProjectPage from 'pages/ProjectPage';
import ContributionPage from 'pages/ContributionPage';
import ExploreDetail from 'components/explore/content/ExploreDetail';
import LoginPage from 'pages/LoginPage';
import ProfilePage from 'pages/ProfilePage';
import SignUpPage from 'pages/SignUpPage';
import NotionPage from 'experiments/notion-page/NotionPage';
import PromptingAssistantPage from 'experiments/prompting-assistant/PromptingAssistantPage';
import LatexRenderer from 'experiments/LatexRender';

const App = () => {

  return (
    <Router>
      <div className="app-container">
        <Header />
        <div className="content-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/home" element={<Home />} />
            <Route path="/dashboard" element={<DashBoardPage />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/explore/:nodeId" element={<ExploreDetail />} />
            <Route path="/contribution" element={<ContributionPage />} />
            <Route path="/projects" element={<ProjectPage />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/experiments/notion-page" element={<NotionPage />} />
            <Route path="/experiments/prompting" element={<PromptingAssistantPage />} />
            <Route path="/experiments/latex-render" element={<LatexRenderer />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
