import React from "react";
import "./i18n";
import App from "./App";

import { createRoot } from "react-dom/client";

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);

root.render(
  // <React.StrictMode>
  <React.Suspense fallback="loading">
    <App />
  </React.Suspense>
  // </React.StrictMode>
);
