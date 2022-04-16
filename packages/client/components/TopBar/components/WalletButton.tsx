import { Button, Divider, Stack, Typography } from "@mui/material";
import { useNativeCurrencyBalance, useWeb3 } from "contexts/Web3Provider";
import React, { useState } from "react";
import { shortenAddress } from "utils";
import { ProviderIcon } from "components";
import WalletDialog from "./WalletDialog";

type Props = {};

export default function Wallet({}: Props) {
  const { connect, isAccountActive, account } = useWeb3();
  const { formattedBalance } = useNativeCurrencyBalance();

  const handleConnect = async () => {
    await connect();
  };

  const [open, setOpen] = useState(false);

  if (!isAccountActive) {
    return (
      <Button variant="outlined" onClick={handleConnect} color="inherit">
        Connect Wallet
      </Button>
    );
  }
  return (
    <>
      <Button
        endIcon={<ProviderIcon />}
        onClick={() => setOpen(true)}
        variant="outlined"
      >
        <Stack
          direction={"row"}
          divider={<Divider orientation="vertical" flexItem />}
          gap={2}
        >
          <Typography variant="button">
            {Math.round(+formattedBalance * 10) / 10} ETH
          </Typography>
          {shortenAddress(account as string)}
        </Stack>
      </Button>
      <WalletDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}
function useeNativeCurrencyBalance() {
  throw new Error("Function not implemented.");
}
