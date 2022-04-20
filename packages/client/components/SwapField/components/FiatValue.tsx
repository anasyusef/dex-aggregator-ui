import React, { useMemo } from "react";
import { CurrencyAmount, Token, Percent } from "@uniswap/sdk-core";
import { Stack, Typography, useTheme } from "@mui/material";
import { formatCurrencyAmount } from "utils/formatCurrencyAmount";
import { warningSeverity } from "utils/prices";

type Props = {
  fiatValue: CurrencyAmount<Token> | null | undefined;
  priceImpact?: Percent;
};

export default function FiatValue({ fiatValue, priceImpact }: Props) {
  const theme = useTheme();
  const priceImpactColor = useMemo(() => {
    if (!priceImpact) return undefined;
    if (priceImpact.lessThan("0")) return theme.palette.success.main;
    const severity = warningSeverity(priceImpact);
    if (severity < 1) return theme.typography.subtitle2.color;
    if (severity < 3) return theme.palette.warning.main;
    return theme.palette.error.main;
  }, [priceImpact, theme]);
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
