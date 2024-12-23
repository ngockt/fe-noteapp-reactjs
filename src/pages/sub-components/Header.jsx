import React, { useEffect, useState } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Header = () => {
    const location = useLocation(); // Get the current location
    const [expanded, setExpanded] = useState(false); // Track the expanded state
    const [user, setUser] = useState(null);          // Track the logged-in user

    useEffect(() => {
        // Load user info from localStorage when the component mounts
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

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
            <Navbar.Brand as={Link} to="/" onClick={handleNavItemClick}>
                Laboratory
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ms-auto">
                    {/* Examples of other Nav.Links */}
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

                    {/* If user is logged in, display profile picture and name below it; otherwise, show Login */}
                    {user ? (
                        <Nav.Link
                            as={Link}
                            to="/profile"
                            onClick={handleNavItemClick}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginLeft: "1rem",
                            }}
                        >
                            <img
                                src={user.picture}
                                alt="Profile"
                                style={{
                                    width: "30px",
                                    height: "30px",
                                    borderRadius: "50%",
                                    marginRight: "8px",   // space between image and name
                                    objectFit: "cover",
                                }}
                            />
                            {/* {user.name} */}
                            {/* <span style={{ color: "#fff", fontSize: "14px" }}>
                                {user.name}
                            </span> */}
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
