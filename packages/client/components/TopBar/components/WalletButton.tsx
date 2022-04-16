import { Button } from "@mui/material";
import { useWeb3 } from "contexts/Web3Provider";
import React, { useState } from "react";
import { shortenAddress } from "utils";
import WalletDialog from "./WalletDialog";

type Props = {};

export default function Wallet({}: Props) {
  const { connect, isAccountActive, account } = useWeb3();

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
    <Button onClick={() => setOpen(true)} variant="outlined">{shortenAddress(account as string)}</Button>
    <WalletDialog account={account!} open={open} onClose={() => setOpen(false)}  />
    </>
  );
}
