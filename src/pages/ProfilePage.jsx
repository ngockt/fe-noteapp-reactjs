import React from "react";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
    const navigate = useNavigate();

    const handleSwitchAccount = () => {
        // Clear out the current user's data
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");

        // Let the Login page know we want to pick a new Google account
        localStorage.setItem("selectAccountOnNextLogin", "true");

        // Go back to /login
        navigate("/login");
        window.location.reload();
    };

    const user = JSON.parse(localStorage.getItem("user")) || null;

    if (!user) {
        return <p style={{ textAlign: "center", marginTop: "50px" }}>You are not logged in.</p>;
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
            <button onClick={handleSwitchAccount}>Switch Account</button>
        </div>
    );
};

export default ProfilePage;
