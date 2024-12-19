import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Header = () => {
    const location = useLocation(); // Get the current location

    return (
        <Navbar bg="dark" variant="dark" expand="sm" className="mb-0 ps-2"> {/* Add margin-bottom */}
            <Navbar.Brand as={Link} to="/">
                Laboratory
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ms-auto">
                    <Nav.Link
                        as={Link}
                        to="/dashboard"
                        active={location.pathname === "/dashboard"} // Highlight when on this route
                    >
                        Dashboard
                    </Nav.Link>
                    <Nav.Link
                        as={Link}
                        to="/explore"
                        active={location.pathname === "/explore"}
                    >
                        Explore
                    </Nav.Link>
                    <Nav.Link
                        as={Link}
                        to="/contribution"
                        active={location.pathname === "/contribution"}
                    >
                        Contribution
                    </Nav.Link>
                    <Nav.Link
                        as={Link}
                        to="/projects"
                        active={location.pathname === "/projects"}
                    >
                        Projects
                    </Nav.Link>
                    <Nav.Link
                        as={Link}
                        to="/contact"
                        active={location.pathname === "/contact"}
                    >
                        Contact
                    </Nav.Link>
                    <Nav.Link
                        as={Link}
                        to="/about"
                        active={location.pathname === "/about"}
                    >
                        About
                    </Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default Header;
