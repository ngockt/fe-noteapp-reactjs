import React, { useState, useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [googleConfig, setGoogleConfig] = useState({});

  useEffect(() => {
    // Check if we need to re-prompt for account selection
    if (localStorage.getItem("selectAccountOnNextLogin")) {
      // Pass prompt=select_account to the GoogleLogin
      setGoogleConfig({ prompt: "select_account" });
      // Clean up this flag once read
      localStorage.removeItem("selectAccountOnNextLogin");
    }
  }, []);

  const handleSuccess = async (credentialResponse) => {
    setErrorMessage(""); // Reset error message
    try {
      const token = credentialResponse.credential;

      // Call FastAPI endpoint
      const res = await axios.post("http://localhost:8000/auth/google", {
        token,
      });

      // Extract user details
      const { access_token, email, name, picture } = res.data;

      // Store user info and token in localStorage
      localStorage.setItem("user", JSON.stringify({ email, name, picture }));
      localStorage.setItem("accessToken", access_token);

      // Redirect to home page
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Login failed. Please try again.");
    }
  };

  const handleError = () => {
    setErrorMessage("Google Login Failed");
  };

  return (
    <div className="login-page-container">
      <h1 className="login-title">Sign in with Google</h1>
      <div className="google-login-button">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          // Spread in any custom config (like prompt: 'select_account')
          {...googleConfig}
        />
      </div>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default LoginPage;
