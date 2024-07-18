import { Box, Drawer } from "@mui/material";
import SidebarItems from "./SidebarItems";
import { log } from "console";

interface Props {
  drawerWidth: number;
  handleDrawerClose: () => void;
  handleDrawerTransitionEnd: () => void;
  mobileOpen: boolean;
  logoHeight: number;
}

export default function Sidebar({
  drawerWidth,
  handleDrawerClose,
  handleDrawerTransitionEnd,
  mobileOpen,
  logoHeight,
}: Props) {
  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders"
    >
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onTransitionEnd={handleDrawerTransitionEnd}
        onClose={handleDrawerClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
      >
        <SidebarItems logoHeight={logoHeight} />
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
        open
      >
        <SidebarItems logoHeight={logoHeight} />
      </Drawer>
    </Box>
  );
}
