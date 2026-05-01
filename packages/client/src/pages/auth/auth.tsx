import { Box, Paper, Typography } from "@mui/material";
import Login from "@/components/auth/login/Login";

export default function AuthPage() {
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        bgcolor: "grey.50",
        overflow: "hidden",
      }}
    >
      {/* Background blobs */}
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

      {/* Card */}
      <Paper
        elevation={12}
        sx={{
          width: "100%",
          maxWidth: 428,
          borderRadius: 4,
          overflow: "hidden",
          border: "1px solid",
          borderColor: "grey.100",
          boxSizing: "border-box",
        }}
      >
        <Box p={3}>
          <Login />
        </Box>
        <Box
          height={4}
          sx={{
            background: (theme) =>
              `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.primary.dark}, ${theme.palette.secondary.main})`,
          }}
        />
      </Paper>

      <Typography
        variant="caption"
        sx={{
          position: "absolute",
          bottom: 12,
          textAlign: "center",
          width: "100%",
          color: "text.secondary",
        }}
      >
        &copy; {new Date().getFullYear()} Pest Control Management System. All
        rights reserved.
      </Typography>
    </Box>
  );
}
