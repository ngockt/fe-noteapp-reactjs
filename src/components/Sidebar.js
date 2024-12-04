import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const SidebarContainer = styled.div`
  width: 250px;
  height: 100vh;
  background-color: #333;
  color: white;
  position: fixed;
  top: 0;
  left: 0;
  padding-top: 20px;
`;

const SidebarLink = styled(Link)`
  display: block;
  padding: 15px;
  color: white;
  text-decoration: none;
  margin-bottom: 10px;

  &:hover {
    background-color: #444;
  }
`;

const Sidebar = () => {
  return (
    <SidebarContainer>
      <SidebarLink to="/">Home</SidebarLink>
      <SidebarLink to="/newfeed">NewFeed</SidebarLink>
      <SidebarLink to="/about">About</SidebarLink>
      <SidebarLink to="/contact">Contact</SidebarLink>
      <SidebarLink to="/graph">Graph</SidebarLink>
    </SidebarContainer>
  );
};

export default Sidebar;
