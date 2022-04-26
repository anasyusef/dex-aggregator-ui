import ErrorIcon from "@mui/icons-material/Error";
import { Button, Divider, Stack, Typography } from "@mui/material";
import { ProviderIcon } from "components";
import { CHAIN_INFO } from "constants/chainInfo";
import { SupportedChainId } from "constants/chains";
import { useNativeCurrencyBalance, useWeb3 } from "contexts/Web3Provider";
import { useState } from "react";
import { shortenAddress } from "utils";
import WalletDialog from "./WalletDialog";

type Props = {};

export default function Wallet({}: Props) {
  const { connect, isAccountActive, account, chainId, isNetworkSupported } =
    useWeb3();
  const { formattedBalance } = useNativeCurrencyBalance();
  const [open, setOpen] = useState(false);

  const handleConnect = async () => {
    await connect();
  };

  if (!isNetworkSupported && isAccountActive) {
    return (
      <Button variant="outlined" startIcon={<ErrorIcon />} color="error">
        Wrong Network
      </Button>
    );
  }

  const { nativeCurrency } = CHAIN_INFO[chainId || SupportedChainId.MAINNET];

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
            {Math.round(+formattedBalance * 10) / 10} {nativeCurrency.symbol}
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
