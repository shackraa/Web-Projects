import "@fontsource/source-sans-3/400.css";
import "@fontsource/source-sans-3/600.css";
import "@fontsource/source-sans-3/700.css";
import "@fontsource/source-serif-4/600.css";
import "@fontsource/source-serif-4/700.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, HashRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { StoreProvider } from "./state";

const useHash = import.meta.env.VITE_ROUTER === "hash";
const Router = useHash ? HashRouter : BrowserRouter;
const routerProps = useHash
  ? {}
  : { basename: import.meta.env.BASE_URL.replace(/\/$/, "") };

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router {...routerProps}>
      <StoreProvider>
        <App />
      </StoreProvider>
    </Router>
  </StrictMode>,
);
