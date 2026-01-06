import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";

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
      <Outlet />
    </Box>
  );
};

export default App;
