import React from "react";
import "./Home.css";
import Footer from "../components/Footer";

const Home = () => {
    return (
        <div className="home-container">

            {/* Hero Section */}
            <section id="home" className="hero">
                <h1>Welcome to Laboratory</h1>
                <p>Your Base Knowledge Keeping Lab for learning, sharing, and growing.</p>
                <button className="cta-button">Get Started</button>
            </section>

            {/* Features Section */}
            <section id="features" className="features">
                <h2>Why Choose Laboratory?</h2>
                <div className="feature">
                    <h3>📚 Access Knowledge</h3>
                    <p>Dive into a rich library of study materials and curated content.</p>
                </div>
                <div className="feature">
                    <h3>✍️ Share Expertise</h3>
                    <p>Create and publish your own resources to inspire a global community.</p>
                </div>
                <div className="feature">
                    <h3>📊 Track Progress</h3>
                    <p>Monitor your learning journey with personalized tools and analytics.</p>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="testimonials">
                <h2>What People Say About Laboratory</h2>
                <div className="testimonial">
                    <p>"Laboratory is an essential part of my learning routine!"</p>
                    <span>- Alex P.</span>
                </div>
                <div className="testimonial">
                    <p>"Sharing my knowledge has never been easier. Love it!"</p>
                    <span>- Maria L.</span>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default Home;
