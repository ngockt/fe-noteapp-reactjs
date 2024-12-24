import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    // Redirect to the /explore route
    navigate("/explore");
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <h1>Welcome to Laboratory</h1>
        <p>A knowledge hub for learning, sharing, and growth.</p>
        <button className="cta-button" onClick={handleGetStarted}>
          Get Started
        </button>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Why Choose Laboratory?</h2>
        <div className="feature-list">
          <div className="feature">
            <h3>📚 Access Knowledge</h3>
            <p>Explore our extensive library of resources and materials.</p>
          </div>
          <div className="feature">
            <h3>✍️ Share Expertise</h3>
            <p>Publish your own resources to inspire a global audience.</p>
          </div>
          <div className="feature">
            <h3>📊 Track Progress</h3>
            <p>Stay motivated with personalized insights and analytics.</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <h2>What People Are Saying</h2>
        <div className="testimonial">
          <p>"Laboratory has become an essential part of my learning routine!"</p>
          <span>- Alex P.</span>
        </div>
        <div className="testimonial">
          <p>"Sharing my knowledge has never been easier. Love it!"</p>
          <span>- Maria L.</span>
        </div>
      </section>
    </div>
  );
};

export default Home;
