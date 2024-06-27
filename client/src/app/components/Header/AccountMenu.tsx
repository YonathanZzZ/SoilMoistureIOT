import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "../../auth/useAuth";
import { usePathname, useRouter } from "next/navigation";

export default function AccountMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const auth = useAuth();

  function handleClick (event: React.MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget);
  };

  function handleClose () {
    setAnchorEl(null);
  };

  function handleSignoutButton(){
    auth.logout();
  };

  return (
    <>
      <IconButton
        id="daccount-button"
        onClick={handleClick}
      >
        <AccountCircleIcon />
      </IconButton>

      <Menu
        id="account-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Link href='/dashboard/account-settings'>
        <MenuItem>My account</MenuItem>
        </Link>
        
        <MenuItem onClick={handleSignoutButton}>Sign out</MenuItem> 
      </Menu>
    </>
  );
}
