import { IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

interface Props {
  onClick: () => void;
}

export default function MenuButton({ onClick }: Props) {
  return (
    <IconButton
      size="large"
      edge="start"
      color="inherit"
      aria-label="open drawer"
      onClick={onClick}
    >
      <MenuIcon />
    </IconButton>
  );
}
