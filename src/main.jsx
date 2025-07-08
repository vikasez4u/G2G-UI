// main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import App from "./App";
import { msalConfig } from "../authConfig";

const msalInstance = new PublicClientApplication(msalConfig);

msalInstance.handleRedirectPromise().catch((error) => {
  console.error("Redirect error:", error);
});

ReactDOM.render(
  <MsalProvider instance={msalInstance}>
    <App />
  </MsalProvider>,
  document.getElementById("root")
);

