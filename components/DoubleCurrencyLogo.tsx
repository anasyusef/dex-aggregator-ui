import React from "react";
import { Currency } from "@uniswap/sdk-core";
import { AvatarGroup } from "@mui/material";
import CurrencyLogo from "./CurrencyLogo";

type Props = {
  size?: number;
  currency0?: Currency;
  currency1?: Currency;
};

export default function DoubleCurrencyLogo({
  currency0,
  currency1,
  size,
}: Props) {
  return (
    <AvatarGroup max={2}>
      <CurrencyLogo currency={currency0} size={size} />
      <CurrencyLogo currency={currency1} size={size} />
    </AvatarGroup>
  );
}
