import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AuthLayout from "@/components/auth/layout/AuthLayout";
import { useTwoFaValidateMutation } from "@/redux/auth/api/authApi";

type ChallengeFormData = {
  code: string;
};

export default function TwoFaChallengePage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChallengeFormData>();

  const [validate, { isLoading }] = useTwoFaValidateMutation();
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = async (data: ChallengeFormData) => {
    setErrorMessage(null);
    try {
      await validate({ code: data.code }).unwrap();
      setShowSuccess(true);
      setTimeout(() => navigate("/", { replace: true }), 1000);
    } catch (err: any) {
      setErrorMessage(err?.message ?? "Invalid code. Please try again.");
    }
  };

  return (
    <AuthLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ width: "100%" }}
      >
        <Box
          px={{ xs: 1, sm: 4 }}
          pt={{ xs: 4, sm: 0 }}
          display="flex"
          flexDirection="column"
          gap={3}
        >
          {/* Header */}
          <Box textAlign="center" mb={{ xs: 2, sm: 4 }}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
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
              🔐
            </motion.div>

            <Typography
              variant="h5"
              fontWeight={700}
              color="primary"
              gutterBottom
            >
              Two-Factor Authentication
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Enter the 6-digit code from your authenticator app.
            </Typography>
          </Box>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
            <TextField
              label="Authentication Code"
              fullWidth
              inputMode="numeric"
              autoComplete="one-time-code"
              {...register("code", {
                required: "Code is required",
                pattern: {
                  value: /^\d{6}$/,
                  message: "Must be exactly 6 digits",
                },
              })}
              error={!!errors.code}
              helperText={errors.code?.message}
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

            {errorMessage && (
              <Typography variant="body2" color="error" textAlign="center">
                {errorMessage}
              </Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isLoading || showSuccess}
              sx={{ height: { xs: 52, sm: 48 }, marginTop: 3 }}
            >
              <AnimatePresence mode="wait">
                {showSuccess ? (
                  <motion.div
                    key="success"
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <CheckCircleIcon fontSize="small" color="success" />
                    Verified!
                  </motion.div>
                ) : isLoading ? (
                  <motion.div
                    key="loading"
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <CircularProgress size={20} />
                    Verifying…
                  </motion.div>
                ) : (
                  <motion.div
                    key="idle"
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    Verify <ArrowForwardIcon fontSize="small" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </motion.form>
        </Box>
      </motion.div>
    </AuthLayout>
  );
}
