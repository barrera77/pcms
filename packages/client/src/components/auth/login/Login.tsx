import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Divider,
  Typography,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "@/redux/auth/api/authApi";

type LoginFormData = {
  userName: string;
  password: string;
  rememberMe?: boolean;
};

type LoginProps = {
  onToggle?: () => void;
};

export const Login = ({ onToggle }: LoginProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const [login, { isLoading }] = useLoginMutation();
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  const onSubmit = async (data: LoginFormData) => {
    setErrorMessage(null);

    try {
      await login({
        userName: data.userName,
        password: data.password,
      }).unwrap();
      setShowSuccess(true);

      setTimeout(() => {
        navigate("/", { replace: true });
      }, 1000);
    } catch {
      setErrorMessage("Login failed. Please check your credentials.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ width: "100%" }}
    >
      <Box px={4} display="flex" flexDirection="column" gap={3}>
        {/* Logo & Header */}
        <Box textAlign="center" mb={4}>
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
            🐛
          </motion.div>

          <Typography
            variant="h5"
            fontWeight={700}
            color="primary"
            gutterBottom
          >
            PCMS
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Pest Control Management System
          </Typography>
        </Box>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          style={{ display: "flex", flexDirection: "column", gap: 16 }}
        >
          <TextField
            label="Email Address"
            fullWidth
            {...register("userName", { required: "Email is required" })}
            error={!!errors.userName}
            helperText={errors.userName?.message}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <MailOutlineIcon color="action" />
                  </InputAdornment>
                ),
              },
            }}
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            {...register("password", { required: "Password is required" })}
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

          <FormControlLabel
            control={<Checkbox {...register("rememberMe")} />}
            label="Remember me for 30 days"
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
            sx={{ height: 48 }}
          >
            <AnimatePresence mode="wait">
              {showSuccess ? (
                <motion.div
                  key="success"
                  style={{ display: "flex", alignItems: "center", gap: 8 }}
                >
                  <CheckCircleIcon fontSize="small" color="success" />
                  Success!
                </motion.div>
              ) : isLoading ? (
                <motion.div
                  key="loading"
                  style={{ display: "flex", alignItems: "center", gap: 8 }}
                >
                  <CircularProgress size={20} />
                  Signing in…
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  style={{ display: "flex", alignItems: "center", gap: 8 }}
                >
                  Sign In <ArrowForwardIcon fontSize="small" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>

          {onToggle && (
            <Button variant="text" size="small" onClick={onToggle}>
              Don't have an account? Register
            </Button>
          )}

          <Box position="relative" my={2}>
            <Divider />
            <Typography
              variant="caption"
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                background: "#fff",
                px: 1,
                color: "text.secondary",
              }}
            >
              Or
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary" textAlign="center">
            Contact your admin to provide you a registration link
          </Typography>

          <Box position="relative" my={2}>
            <Divider />
            <Typography
              variant="caption"
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                background: "#fff",
                px: 1,
                color: "text.secondary",
              }}
            >
              Or
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary" textAlign="center">
            Complete the registration following the link in your email
          </Typography>
        </motion.form>
      </Box>
    </motion.div>
  );
};

export default Login;
