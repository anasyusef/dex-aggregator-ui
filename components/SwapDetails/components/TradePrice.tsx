import { Stack, Typography, StackProps } from "@mui/material";
import { Price, Currency } from "@uniswap/sdk-core";
import useUSDCPrice from "hooks/useUSDCPrice";
import React, { useCallback } from "react";
import { formatCurrencyAmount } from "utils/formatCurrencyAmount";

type Props = {
  price: Price<Currency, Currency>;
  showInverted: boolean;
  setShowInverted: (showInverted: boolean) => void;
  sx?: StackProps["sx"];
};

export default function TradePrice({
  price,
  setShowInverted,
  showInverted,
  sx,
}: Props) {
  const usdcPrice = useUSDCPrice(
    showInverted ? price.baseCurrency : price.quoteCurrency
  );

  let formattedPrice: string;
  try {
    formattedPrice = showInverted
      ? price.toSignificant(4)
      : price.invert()?.toSignificant(4);
  } catch (error) {
    formattedPrice = "0";
  }

  const label = showInverted
    ? `${price.quoteCurrency?.symbol}`
    : `${price.baseCurrency?.symbol} `;
  const labelInverted = showInverted
    ? `${price.baseCurrency?.symbol} `
    : `${price.quoteCurrency?.symbol}`;
  const flipPrice = useCallback(
    () => setShowInverted(!showInverted),
    [setShowInverted, showInverted]
  );

  const text = `${
    "1 " + labelInverted + " = " + formattedPrice ?? "-"
  } ${label}`;
  return (
    <Stack
      onClick={(e) => {
        e.stopPropagation(); // dont want this click to affect dropdowns / hovers
        flipPrice();
      }}
      direction={"row"}
      spacing={1}
    >
      <Typography
        sx={{ cursor: "pointer", userSelect: "none", ...sx }}
        variant="subtitle2"
      >
        {text}
      </Typography>
      {usdcPrice && (
        <Typography color={"ButtonText"} variant="subtitle2">
          (${usdcPrice.toSignificant(6, { groupSeparator: "," })})
        </Typography>
      )}
    </Stack>
  );
}
