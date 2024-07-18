'use client'

import * as React from 'react';
import Box from '@mui/material/Box';
import Header from '../components/Layout/Header/Header';
import Sidebar from '../components/Layout/Sidebar/Sidebar';
import Main from '../components/Main/Main';

const drawerWidth = 200;

interface Props {
  children: React.ReactNode
}

export default function DashboardLayout({children}: Props) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const height = 64;

  return (
    <Box sx={{ display: 'flex' }}>
      <Header height={height} drawerWidth={drawerWidth} handleDrawerToggle={handleDrawerToggle} />
      <Sidebar logoHeight={height} drawerWidth={drawerWidth} mobileOpen={mobileOpen} handleDrawerClose={handleDrawerClose} handleDrawerTransitionEnd={handleDrawerTransitionEnd}/>
      <Main drawerWidth={drawerWidth}>
        {children}
      </Main>
    </Box>
  );
}