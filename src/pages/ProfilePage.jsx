import React from "react";

const ProfilePage = () => {

    const handleLogOut = () => {
        // Clear out the current user's data
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");

        // Let the Login page know we want to pick a new Google account
        localStorage.setItem("selectAccountOnNextLogin", "true");

        window.location.href = "/login";
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
            <button onClick={handleLogOut}>Log Out</button>
        </div>
    );
};

export default ProfilePage;
