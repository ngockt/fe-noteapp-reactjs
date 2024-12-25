import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SignUpPage.css";

const SignUpPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: "", password: "", name: "" });
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        if (!formData.email || !formData.password || !formData.name) {
            setErrorMessage("All fields are required.");
            return;
        }

        try {
            const res = await axios.post("http://localhost:8000/auth/signup", formData);

            if (res.status === 201) {
                setSuccessMessage("Account created successfully. Redirecting to login...");
                console.log(res.data);
                setTimeout(() => navigate("/login"), 3000); // Redirect after 3 seconds
            }
        } catch (error) {
            console.error("Sign-up error:", error);
            setErrorMessage(error.response?.data?.message || "Sign-up failed. Please try again.");
        }
    };

    return (
        <div className="signup-page-container">
            <h1 className="signup-title">Create a New Account</h1>
            <form className="signup-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        required
                    />
                </div>
                <button type="submit" className="signup-button">
                    Sign Up
                </button>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}
            </form>
        </div>
    );
};

export default SignUpPage;
