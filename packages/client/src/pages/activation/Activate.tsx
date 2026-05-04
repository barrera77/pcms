import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  InputAdornment,
  Alert,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useActivateUserMutation } from "@/redux/user/authApi";

type ActivateFormData = {
  password: string;
  confirmPassword: string;
};

export default function ActivatePage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ActivateFormData>();

  const [activateUser, { isLoading, isSuccess, isError }] =
    useActivateUserMutation();

  //Need to uncomment after done with UI
  // useEffect(() => {
  //   if (!token) {
  //     navigate("/login", { replace: true });
  //   }
  // }, [token, navigate]);

  // useEffect(() => {
  //   if (isSuccess) {
  //     setTimeout(() => {
  //       navigate("/login", { replace: true });
  //     }, 2000);
  //   }
  // }, [isSuccess, navigate]);

  const onSubmit = async (data: ActivateFormData) => {
    if (!token) return;
    await activateUser({ token, password: data.password });
  };

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
      {/* Background blobs — desktop only */}
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
        <Box
          px={{ xs: 3, sm: 4 }}
          pt={{ xs: 6, sm: 3 }}
          pb={{ xs: 2, sm: 3 }}
          display="flex"
          flexDirection="column"
          gap={3}
          flex={1}
        >
          {/* Header */}
          <Box textAlign="center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 64,
                height: 64,
                borderRadius: 16,
                background: "linear-gradient(135deg, #C7D2FE 0%, #E0E7FF 100%)",
                marginBottom: 16,
                fontSize: 32,
              }}
            >
              🐛
            </motion.div>

            <Typography
              variant="h5"
              fontWeight={700}
              color="primary"
              gutterBottom
            >
              Activate Your Account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Create a password to access PCMS
            </Typography>
          </Box>

          {/* Success state */}
          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Alert
                icon={<CheckCircleIcon />}
                severity="success"
                sx={{ borderRadius: 2 }}
              >
                Account activated! Redirecting to login...
              </Alert>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmit(onSubmit)}
              style={{ display: "flex", flexDirection: "column", gap: 16 }}
            >
              <TextField
                label="Password"
                type="password"
                fullWidth
                autoComplete="new-password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon color="action" />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <TextField
                label="Confirm Password"
                type="password"
                fullWidth
                autoComplete="new-password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === watch("password") || "Passwords do not match",
                })}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon color="action" />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              {isError && (
                <Alert severity="error" sx={{ borderRadius: 2 }}>
                  This activation link is invalid or has expired. Please contact
                  your admin for a new one.
                </Alert>
              )}

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={isLoading}
                sx={{ height: { xs: 52, sm: 48 } }}
              >
                {isLoading ? (
                  <Box display="flex" alignItems="center" gap={1}>
                    <CircularProgress size={20} />
                    Activating...
                  </Box>
                ) : (
                  "Activate Account"
                )}
              </Button>
            </motion.form>
          )}
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
