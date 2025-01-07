import React, { useEffect, useState } from "react";
import { Navbar, Nav, NavDropdown } from "react-bootstrap"; // Import NavDropdown
import { Link, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Header.css";

const Header = () => {
    const location = useLocation();
    const [expanded, setExpanded] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const accessToken = localStorage.getItem("accessToken");
        if (storedUser && accessToken) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleNavItemClick = () => {
        setExpanded(false);
    };

    return (
        <Navbar
            bg="dark"
            variant="dark"
            expand="md"
            className="mb-0 px-3 py-1"
            expanded={expanded}
            onToggle={() => setExpanded(!expanded)}
        >
            <Navbar.Brand as={Link} to="/" onClick={handleNavItemClick}>
                Laboratory
            </Navbar.Brand>

            <Navbar.Toggle aria-controls="basic-navbar-nav" />

            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ms-auto">
                    <Nav.Link
                        as={Link}
                        to="/dashboard"
                        active={location.pathname === "/dashboard"}
                        onClick={handleNavItemClick}
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
                        to="/docs"
                        active={location.pathname === "/about"}
                        onClick={handleNavItemClick}
                    >
                        Docs
                    </Nav.Link>

                    <Nav.Link
                        as={Link}
                        to="/about"
                        active={location.pathname === "/about"}
                        onClick={handleNavItemClick}
                    >
                        About
                    </Nav.Link>

                    {/* Conditional Login/Profile */}
                    {user ? (
                        <Nav.Link
                            as={Link}
                            to="/profile"
                            onClick={handleNavItemClick}
                        >
                            <img
                                src={user.picture}
                                alt="Profile"
                                className="user-profile-image"
                            />
                        </Nav.Link>
                    ) : (
                        <Nav.Link
                            as={Link}
                            to="/login"
                            active={location.pathname === "/login"}
                            onClick={handleNavItemClick}
                        >
                            Login
                        </Nav.Link>
                    )}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default Header;