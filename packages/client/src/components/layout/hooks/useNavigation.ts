import LayoutDashboardIcon from "@mui/icons-material/Dashboard";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ClipboardListIcon from "@mui/icons-material/Assignment";
import BarChartIcon from "@mui/icons-material/BarChart";
import UsersIcon from "@mui/icons-material/People";
import MapPinIcon from "@mui/icons-material/Place";
import BoxesIcon from "@mui/icons-material/Inventory2";
import WrenchIcon from "@mui/icons-material/Build";

export interface NavigationItem {
  name: string;
  href?: string;
  icon?: any;
  children?: NavigationItem[];
}

export const useNavigation = (): NavigationItem[] => [
  { name: "Dashboard", href: "Dashboard", icon: LayoutDashboardIcon },
  { name: "Technician View", href: "TechnicianView", icon: SmartphoneIcon },
  { name: "Calendar", href: "CalendarView", icon: CalendarTodayIcon },
  { name: "Service Jobs", href: "ServiceJobs", icon: ClipboardListIcon },
  { name: "Analytics", href: "Analytics", icon: BarChartIcon },
  { name: "Employees", href: "Employees", icon: UsersIcon },
  {
    name: "Locations",
    icon: MapPinIcon,
    children: [
      { name: "Provinces", href: "Provinces" },
      { name: "Cities", href: "Cities" },
      { name: "Areas", href: "Areas" },
      { name: "Buildings", href: "Buildings" },
    ],
  },
  {
    name: "Inventory",
    icon: BoxesIcon,
    children: [
      { name: "Stock Overview", href: "Inventory" },
      { name: "Products", href: "Products" },
      { name: "Transactions", href: "InventoryTransactions" },
    ],
  },
  { name: "Equipment", href: "Equipment", icon: WrenchIcon },
];
