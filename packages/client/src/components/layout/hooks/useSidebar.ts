import { useState } from "react";

export const useSidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>(
    {}
  );

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const openSidebar = () => setSidebarOpen(true);
  const closeSidebar = () => setSidebarOpen(false);

  const toggleMenu = (menuName: string) => {
    setExpandedMenus((prev) => ({ ...prev, [menuName]: !prev[menuName] }));
  };

  return {
    sidebarOpen,
    setSidebarOpen,
    toggleSidebar,
    openSidebar,
    closeSidebar,
    expandedMenus,
    toggleMenu,
  };
};
