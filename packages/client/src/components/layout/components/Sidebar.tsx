import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Avatar,
  List,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import BugReportIcon from "@mui/icons-material/BugReport";
import { NavItem } from "./NavItem";
import { useLayout } from "../hooks/useLayout";
import type { NavigationItem } from "./LayoutContext";

const DRAWER_WIDTH = 288;

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const { sidebar, navigation, currentPageName, user } = useLayout();
  const isActive = (href: string) => currentPageName === href;

  const isChildActive = (children?: NavigationItem[]): boolean =>
    children?.some((child) => child.href && currentPageName === child.href) ??
    false;

  const handleDrawerClose = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const drawerContent = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          px: 3,
          py: 2.5,
          borderBottom: 1,
          borderColor: "grey.100",
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "primary.main",
            boxShadow: 2,
          }}
        >
          <BugReportIcon sx={{ fontSize: 20, color: "white" }} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" fontWeight="bold" color="text.primary">
            PCMS
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Management System
          </Typography>
        </Box>
        {isMobile && (
          <IconButton
            onClick={handleDrawerClose}
            size="small"
            sx={{
              "&:hover": {
                bgcolor: "grey.100",
              },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      {/* Navigation */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          px: 2,
          py: 3,
        }}
      >
        <List
          disablePadding
          sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}
        >
          {navigation.map((item) => (
            <NavItem
              key={item.name}
              item={item}
              expandedMenus={sidebar.expandedMenus}
              toggleMenu={sidebar.toggleMenu}
              isActive={isActive}
              isChildActive={isChildActive}
              onNavigate={handleDrawerClose}
            />
          ))}
        </List>
      </Box>

      {/* User Profile */}
      {user && (
        <>
          <Divider />
          <Box sx={{ p: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                p: 1.5,
                borderRadius: 2,
                bgcolor: "grey.50",
              }}
            >
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: "primary.main",
                  fontWeight: 600,
                }}
              >
                {user.userName?.charAt(0)?.toUpperCase() || "U"}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="body2"
                  fontWeight="medium"
                  color="text.primary"
                  noWrap
                >
                  {user.userName || "User"}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  {user.role}
                </Typography>
              </Box>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={sidebarOpen}
      onClose={handleDrawerClose}
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: DRAWER_WIDTH,
          boxSizing: "border-box",
          borderRight: 1,
          borderColor: "grey.200",
        },
      }}
      ModalProps={{
        keepMounted: true,
      }}
    >
      {drawerContent}
    </Drawer>
  );
}
