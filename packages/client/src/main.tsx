import { RouterProvider } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { router } from "./router/router";
import { StrictMode } from "react";

const container = document.getElementById("root");
const root = createRoot(container as HTMLElement);

root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
