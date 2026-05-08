import { Box, Paper, Typography, useMediaQuery, useTheme } from "@mui/material";
import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: isMobile ? "flex-start" : "center",
        justifyContent: "center",
        position: "relative",
        bgcolor: "grey.50",
        overflow: "hidden",
      }}
    >
      {!isMobile && (
        <>
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
        </>
      )}

      <Paper
        elevation={isMobile ? 0 : 12}
        sx={{
          width: "100%",
          maxWidth: { xs: "100%", sm: 428 },
          minHeight: { xs: "100vh", sm: "auto" },
          borderRadius: { xs: 0, sm: 4 },
          overflow: "hidden",
          border: { xs: "none", sm: "1px solid" },
          borderColor: "grey.100",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box p={{ xs: 2, sm: 3 }} flex={1}>
          {children}
        </Box>
        <Box
          height={4}
          sx={{
            background: (theme) =>
              `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.primary.dark}, ${theme.palette.secondary.main})`,
          }}
        />
      </Paper>

      {!isMobile && (
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
      )}
    </Box>
  );
}
