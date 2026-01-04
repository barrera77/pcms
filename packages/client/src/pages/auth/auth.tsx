import { useState } from "react";
import { Box, Paper, Typography } from "@mui/material";
import Register from "@/components/auth/register/register";
import Login from "@/components/auth/login/Login";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <Box
      minHeight="100vh"
      width="100%"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      position="relative"
      bgcolor="grey.50"
      px={2}
      py={4}
    >
      {/* Background abstract shapes */}
      <Box
        sx={{
          position: "absolute",
          top: "-10%",
          left: "-10%",
          width: "50%",
          height: "50%",
          bgcolor: "primary.main",
          opacity: 0.05,
          borderRadius: "50%",
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "-10%",
          right: "-10%",
          width: "50%",
          height: "50%",
          bgcolor: "secondary.main",
          opacity: 0.05,
          borderRadius: "50%",
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />

      {/* Auth card */}
      <Paper
        elevation={12}
        sx={{
          width: "100%",
          maxWidth: 428,
          borderRadius: 4,
          overflow: "hidden",
          border: "1px solid",
          borderColor: "grey.100",
        }}
      >
        <Box p={6}>
          {/* Form */}
          {isLogin ? (
            <Login onToggle={() => setIsLogin(false)} />
          ) : (
            <Register />
          )}
        </Box>

        {/* Bottom decorative bar */}
        <Box
          height={4}
          width="100%"
          sx={{
            background:
              "linear-gradient(to right, primary.main, primary.dark, secondary.main)",
          }}
        />
      </Paper>

      {/* Footer */}
      <Typography
        variant="caption"
        color="text.secondary"
        mt={4}
        textAlign="center"
      >
        &copy; {new Date().getFullYear()} Pest Control Management System. All
        rights reserved.
      </Typography>
    </Box>
  );
}
