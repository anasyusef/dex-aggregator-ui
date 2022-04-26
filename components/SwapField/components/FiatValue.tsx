import React, { useMemo } from "react";
import { CurrencyAmount, Token, Percent } from "@uniswap/sdk-core";
import { Stack, Typography, useTheme } from "@mui/material";
import { formatCurrencyAmount } from "utils/formatCurrencyAmount";
import { warningSeverity } from "utils/prices";
import usePriceImpactColor from "hooks/usePriceImpactColor";

type Props = {
  fiatValue: CurrencyAmount<Token> | null | undefined;
  priceImpact?: Percent;
};

export default function FiatValue({ fiatValue, priceImpact }: Props) {
  const priceImpactColor = usePriceImpactColor(priceImpact);
  if (!fiatValue) return null;
  return (
    <Stack spacing={1} direction="row">
      <Typography color={"ButtonText"} variant="subtitle2">
        ${formatCurrencyAmount(fiatValue, 6)}
      </Typography>
      {priceImpact && (
        <Typography color={priceImpactColor} variant="subtitle2">
          ({priceImpact.multiply(-1).toSignificant(3)}%)
        </Typography>
      )}
    </Stack>
  );
}
