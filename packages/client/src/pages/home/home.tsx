import { Box, Typography } from "@mui/material";

export default function Home() {
  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={2}>
        Dashboard
      </Typography>

      <Typography variant="body1" color="text.secondary">
        Welcome to PCMS. Select an option from the system to continue.
      </Typography>
    </Box>
  );
}
