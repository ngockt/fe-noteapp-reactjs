import React, { useState } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Header = () => {
    const location = useLocation(); // Get the current location
    const [expanded, setExpanded] = useState(false); // Track the expanded state

    const handleNavItemClick = () => {
        setExpanded(false); // Collapse the navbar when a Nav item is clicked
    };

    return (
        <Navbar
            bg="dark"
            variant="dark"
            expand="sm"
            className="mb-0 ps-2"
            expanded={expanded} // Control expanded state
            onToggle={() => setExpanded(!expanded)} // Toggle expanded state
        >
            <Navbar.Brand as={Link} to="/">
                Laboratory
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ms-auto">
                    <Nav.Link
                        as={Link}
                        to="/dashboard"
                        active={location.pathname === "/dashboard"}
                        onClick={handleNavItemClick} // Handle click to collapse
                    >
                        Dashboard
                    </Nav.Link>
                    <Nav.Link
                        as={Link}
                        to="/explore"
                        active={location.pathname === "/explore"}
                        onClick={handleNavItemClick}
                    >
                        Explore
                    </Nav.Link>
                    <Nav.Link
                        as={Link}
                        to="/contribution"
                        active={location.pathname === "/contribution"}
                        onClick={handleNavItemClick}
                    >
                        Contribution
                    </Nav.Link>
                    <Nav.Link
                        as={Link}
                        to="/projects"
                        active={location.pathname === "/projects"}
                        onClick={handleNavItemClick}
                    >
                        Projects
                    </Nav.Link>
                    <Nav.Link
                        as={Link}
                        to="/contact"
                        active={location.pathname === "/contact"}
                        onClick={handleNavItemClick}
                    >
                        Contact
                    </Nav.Link>
                    <Nav.Link
                        as={Link}
                        to="/about"
                        active={location.pathname === "/about"}
                        onClick={handleNavItemClick}
                    >
                        About
                    </Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default Header;
