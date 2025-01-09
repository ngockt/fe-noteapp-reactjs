import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { LanguageDataProvider } from "context_data/LanguageDataContext";
import { GraphDataProvider } from "context_data/GraphDataContext";
import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(document.getElementById("root"));
const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || ""; // Use environment variables for flexibility


root.render(
  <LanguageDataProvider>
    <GraphDataProvider>
      <GoogleOAuthProvider clientId={clientId}>
        <App />
      </GoogleOAuthProvider>
    </GraphDataProvider>
  </LanguageDataProvider>
);
