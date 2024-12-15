import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Footer = () => {
    return (
        <footer className="bg-dark text-white py-3">
            <div className="container">
                <div className="row align-items-center justify-content-between">
                    <div className="col-md-6 text-md-start text-center">
                        <p className="mb-0">
                            &copy; 2024 Laboratory. Your Base for Knowledge, Learning, and Growth.
                        </p>
                    </div>
                    <div className="col-md-6 text-md-end text-center">
                        <a href="#facebook" className="text-white mx-2">
                            Facebook
                        </a>
                        <a href="#twitter" className="text-white mx-2">
                            Twitter
                        </a>
                        <a href="#linkedin" className="text-white mx-2">
                            LinkedIn
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
