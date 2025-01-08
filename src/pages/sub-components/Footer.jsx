import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { NavDropdown, Container } from "react-bootstrap"; // Bootstrap Components
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa"; // Social Media Icons

const Footer = () => {
    return (
        <footer className="bg-dark text-white py-2">
            <Container>
                <div className="row align-items-center justify-content-between">
                    {/* Left Section */}
                    <div className="col-md-6 text-md-start text-center mb-3 mb-md-0">
                        <p className="mb-0">
                            &copy; {new Date().getFullYear()} Laboratory. Your Base for Knowledge, Learning, and Growth.
                        </p>
                    </div>

                    {/* Right Section */}
                    <div className="col-md-6 text-md-end text-center">
                        {/* Social Media Links */}
                        <a href="#facebook" className="text-white mx-2">
                            <FaFacebookF />
                        </a>
                        <a href="#twitter" className="text-white mx-2">
                            <FaTwitter />
                        </a>
                        <a href="#linkedin" className="text-white mx-2">
                            <FaLinkedinIn />
                        </a>

                        {/* Experiments Dropdown */}
                        <NavDropdown
                            title="Experiments"
                            id="experiments-dropdown"
                            className="d-inline-block mx-2 text-white"
                        >
                            <NavDropdown.Item as={Link} to="/experiments/text-diff">
                                Text Diff
                            </NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/experiments/notion-page">
                                Notion Page
                            </NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/experiments/prompting">
                                Prompting
                            </NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/experiments/latex-render">
                                Latex Renderer
                            </NavDropdown.Item>
                        </NavDropdown>
                    </div>
                </div>
            </Container>
        </footer>
    );
};

export default Footer;
