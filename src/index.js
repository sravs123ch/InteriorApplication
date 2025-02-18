import { createRoot } from "react-dom/client";

import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../src/Context/AuthContext";
import { GlobalProvider } from "../src/Context/GlobalContext";
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <GlobalProvider>
        <App />
      </GlobalProvider>
    </AuthProvider>
  </BrowserRouter>
);
