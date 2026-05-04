import { Box, Typography, Button } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useLogoutMutation } from "@/redux/auth/api/authApi";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [logout, { isLoading }] = useLogoutMutation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      navigate("/login", { replace: true });
    } catch {
      // even if logout fails on the server, clear the session client-side
      navigate("/login", { replace: true });
    }
  };

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h4" fontWeight={700}>
          Dashboard
        </Typography>
        <Button
          variant="outlined"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          disabled={isLoading}
        >
          {isLoading ? "Logging out..." : "Logout"}
        </Button>
      </Box>
      <Typography variant="body1" color="text.secondary">
        Welcome to PCMS. Select an option from the system to continue.
      </Typography>
    </Box>
  );
}
