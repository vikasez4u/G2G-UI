// authConfig.js
export const msalConfig = {
  auth: {
    clientId: "d174801d-3034-48b7-9745-c109b1830c33",
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