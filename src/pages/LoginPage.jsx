import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const handleSuccess = async (credentialResponse) => {
    setErrorMessage(""); // Reset error message
    try {
      const token = credentialResponse.credential;

      // Call your FastAPI endpoint
      const res = await axios.post("http://localhost:8000/auth/google", {
        token,
      });

      // Destructure the response (adjust keys to match your FastAPI response)
      const { access_token, email, name, picture } = res.data;

      // Store user info in localStorage
      localStorage.setItem("user", JSON.stringify({ email, name, picture }));
      // Store access token as well (optional)
      localStorage.setItem("accessToken", access_token);

      // Redirect to home page
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Login failed. Please try again.");
    }
  };

  const handleError = () => {
    setErrorMessage("Google Login Failed");
  };

  return (
    <div style={{ marginTop: "50px", textAlign: "center" }}>
      <h1>Sign in with Google</h1>
      <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
};

export default LoginPage;
