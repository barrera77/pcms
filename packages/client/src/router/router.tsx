import Layout from "@/components/layout/components/Layout";
import { AuthGate } from "@/contexts/authGate";
import Activate from "@/pages/activation/Activate";
import Home from "@/pages/home/home";
import { Providers } from "@/Providers";
import { useLogoutMutation } from "@/redux/auth/api/authApi";
import {
  createBrowserRouter,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { api } from "@/redux/api/api";
import { useAppDispatch } from "@/redux/hooks/hooks";
import AuthPage from "@/pages/auth/AuthPage";
import TwoFaSetupPage from "@/pages/auth/TwoFaSetupPage";
import TwoFaChallengePage from "@/pages/auth/TwoFaChallenagePage";

function ProtectedLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(api.util.resetApiState());
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      dispatch(api.util.resetApiState());
      logout();
    }
  };

  return (
    <Layout currentPageName={location.pathname} onLogout={handleLogout}>
      <Outlet />
    </Layout>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Providers />,
    children: [
      {
        path: "/login",
        element: <AuthPage />,
      },
      {
        path: "/2fa/setup",
        element: <TwoFaSetupPage />,
      },
      {
        path: "/2fa/challenge",
        element: <TwoFaChallengePage />,
      },
      {
        path: "/activate",
        element: <Activate />,
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
            element: <Home />,
          },
        ],
      },
    ],
  },
]);
