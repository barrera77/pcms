// src/contexts/Providers.tsx
import { ReactNode } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { ThemeProvider } from "@/contexts/themeContext";
import store from "@/redux/store";

type P = {
  children: ReactNode;
};

export const Providers = ({ children }: P) => {
  return (
    <ReduxProvider store={store}>
      <ThemeProvider>{children}</ThemeProvider>
    </ReduxProvider>
  );
};
