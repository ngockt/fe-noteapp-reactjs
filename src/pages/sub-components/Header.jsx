import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Header = () => {
    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="mb-4"> {/* Add margin-bottom */}
            <Navbar.Brand as={Link} to="/">
                Laboratory
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ms-auto">
                    <Nav.Link as={Link} to="/">
                        Home
                    </Nav.Link>
                    <Nav.Link as={Link} to="/myfeed">
                        MyFeed
                    </Nav.Link>
                    <Nav.Link as={Link} to="/discover">
                        Discover
                    </Nav.Link>
                    <Nav.Link as={Link} to="/maps?depth=2">
                        Maps
                    </Nav.Link>
                    <Nav.Link as={Link} to="/study-sets">
                        Study Sets
                    </Nav.Link>
                    <Nav.Link as={Link} to="/contact">
                        Contact
                    </Nav.Link>
                    <Nav.Link as={Link} to="/about">
                        About
                    </Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default Header;
