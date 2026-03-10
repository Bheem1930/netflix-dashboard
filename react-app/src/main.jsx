import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "@fontsource/geist-sans/index.css";
import "@fontsource/geist-mono/index.css";
import { BrowserRouter } from "react-router-dom";
import { useTheme, ThemeProvider } from "./context/theme.jsx";
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </BrowserRouter>,
);
