"use client";

import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import InputBase from "@mui/material/InputBase";
import MenuButton from "./MenuButton";
import { useState } from "react";
import HeaderTitle from "./Text";
import SearchBox from "./SearchBox";
import AccountMenu from "./AccountMenu";

export default function Header() {
  const [showSideBar, setShowSideBar] = useState(false);

  function toggleMenu() {
    console.log("clickity clackety");
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <MenuButton onClick={toggleMenu} />
          <HeaderTitle text="Soil Moisture Monitor"/>
          <SearchBox />
          <AccountMenu />
        </Toolbar>
      </AppBar>
    </Box>
  );
}
