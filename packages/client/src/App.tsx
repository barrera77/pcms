import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";

const App = () => {
  return (
    <Box
      sx={{
        backgroundColor: "background.default",
        color: "text.primary",
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
