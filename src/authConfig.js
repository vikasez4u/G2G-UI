// authConfig.js
export const msalConfig = {
  auth: {
    clientId: "18bea863-348d-41f2-b82b-6162e1822bbb",
    authority: "https://login.microsoftonline.com/6eb54db1-fc6e-4b0a-a00b-930182dca624",
    redirectUri: "https://g2g-chatbot-geakehf4aqamfcfb.eastasia-01.azurewebsites.net",
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: true,
  },
};

export const loginRequest = {
  scopes: ["User.Read"],
};