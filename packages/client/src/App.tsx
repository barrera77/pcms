import { Outlet } from "react-router-dom";
import { Box, Typography } from "@mui/material";

const App = () => {
  return (
    <Box
      sx={{
        backgroundColor: "background.default",
        color: "text.primary",
        fontFamily: "Gilroy, Arial, sans-serif",
        minHeight: "100vh",
        width: "100%",
        p: 2,
      }}
    >
      <Typography variant="h2" mb={2}>
        🐛 PCMS
      </Typography>
      <Typography variant="h5" color="text.secondary" mb={4}>
        Pest Control Management System
      </Typography>

      {/* Render child routes */}
      <Outlet />
    </Box>
  );
};

export default App;
