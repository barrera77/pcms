import App from "@/App";
import { AuthGate } from "@/contexts/authGate";
import AuthPage from "@/pages/auth/auth";
import Home from "@/pages/home/home";
import { Providers } from "@/Providers";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/login",

    element: <AuthPage />,
  },
  {
    path: "/",
    element: (
      <Providers>
        <AuthGate>
          <App />
        </AuthGate>
      </Providers>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
    ],
  },
]);
