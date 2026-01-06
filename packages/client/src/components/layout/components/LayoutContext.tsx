import { useNavigation } from "@/components/layout/hooks/useNavigation";
import { useSidebar } from "@/components/layout/hooks/useSidebar";
import { useGetCurrentUserQuery } from "@/redux/auth/api/authApi";
import { createContext, ReactNode, useMemo } from "react";

// Define NavigationItem type
export interface NavigationItem {
  name: string;
  href?: string;
  icon?: React.ComponentType<any>;
  children?: NavigationItem[];
}

export type LayoutContextType = {
  sidebar: ReturnType<typeof useSidebar>;
  navigation: NavigationItem[];
  currentPageName: string;
  user: any; //TODO: need to type properly
  queryState: {
    isLoading: boolean;
    isFetching: boolean;
  };
};

export const LayoutContext = createContext<LayoutContextType>(
  {} as LayoutContextType
);

interface P {
  children: ReactNode;
  currentPageName: string;
}

export const LayoutProvider = ({ children, currentPageName }: P) => {
  const sidebar = useSidebar();
  const navigation = useNavigation();
  const userQuery = useGetCurrentUserQuery();

  const value = useMemo(
    () => ({
      sidebar,
      navigation,
      currentPageName,
      user: userQuery.data,
      queryState: {
        isLoading: userQuery.isLoading,
        isFetching: userQuery.isFetching,
      },
    }),
    [
      sidebar,
      navigation,
      currentPageName,
      userQuery.data,
      userQuery.isLoading,
      userQuery.isFetching,
    ]
  );

  return (
    <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
  );
};
