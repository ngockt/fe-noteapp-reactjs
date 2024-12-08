import React from "react";
import "./Header.css";

const Header = () => {
    return (
        <nav className="navbar">
            <div className="logo">Laboratory</div>
            <ul className="nav-links">
                <li><a href="#home">Home</a></li>
                <li><a href="#features">Features</a></li>
                <li><a href="#about">About Us</a></li>
                <li><a href="#login">Login</a></li>
            </ul>
        </nav>
    );
};

export default Header;
