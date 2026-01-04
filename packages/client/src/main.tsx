import { RouterProvider } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { router } from "./router/router";
import { StrictMode } from "react";
import { Providers } from "@/Providers";

const container = document.getElementById("root");
const root = createRoot(container as HTMLElement);

root.render(
  <StrictMode>
    <Providers>
      <RouterProvider router={router} />
    </Providers>{" "}
  </StrictMode>
);
