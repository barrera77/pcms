import Login from "@/components/auth/login/Login";
import Layout from "@/components/layout/components/Layout";
import { AuthGate } from "@/contexts/authGate";
import { Providers } from "@/Providers";
import { useLogoutMutation } from "@/redux/auth/api/authApi";
import {
  createBrowserRouter,
  useLocation,
  useNavigate,
} from "react-router-dom";

// Wrapper component to handle logout and current page
function ProtectedLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      // Even if logout fails, redirect to login
      navigate("/login");
    }
  };

  return (
    <Layout
      currentPageName={location.pathname}
      onLogout={handleLogout}
      children={undefined}
    />
  );
}

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
            <ProtectedLayout />
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
          // Add more routes here as you build features
          // {
          //   path: "admin/employees",
          //   element: <EmployeesPage />,
          // },
          // {
          //   path: "admin/reports",
          //   element: <ReportsPage />,
          // },
        ],
      },
    ],
  },
]);
