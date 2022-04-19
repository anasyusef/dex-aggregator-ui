import { Divider, Link, Stack, Tooltip, Typography } from "@mui/material";
import { useActiveWeb3 } from "contexts/Web3Provider";
import JSBI from "jsbi";
import useBlockNumber from "hooks/useBlockNumber";
import useGasPrice from "hooks/useGasPrice";
import React from "react";
import { ExplorerDataType, getExplorerLink } from "utils/getExplorerLink";

type Props = {};

export default function BlockInfo({}: Props) {
  const { chainId } = useActiveWeb3();
  const blockNumber = useBlockNumber();
  const ethGasPrice = useGasPrice();
  const priceGwei = ethGasPrice
    ? JSBI.divide(ethGasPrice, JSBI.BigInt(1000000000))
    : undefined;
  return (
    <Stack
      display={"flex"}
      justifyContent={"center"}
      sx={{ position: "fixed", right: 0, bottom: 0, p: 2 }}
      direction="row"
      spacing={1}
      divider={
        <Divider
          orientation="vertical"
          flexItem
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "dark"
                ? theme.palette.text.primary
                : theme.palette.text.primary,
          }}
        />
      }
    >
      {priceGwei && (
        <Tooltip title="The current fast gas amount for sending transactions on the ETH network.">
          <Link
            target={"_blank"}
            href={"https://etherscan.io/gastracker"}
            color="inherit"
            variant="caption"
          >
            <>{priceGwei} gwei</>
          </Link>
        </Tooltip>
      )}
      <Tooltip title="The most recent block number on this network">
        <Link
          target={"_blank"}
          color="inherit"
          href={
            chainId && blockNumber
              ? getExplorerLink(
                  chainId,
                  blockNumber.toString(),
                  ExplorerDataType.BLOCK
                )
              : ""
          }
          variant="caption"
        >
          {blockNumber}
        </Link>
      </Tooltip>
    </Stack>
  );
}
