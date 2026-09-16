import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import ContextRoot from "./context/Context.jsx";
import { ThemeProvide } from "./Theme/Theme.tsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvide>
        <ContextRoot>
          <App />
        </ContextRoot>
      </ThemeProvide>
    </BrowserRouter>
  </StrictMode>,
);
