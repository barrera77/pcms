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
  Paper,
} from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type LoginFormData = {
  userName: string;
  password: string;
  rememberMe?: boolean;
};

type LoginProps = {
  onToggle?: () => void;
};

//TODO:Need to find out if my current auth setup allows rmember me or can be added

export const Login = ({ onToggle }: LoginProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      // simulate login request
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setShowSuccess(true);

      setTimeout(() => {
        navigate("/", { replace: true });
      }, 1000);
    } catch {
      setErrorMessage("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor="grey.50"
      p={2}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ width: "100%", maxWidth: 428 }}
      >
        <Paper
          elevation={10}
          sx={{
            borderRadius: 5,
            overflow: "hidden",
            border: "1px solid",
            borderColor: "grey.200",
          }}
        >
          <Box p={5} display="flex" flexDirection="column" gap={3}>
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
                  background:
                    "linear-gradient(135deg, #C7D2FE 0%, #E0E7FF 100%)",
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ display: "flex", flexDirection: "column", gap: 16 }}
            >
              {/* Email Field */}
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
                sx={{ borderRadius: 2 }}
              />

              {/* Password Field */}
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
                sx={{ borderRadius: 2 }}
              />

              <FormControlLabel
                control={<Checkbox {...register("rememberMe")} />}
                label="Remember me for 30 days"
              />

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
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <CheckCircleIcon fontSize="small" color="success" />
                      Success!
                    </motion.div>
                  ) : isLoading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <CircularProgress size={20} />
                      Signing in…
                    </motion.div>
                  ) : (
                    <motion.div
                      key="default"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      Sign In <ArrowForwardIcon fontSize="small" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>

              {onToggle && (
                <Button variant="text" size="small" onClick={onToggle}>
                  Don’t have an account? Register
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

              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
              >
                Contact your admin to provide you a registration link
              </Typography>

              {/* Or Divider */}
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

              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
              >
                Complete the registration following the link in your email
              </Typography>
            </motion.form>
          </Box>
          <Box
            height={4}
            width="100%"
            sx={{
              background:
                "linear-gradient(90deg, #3B82F6 0%, #6366F1 80%, #F472B6 100%)",
            }}
          />
        </Paper>
      </motion.div>
    </Box>
  );
};

export default Login;
