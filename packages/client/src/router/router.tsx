import App from "@/App";
import Login from "@/components/auth/login/Login";
import { AuthGate } from "@/contexts/authGate";
import { Providers } from "@/Providers";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Providers />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "/",
        element: (
          <AuthGate>
            <App />
          </AuthGate>
        ),
        children: [
          {
            index: true,
            element: (
              <div>
                <h1>Welcome to PCMS!</h1>
                <p>Dashboard coming soon...</p>
              </div>
            ),
          },
        ],
      },
    ],
  },
]);
