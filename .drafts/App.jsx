import React, { useEffect } from 'react';

function App() {
  useEffect(() => {
    // Default values
    const defaultUser = {
      email: "guest@example.com",
      name: "Guest",
      picture: "defaultPictureURL" // Replace with your default picture URL
    };
    const defaultAccessToken = "defaultAccessToken";

    // Check if 'user' key does not exist
    if (!localStorage.getItem("user")) {
      localStorage.setItem("user", JSON.stringify(defaultUser)); // Set default user
    }

    // Check if 'accessToken' key does not exist
    if (!localStorage.getItem("accessToken")) {
      localStorage.setItem("accessToken", defaultAccessToken); // Set default accessToken
    }

  }, []); // Runs only once when the app starts

  return (
    <div className="App">
      <h1>React App with localStorage</h1>
    </div>
  );
}

export default App;
