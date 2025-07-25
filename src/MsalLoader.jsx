import React, { useEffect, useState, useRef } from "react";
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication, LogLevel } from "@azure/msal-browser";
import App from "./App";
import { msalConfig, loginRequest } from "./authConfig";

// Add logging to msalConfig
msalConfig.system = {
  loggerOptions: {
    loggerCallback: (level, message, containsPii) => {
      console.log(`[MSAL] ${message}`);
    },
    logLevel: LogLevel.Verbose,
    piiLoggingEnabled: false,
  },
};

const msalInstance = new PublicClientApplication(msalConfig);

const MsalLoader = () => {
  const [msalReady, setMsalReady] = useState(false);
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    const init = async () => {
      try {
        await msalInstance.initialize();

        const response = await msalInstance.handleRedirectPromise();

        if (response) {
          msalInstance.setActiveAccount(response.account);
        } else {
          const accounts = msalInstance.getAllAccounts();

          if (accounts.length === 1) {
            msalInstance.setActiveAccount(accounts[0]);
          } else if (accounts.length > 1) {
            console.warn("Multiple accounts detected");
          } else {
            // Check if an interaction is already in progress
            const interactionInProgress =
              sessionStorage.getItem("msal.interaction.status") ===
              "interaction_in_progress";

            if (!interactionInProgress) {
              await msalInstance.loginRedirect(loginRequest);
            }
          }
        }

        setMsalReady(true);
      } catch (err) {
        console.error("MSAL init error:", err);
      }
    };

    init();
  }, []);

  if (!msalReady) return <div>Loading authentication...</div>;

  return (
    <MsalProvider instance={msalInstance}>
      <App />
    </MsalProvider>
  );
};

export default MsalLoader;
