import { Percent } from "@uniswap/sdk-core";
import { useTheme } from "@mui/material";
import { useMemo } from "react";
import { warningSeverity } from "utils/prices";

type Props = {};

export default function usePriceImpactColor(priceImpact?: Percent) {
  const theme = useTheme();
  const priceImpactColor = useMemo(() => {
    if (!priceImpact) return undefined;
    if (priceImpact.lessThan("0")) return theme.palette.success.main;
    const severity = warningSeverity(priceImpact);
    if (severity < 1) return theme.typography.subtitle2.color;
    if (severity < 3) return theme.palette.warning.main;
    return theme.palette.error.main;
  }, [priceImpact, theme]);

  return priceImpactColor;
}
