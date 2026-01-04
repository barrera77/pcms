import { useGetCurrentUserQuery } from "@/redux/auth/api/authApi";
import { Box, CircularProgress } from "@mui/material";
import { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
export const AuthGate = ({ children }: PropsWithChildren) => {
  const { data, isLoading, isError } = useGetCurrentUserQuery();

  if (isLoading) {
    return (
      <Box>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !data) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
