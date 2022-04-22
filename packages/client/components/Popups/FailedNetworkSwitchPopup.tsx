import { Typography } from "@mui/material";
import { CHAIN_INFO } from "constants/chainInfo";
import { SupportedChainId } from "constants/chains";
import { useContext } from "react";

export default function FailedNetworkSwitchPopup({
  chainId,
}: {
  chainId: SupportedChainId;
}) {
  const chainInfo = CHAIN_INFO[chainId];

  return (
    <Typography fontWeight={500}>
      Failed to switch networks from the Uniswap Interface. In order to use
      Uniswap on {chainInfo.label}, you must change the network in your wallet.
    </Typography>
  );
}
