"use client";

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import MenuButton from "./MenuButton";
import HeaderTitle from "./Text";
import SearchBox from "./SearchBox";
import AccountMenu from "./AccountMenu";

interface Props {
  drawerWidth: number;
  handleDrawerToggle: () => void;
}

export default function Header({ drawerWidth, handleDrawerToggle }: Props) {
  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
      }}
    >
      <Toolbar>
        <MenuButton handleDrawerToggle={handleDrawerToggle} />
        <HeaderTitle text="Soil Moisture Monitor" />
        <SearchBox />
        <AccountMenu />
      </Toolbar>
    </AppBar>
  );
}
