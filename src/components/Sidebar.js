import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import './Sidebar.css';

const Sidebar = () => {
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleProjects = () => {
    setIsProjectsOpen(!isProjectsOpen);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <div className={`sidebar-container ${isSidebarOpen ? '' : 'collapsed'}`}>
        <div className="sidebar-header">
          <IconButton onClick={toggleSidebar} className="toggle-button" size="small">
            <MenuIcon style={{ color: 'white' }} />
          </IconButton>
          {isSidebarOpen && <h2 className="sidebar-title">Menu</h2>}
        </div>

        {isSidebarOpen && (
          <>
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
                {/* "New Project ..." link (add button) can stay or be hidden conditionally if needed */}
                <Link to="/projects/more" className="submenu-link">New Project ...</Link>
                <Link to="/maps?subject=linear-algebra" className="submenu-link">Study Linear Algebra</Link>
                <Link to="/maps?branch=calculus" className="submenu-link">Study Calculus</Link>
                <Link to="/projects/more" className="submenu-link">More ...</Link>
              </div>
            )}

            <Link to="/contact" className="sidebar-link">Contact</Link>
            <Link to="/about" className="sidebar-link">About</Link>
          </>
        )}
      </div>

      {/* If you want the toggle button always visible even when collapsed, it's already included in the sidebar-header */}
    </>
  );
};

export default Sidebar;
