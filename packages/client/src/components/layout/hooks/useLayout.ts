import {
  LayoutContext,
  LayoutContextType,
} from "@/components/layout/components/LayoutContext";
import { useContext } from "react";

export const useLayout = (): LayoutContextType => {
  const context = useContext(LayoutContext);
  if (!context)
    throw new Error("useLayoutUI must be used within LayoutUIProvider");
  return context;
};
