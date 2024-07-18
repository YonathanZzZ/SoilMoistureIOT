import { Alert, Box, Snackbar, Toolbar } from "@mui/material";
import Content from "./Content";
import { createContext, useState } from "react";

interface Props {
  drawerWidth: number;
  children: React.ReactNode;
}

export default function Main({ children, drawerWidth }: Props) {
  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
    >
      <Toolbar />
      <Content>{children}</Content>
    </Box>
  );
}
