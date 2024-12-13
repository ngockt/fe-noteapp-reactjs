import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);

  const toggleProjects = () => {
    setIsProjectsOpen(!isProjectsOpen);
  };

  return (
    <div className="sidebar-container">
      <Link to="/" className="sidebar-link">Home</Link>
      <Link to="/myfeed" className="sidebar-link">MyFeed</Link>
      <Link to="/discover" className="sidebar-link">Discover</Link>
      <Link to="/maps" className="sidebar-link">Maps</Link>

      {/* Projects Link with Toggle */}
      <div className="sidebar-link" onClick={toggleProjects}>
        Projects
        <span className={`toggle-icon ${isProjectsOpen ? 'open' : ''}`}>▶</span>
      </div>

      {/* Submenu for Projects */}
      {isProjectsOpen && (
        <div className="submenu">
          <Link to="/projects/more" className="submenu-link">New Project ...</Link>
          <Link to="/maps?subject=linear-algebra" className="submenu-link">Study Linear Algebra</Link>
          <Link to="/maps?branch=calculus" className="submenu-link">Study Calculus</Link>
          <Link to="/projects/more" className="submenu-link">More ...</Link>
        </div>
      )}

      <Link to="/contact" className="sidebar-link">Contact</Link>
      <Link to="/about" className="sidebar-link">About</Link>
    </div>
  );
};

export default Sidebar;
