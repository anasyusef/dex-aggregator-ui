import React from "react";
import { Currency, TradeType } from "@uniswap/sdk-core";
import { InterfaceTrade } from "state/routing/types";
import { Badge, Chip } from "@mui/material";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";

type Props = {
  trade: InterfaceTrade<Currency, Currency, TradeType> | undefined | null; // dollar amount in active chain's stablecoin
  loading: boolean;
  showRoute?: boolean; // show route instead of gas estimation summary
  disableHover?: boolean;
};

export default function GasEstimateBadge({
  loading,
  trade,
  disableHover,
  showRoute,
}: Props) {
  const formattedGasPriceString = trade?.gasUseEstimateUSD
    ? trade.gasUseEstimateUSD.toFixed(2) === "0.00"
      ? "<$0.01"
      : "$" + trade.gasUseEstimateUSD.toFixed(2)
    : undefined;
  return (
    <Chip
      size="small"
      icon={<LocalGasStationIcon fontSize="small" />}
      label={formattedGasPriceString}
    />
  );
}
