import { authApi } from "@/redux/auth/api/authApi";

export const logout = async () => {
  try {
    // Call the backend logout endpoint
    await fetch("/api/auth/logout", { method: "POST" });

    // Reset RTK Query cache for auth
    authApi.util.resetApiState();

    // Redirect to login
    window.location.href = "/login";
  } catch (err) {
    console.error("Logout failed", err);
  }
};
