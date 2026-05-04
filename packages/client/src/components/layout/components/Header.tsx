import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import { useState } from "react";

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
  user?: {
    userName: string;
    role: string;
  };
  onLogout?: () => void;
}

export default function Header({
  setSidebarOpen,
  user,
  onLogout,
}: HeaderProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    onLogout?.();
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "white",
        borderBottom: 1,
        borderColor: "grey.200",
      }}
    >
      <Toolbar>
        {/* Mobile Menu Button */}
        <IconButton
          edge="start"
          onClick={() => setSidebarOpen(true)}
          sx={{
            mr: 2,
            color: "text.primary",
            display: { lg: "none" },
          }}
        >
          <MenuIcon />
        </IconButton>

        {/* Title (Mobile Only) */}
        <Typography
          variant="h6"
          color="text.primary"
          fontWeight="bold"
          sx={{ display: { lg: "none" }, flexGrow: 1 }}
        >
          PCMS
        </Typography>

        {/* Spacer for Desktop */}
        <Box sx={{ flexGrow: 1, display: { xs: "none", lg: "block" } }} />

        {/* User Menu */}
        {user && (
          <>
            <IconButton onClick={handleMenuOpen} sx={{ ml: "auto" }}>
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: "primary.main",
                  fontSize: "0.875rem",
                }}
              >
                {user.userName?.charAt(0)?.toUpperCase() || "U"}
              </Avatar>
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              slotProps={{
                paper: {
                  sx: {
                    mt: 1,
                    minWidth: 200,
                  },
                },
              }}
            >
              {/* User Info */}
              <Box sx={{ px: 2, py: 1.5 }}>
                <Typography variant="body2" fontWeight="medium">
                  {user.userName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user.role}
                </Typography>
              </Box>

              <Divider />

              {/* Menu Items */}
              <MenuItem onClick={handleMenuClose}>
                <PersonIcon sx={{ mr: 1.5, fontSize: 20 }} />
                Profile
              </MenuItem>

              <Divider />

              <MenuItem onClick={handleLogout}>
                <LogoutIcon sx={{ mr: 1.5, fontSize: 20 }} />
                Logout
              </MenuItem>
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
