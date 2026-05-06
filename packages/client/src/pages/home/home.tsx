import { Box, Typography } from "@mui/material";

export default function Home() {
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
      </Box>
      <Typography variant="body1" color="text.secondary">
        Welcome to PCMS. Select an option from the system to continue.
      </Typography>
    </Box>
  );
}
