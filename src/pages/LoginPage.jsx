import React, { useState, useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import AxiosInstance from "apis/AxiosInstance";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [googleConfig, setGoogleConfig] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      navigate("/profile");
    }

    if (localStorage.getItem("selectAccountOnNextLogin")) {
      setGoogleConfig({ prompt: "select_account" });
      localStorage.removeItem("selectAccountOnNextLogin");
    }
  }, [navigate]);

  const handleNormalLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Reset error message

    if (!email || !password) {
      setErrorMessage("Both email and password are required.");
      return;
    }

    try {
      const res = await AxiosInstance.post("/auth/login", {
        email,
        password,
      });

      const { access_token, name, picture } = res.data;

      // If 'picture' is missing, use a default "like" icon.
      const defaultPicture = picture || "https://img.icons8.com/?size=100&id=60655&format=png&color=000000";

      localStorage.setItem(
        "user",
        JSON.stringify({ email, name, picture: defaultPicture })
      );
      localStorage.setItem("accessToken", access_token);


      window.location.href = "/";

    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage(error.response?.data?.message || "Login failed. Please try again.");
    }
  };

  const handleSuccess = async (credentialResponse) => {
    setErrorMessage(""); // Reset error message
    try {
      const token = credentialResponse.credential;

      const res = await AxiosInstance.post("/auth/google", {
        token,
      });

      const { access_token, email, name, picture } = res.data;

      localStorage.setItem("user", JSON.stringify({ email, name, picture }));
      localStorage.setItem("accessToken", access_token);

      window.location.href = "/";
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Login failed. Please try again.");
    }
  };

  const handleError = () => {
    setErrorMessage("Google Login Failed");
  };

  const handleSignUpRedirect = () => {
    navigate("/signup");
  };

  return (
    <div className="login-page-container">
      <h1 className="login-title">Sign in</h1>
      <form className="normal-login-form" onSubmit={handleNormalLogin}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit" className="login-button">
          Log In
        </button>
      </form>
      <p className="separator-text">or</p>
      <div className="google-login-button">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          {...googleConfig}
        />
      </div>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <p className="signup-option">
        Don't have an account?{" "}
        <button className="signup-button" onClick={handleSignUpRedirect}>
          Sign Up
        </button>
      </p>
    </div>
  );
};

export default LoginPage;
