import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  List,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import type { NavigationItem } from "./LayoutContext"; // ← Import type

interface NavItemProps {
  item: NavigationItem;
  expandedMenus: Record<string, boolean>;
  toggleMenu: (menuName: string) => void;
  isActive: (href: string) => boolean;
  isChildActive: (children?: NavigationItem[]) => boolean; // ← Fix type
  onNavigate?: () => void;
}

export function NavItem({
  item,
  expandedMenus,
  toggleMenu,
  isActive,
  isChildActive,
  onNavigate,
}: NavItemProps) {
  const navigate = useNavigate();
  const hasChildren = item.children && item.children.length > 0;
  const isExpanded = expandedMenus[item.name];
  const active = item.href ? isActive(item.href) : false;
  const childActive = hasChildren ? isChildActive(item.children) : false;

  const handleClick = () => {
    if (hasChildren) {
      toggleMenu(item.name);
    } else if (item.href) {
      navigate(item.href);
      onNavigate?.();
    }
  };

  const IconComponent = item.icon;

  return (
    <>
      <ListItem disablePadding>
        <ListItemButton
          onClick={handleClick}
          sx={{
            borderRadius: 1.5,
            mb: 0.5,
            bgcolor: active || childActive ? "primary.main" : "transparent",
            color: active || childActive ? "white" : "text.primary",
            "&:hover": {
              bgcolor: active || childActive ? "primary.dark" : "grey.100",
            },
            transition: "all 0.2s",
          }}
        >
          {IconComponent && (
            <ListItemIcon
              sx={{
                minWidth: 40,
                color: active || childActive ? "white" : "text.secondary",
              }}
            >
              <IconComponent sx={{ fontSize: 20 }} />
            </ListItemIcon>
          )}
          <ListItemText
            primary={item.name}
            primaryTypographyProps={{
              variant: "body2",
              fontWeight: active || childActive ? 600 : 500,
            }}
          />
          {hasChildren && (
            <Box
              sx={{
                transition: "transform 0.2s",
                transform: isExpanded ? "rotate(0deg)" : "rotate(-90deg)",
              }}
            >
              <ExpandMoreIcon
                sx={{
                  fontSize: 20,
                  color: active || childActive ? "white" : "text.secondary",
                }}
              />
            </Box>
          )}
        </ListItemButton>
      </ListItem>

      {/* Children */}
      {hasChildren && (
        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
          <List disablePadding sx={{ pl: 2 }}>
            {item.children!.map((child) => {
              const childIsActive = child.href ? isActive(child.href) : false;
              const ChildIcon = child.icon;

              return (
                <ListItem key={child.name} disablePadding>
                  <ListItemButton
                    onClick={() => {
                      if (child.href) {
                        navigate(child.href);
                        onNavigate?.();
                      }
                    }}
                    sx={{
                      borderRadius: 1.5,
                      mb: 0.5,
                      bgcolor: childIsActive ? "primary.light" : "transparent",
                      color: childIsActive
                        ? "primary.contrastText"
                        : "text.primary",
                      "&:hover": {
                        bgcolor: childIsActive ? "primary.main" : "grey.100",
                      },
                      transition: "all 0.2s",
                    }}
                  >
                    {ChildIcon ? (
                      <ListItemIcon
                        sx={{
                          minWidth: 40,
                          color: childIsActive
                            ? "primary.contrastText"
                            : "text.secondary",
                        }}
                      >
                        <ChildIcon sx={{ fontSize: 18 }} />
                      </ListItemIcon>
                    ) : (
                      <Box
                        sx={{
                          width: 40,
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <ChevronRightIcon
                          sx={{
                            fontSize: 16,
                            color: childIsActive
                              ? "primary.contrastText"
                              : "text.secondary",
                          }}
                        />
                      </Box>
                    )}
                    <ListItemText
                      primary={child.name}
                      primaryTypographyProps={{
                        variant: "body2",
                        fontWeight: childIsActive ? 600 : 400,
                        fontSize: "0.875rem",
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Collapse>
      )}
    </>
  );
}
