import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from 'pages/Home';
import MyFeed from 'pages/MyFeed';
import Discover from 'pages/Discover';
import About from 'pages/About';
import Contact from 'pages/Contact';
import Header from 'pages/sub-components/Header';
import StudySets from 'pages/StudySetPage'; // The page that lists study sets
import Maps from 'pages/MapPage';
import Footer from 'pages/sub-components/Footer';
import StudySetDetail from 'components/study-set/StudySetDetail';
import './App.css'; // Import the CSS file

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <div className="content-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/myfeed" element={<MyFeed />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/maps" element={<Maps />} />
            <Route path="/study-sets" element={<StudySets />} />
            <Route path="/study-sets/:id" element={<StudySetDetail />} />
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
