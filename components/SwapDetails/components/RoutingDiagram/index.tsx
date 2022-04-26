import { useActiveWeb3 } from "contexts/Web3Provider";
import React, { useState } from "react";
import { getTokenPath, RoutingDiagramEntry } from "./utils";
import { Currency } from "@uniswap/sdk-core";
import { Box, Chip, Stack, Typography } from "@mui/material";
import CurrencyLogo from "@/components/CurrencyLogo";
import { useTokenInfoFromActiveList } from "hooks/useTokenInfoFromActiveList";
import DoubleCurrencyLogo from "@/components/DoubleCurrencyLogo";
import {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineSeparator,
} from "@mui/lab";

type Props = {
  currencyIn: Currency;
  currencyOut: Currency;
  routes: RoutingDiagramEntry[];
};

export default function RoutingDiagram({
  currencyIn,
  currencyOut,
  routes,
}: Props) {
  const tokenIn = useTokenInfoFromActiveList(currencyIn);
  const tokenOut = useTokenInfoFromActiveList(currencyOut);
  return (
    <Timeline position="right">
      {routes.map((entry, index) => (
        <TimelineItem sx={{ transform: "rotate(90deg)" }} key={index}>
          <CurrencyLogo currency={tokenIn} size={20} />
          <TimelineSeparator sx={{}}>
            <TimelineConnector />
            {/* <TimelineDot variant="outlined"> */}
            <Route entry={entry} />
            {/* </TimelineDot> */}
            <TimelineConnector />
          </TimelineSeparator>
          <CurrencyLogo currency={tokenOut} size={20} />
        </TimelineItem>
      ))}
    </Timeline>
  );
}

function Route({
  entry: { path, percent, protocol },
}: {
  entry: RoutingDiagramEntry;
}) {
  return (
    <Box>
      {path.map(([currency0, currency1, feeAmount], index) => (
        <DoubleCurrencyLogo
          key={index}
          currency0={currency0}
          currency1={currency1}
        />
      ))}
    </Box>
  );
}
