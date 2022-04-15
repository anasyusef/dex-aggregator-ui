import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Stack,
  Menu,
  MenuItem,
} from "@mui/material";
import { Settings as SettingsIcon } from "@mui/icons-material";
import { ethers } from 'ethers'
import React, { ChangeEvent, useState, MouseEvent } from "react";
import Web3 from "web3";
import Web3Modal, { IProviderOptions } from "web3modal";
import { useWeb3 } from "contexts/Web3Provider";


type Props = {};

export default function TopBar() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const s = useWeb3()

  const handleMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleConnect = async () => {
      await s.connect();
    };

    // const web3Modal = new Web3Modal({
    //   disableInjectedProvider: false,
    //   network: "mainnet", // optional
    //   cacheProvider: false, // optional
    //   providerOptions, // required
    // });
    // const instance = await web3Modal.connect();
    // const provider = new ethers.providers.Web3Provider(instance)
    // console.log(instance)
    // console.log(await provider.getBalance(instance.))
//   };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar elevation={0} color="transparent" position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            DEX Aggregator
          </Typography>
          <Stack sx={{ mr: 3 }} gap={3} direction={"row"}>
            <Button variant="outlined" color="inherit">Ethereum</Button>
            <Button variant="outlined" onClick={handleConnect} color="inherit">
              Connect Wallet
            </Button>
          </Stack>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <SettingsIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleClose}>My account</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
