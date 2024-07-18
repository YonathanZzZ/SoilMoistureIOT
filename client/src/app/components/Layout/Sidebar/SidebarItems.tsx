import {
  Toolbar,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
} from "@mui/material";
import Link from "next/link";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { DeviceThermostat } from "@mui/icons-material";

interface Props {
  logoHeight: number;
}

export default function SidebarItems({ logoHeight }: Props) {
  const logoUrl = '/images/soil_logo.png'

  return (
    <Box>
      <Toolbar sx={{display: 'flex', justifyContent: 'center'}}>
        
        <Link href={"/dashboard"} passHref>
        <Box
          component="img"
          src={logoUrl}
          alt="logo"
        
          sx={{ height: `${logoHeight}px`, objectFit: 'cover', display: 'block'}}
        />
        </Link>

      </Toolbar>
      <Divider />
      <List>
        <Link href="/dashboard/devices">
          <ListItem key="Devices" disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <DeviceThermostat />
              </ListItemIcon>

              <ListItemText primary="My Devices" />
            </ListItemButton>
          </ListItem>
        </Link>
      </List>

      <Divider />

      <List>
        <Link href="/dashboard/add-device">
          <ListItem key="addDevice" disablePadding>
            <ListItemButton
              sx={{
                backgroundColor: "#FF5733",
                "&:hover": {
                  backgroundColor: "#FF8C33",
                },
              }}
            >
              <ListItemIcon>
                <AddCircleOutlineIcon />
              </ListItemIcon>

              <ListItemText primary="Add device" />
            </ListItemButton>
          </ListItem>
        </Link>
      </List>
    </Box>
  );
}
