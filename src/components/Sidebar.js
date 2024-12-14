import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`sidebar-container ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <button className="toggle-button" onClick={toggleSidebar}>
          {isCollapsed ? '☰' : '✖'}
        </button>
      </div>
      <Link to="/" className="sidebar-link" data-tooltip="Home">
        <span className="icon">🏠</span>
        {!isCollapsed && 'Home'}
      </Link>
      <Link to="/myfeed" className="sidebar-link" data-tooltip="MyFeed">
        <span className="icon">📃</span>
        {!isCollapsed && 'MyFeed'}
      </Link>
      <Link to="/discover" className="sidebar-link" data-tooltip="Discover">
        <span className="icon">🔍</span>
        {!isCollapsed && 'Discover'}
      </Link>
      <Link to="/maps" className="sidebar-link" data-tooltip="Maps">
        <span className="icon">🗺️</span>
        {!isCollapsed && 'Maps'}
      </Link>
      <Link to="/projects"className="sidebar-link" data-tooltip="Projects">
        <span className="icon">📂</span>
        {!isCollapsed && 'Projects'}
      </Link>
      <Link to="/contact" className="sidebar-link" data-tooltip="Contact">
        <span className="icon">📞</span>
        {!isCollapsed && 'Contact'}
      </Link>
      <Link to="/about" className="sidebar-link" data-tooltip="About">
        <span className="icon">ℹ️</span>
        {!isCollapsed && 'About'}
      </Link>
    </div>
  );
};

export default Sidebar;
