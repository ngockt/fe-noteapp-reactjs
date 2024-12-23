import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <GoogleOAuthProvider clientId="1004655097394-kuco3sk7rv8e64ab3lqne02egjen85uv.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
);
