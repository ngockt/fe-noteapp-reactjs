// ProfilePage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const navigate = useNavigate();

  const handleSwitchAccount = () => {
    // Example: remove user info from localStorage and redirect to /login
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  const user = JSON.parse(localStorage.getItem("user")) || null;

  if (!user) {
    return <p>You are not logged in.</p>;
  }

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Profile</h1>
      <img
        src={user.picture}
        alt="Profile"
        style={{ width: "80px", borderRadius: "50%" }}
      />
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <button onClick={handleSwitchAccount}>
        Switch Account
      </button>
    </div>
  );
};

export default ProfilePage;
