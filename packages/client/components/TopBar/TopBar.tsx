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
import { ethers } from "ethers";
import React, { ChangeEvent, useState, MouseEvent } from "react";
import Web3 from "web3";
import Web3Modal, { IProviderOptions } from "web3modal";
// import { useWeb3 } from "contexts/Web3Provider";
import WalletConnectProvider from "@walletconnect/web3-provider";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import Authereum from "authereum";
import { useDispatch } from "react-redux";
import { setup } from "state/web3Slice";
import { useWeb3 } from "contexts/Web3Provider";
import WalletButton from "./components/WalletButton";
import getProviderName from "utils/getProviderName";

type Props = {};

export default function TopBar() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { connect, provider } = useWeb3();
  const dispatch = useDispatch();

  const handleMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleConnect = async () => {
    // const providerOptions: IProviderOptions = {
    //     /* See Provider Options Section */
    //     walletconnect: {
    //       package: WalletConnectProvider,
    //       options: {
    //         infuraId: "7449d8ef8c5946acb839c0f74fcc9036",
    //       },
    //     },
    //     coinbasewallet: {
    //       package: CoinbaseWalletSDK, // Required
    //       options: {
    //         appName: "My Awesome App", // Required
    //         infuraId: "7449d8ef8c5946acb839c0f74fcc9036", // Required
    //         rpc: "", // Optional if `infuraId` is provided; otherwise it's required
    //         chainId: 1, // Optional. It defaults to 1 if not provided
    //         darkMode: false, // Optional. Use dark theme, defaults to false
    //       },
    //     },
    //     authereum: {
    //       package: Authereum, // required
    //     },
    //   };
    //   const web3Modal = new Web3Modal({
    //     network: "mainnet", // optional
    //     cacheProvider: false, // optional
    //     providerOptions, // required
    //   });
    //   const provider = await web3Modal.connect();
    //   const web3Provider = new ethers.providers.Web3Provider(provider)
    //   // console.log(web3Provider.listAccounts())
    //   const signer = web3Provider.getSigner()

    //   const address = await signer.getAddress();

    //   const balance = await signer.getBalance()

    //   // console.log(await signer.getAddress())
    //   // console.log(await signer.getBalance())
    //   // console.log(await signer.getTransactionCount())
    //   // console.log(await web3Provider.getSigner().getAddress())
    //   dispatch(setup({ address, balance }))
    await connect();
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
  if (provider) {
    console.log(getProviderName(provider.provider));
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar elevation={0} color="transparent" position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            DEX Aggregator
          </Typography>
          <Stack sx={{ mr: 3 }} gap={3} direction={"row"}>
            <Button variant="outlined" color="inherit">
              Ethereum
            </Button>
            <WalletButton />
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
