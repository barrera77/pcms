import { Provider as ReduxProvider } from "react-redux";
import { ThemeProvider } from "@/contexts/themeContext";
import { Outlet } from "react-router-dom";
import store from "@/redux/store";

export const Providers = () => {
  return (
    <ReduxProvider store={store}>
      <ThemeProvider>
        <Outlet />
      </ThemeProvider>
    </ReduxProvider>
  );
};
