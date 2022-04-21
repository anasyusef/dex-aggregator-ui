import React, { useState } from "react";
import { Currency, TradeType } from "@uniswap/sdk-core";
import { InterfaceTrade } from "state/routing/types";
import { useActiveWeb3 } from "contexts/Web3Provider";
import { getTokenPath } from "./RoutingDiagram/utils";
import { Skeleton } from "@mui/material";
import RoutingDiagram from "./RoutingDiagram";

type Props = {
  trade: InterfaceTrade<Currency, Currency, TradeType>;
  syncing: boolean;
  fixedOpen?: boolean; // fixed in open state, hide open/close icon
};

export default function SwapRoute({ syncing, trade, fixedOpen }: Props) {
  const formattedGasPriceString = trade?.gasUseEstimateUSD
    ? trade.gasUseEstimateUSD.toFixed(2) === "0.00"
      ? "<$0.01"
      : "$" + trade.gasUseEstimateUSD.toFixed(2)
    : undefined;
  const routes = getTokenPath(trade);
  const [open, setOpen] = useState(false);
  const { chainId } = useActiveWeb3();

  return (
    <>
      {syncing ? (
        <Skeleton>
          <div style={{ width: "400px", height: "30px" }} />
        </Skeleton>
      ) : (
        <RoutingDiagram
          currencyIn={trade.inputAmount.currency}
          currencyOut={trade.outputAmount.currency}
          routes={routes}
        />
      )}
    </>
  );
}
