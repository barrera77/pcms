import { RouterProvider } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { router } from "./router/router";
import { StrictMode } from "react";

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root element not found");
}

const root = createRoot(container);
root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
