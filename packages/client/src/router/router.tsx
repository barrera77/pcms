import App from "@/App";
import Login from "@/components/auth/login/Login";
import { AuthGate } from "@/contexts/authGate";
import { Providers } from "@/Providers";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: (
      <Providers>
        <AuthGate>
          {" "}
          <App />
        </AuthGate>
      </Providers>
    ),
    children: [],
  },
]);
