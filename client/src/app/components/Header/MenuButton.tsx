import { IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

interface Props {
  handleDrawerToggle: () => void;
}

export default function MenuButton({ handleDrawerToggle }: Props) {
  return (
    <IconButton
      color="inherit"
      edge="start"
      onClick={handleDrawerToggle}
      sx={{ mr: 2, display: { sm: "none" } }}
    >
      <MenuIcon />
    </IconButton>
  );
}
