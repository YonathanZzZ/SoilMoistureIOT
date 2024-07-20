import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "../../../http/http";
import { UserContext } from "../../UserContext";
import { IconButton, Menu, MenuItem, Divider, ListItem } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Link from "next/link";
import { WarningContext } from "../../WarningContext";

export default function AccountMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();
  const userContext = useContext(UserContext);
  const warningContext = useContext(WarningContext);

  const user = userContext?.user;

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  async function handleSignout() {
    const res = await signOut();
    if (!res.success) {
      //TODO use WarningContext to display error message
    } else {
      router.push("/signin");
    }
  }

  const name = user?.name;

  return (
    <>
      <IconButton id="daccount-button" onClick={handleClick}>
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
        <Link href="/dashboard/account-settings">
          <MenuItem>My account</MenuItem>
        </Link>

        <MenuItem onClick={handleSignout}>Sign out</MenuItem>

        <Divider />

        <ListItem sx={{ color: "red" }}>{name}</ListItem>
      </Menu>
    </>
  );
}
