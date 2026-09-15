import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { getInitialLanguage, applyDocumentDirection } from "./app/uiSlice";
import "./index.css";

// Guarantee document language and direction are applied before initial React render
applyDocumentDirection(getInitialLanguage());

const rootElement = document.getElementById("root") as HTMLElement;

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
