import Sidebar from "@/components/layout/components/Sidebar";
import { LayoutProvider } from "@/components/layout/components/LayoutContext";
import { useLayout } from "@/components/layout/hooks/useLayout";
import { Backdrop, Box, GlobalStyles } from "@mui/material";
import { ReactNode } from "react";
import Header from "@/components/layout/components/Header";

type LayoutProps = {
  children: ReactNode;
  currentPageName: string;
  onLogout?: () => void;
};

// Inner component that uses the layout context
function LayoutInner({
  children,
  onLogout,
}: {
  children: ReactNode;
  onLogout?: () => void;
}) {
  const { sidebar, user } = useLayout();

  return (
    <>
      <GlobalStyles
        styles={{
          ":root": {
            "--primary": "#33266F",
            "--primary-dark": "#261d54",
            "--primary-light": "#443680",
            "--secondary": "#007078",
            "--secondary-dark": "#005a60",
          },
        }}
      />

      <Box minHeight="100vh" bgcolor="grey.50">
        {/* Sidebar */}
        <Sidebar
          sidebarOpen={sidebar.sidebarOpen}
          setSidebarOpen={sidebar.setSidebarOpen}
        />

        {/* Mobile Backdrop */}
        <Backdrop
          open={sidebar.sidebarOpen}
          onClick={sidebar.closeSidebar}
          sx={{
            zIndex: 1200,
            display: { lg: "none" },
            backgroundColor: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
          }}
        />

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            ml: { lg: "288px" }, // Drawer width
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            transition: "margin 300ms ease",
          }}
        >
          {/* Header */}
          <Header
            setSidebarOpen={sidebar.setSidebarOpen}
            user={user}
            onLogout={onLogout}
          />

          {/* Page Content */}
          <Box sx={{ p: { xs: 2, sm: 3, lg: 4 } }}>{children}</Box>
        </Box>
      </Box>
    </>
  );
}

// Wrapper component that provides the layout context
export default function Layout({
  children,
  currentPageName,
  onLogout,
}: LayoutProps) {
  return (
    <LayoutProvider currentPageName={currentPageName}>
      <LayoutInner onLogout={onLogout}>{children}</LayoutInner>
    </LayoutProvider>
  );
}
