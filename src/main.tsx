import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Handle SPA redirect from 404.html (GitHub Pages workaround)
const redirectPath = sessionStorage.getItem(`spa-redirect-path`);
if (redirectPath) {
    sessionStorage.removeItem(`spa-redirect-path`);
    window.history.replaceState(null, ``, `/shadcn-components${redirectPath}`);
}

createRoot(document.getElementById(`root`)!).render(
    <StrictMode>
        <App />
    </StrictMode>
);
