import {
  Card,
  CardContent,
  Divider,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { Currency, Percent, TradeType } from "@uniswap/sdk-core";
import { SUPPORTED_GAS_ESTIMATE_CHAIN_IDS } from "constants/chains";
import { useActiveWeb3 } from "contexts/Web3Provider";
import usePriceImpactColor from "hooks/usePriceImpactColor";
import { useMemo, useState } from "react";
import { InterfaceTrade } from "state/routing/types";
import { computeRealizedLPFeePercent } from "utils/prices";

type Props = {
  trade?: InterfaceTrade<Currency, Currency, TradeType>;
  allowedSlippage: Percent;
  syncing?: boolean;
};

export default function AdvancedSwapDetails({
  allowedSlippage,
  syncing,
  trade,
}: Props) {
  const { chainId } = useActiveWeb3();
  const [open, setOpen] = useState(false);

  const { expectedOutputAmount, priceImpact } = useMemo(() => {
    if (!trade)
      return { expectedOutputAmount: undefined, priceImpact: undefined };
    const expectedOutputAmount = trade.outputAmount;
    const realizedLpFeePercent = computeRealizedLPFeePercent(trade);
    const priceImpact = trade.priceImpact.subtract(realizedLpFeePercent);
    return { expectedOutputAmount, priceImpact };
  }, [trade]);
  const priceImpactColor = usePriceImpactColor(priceImpact);
  return !trade ? null : (
    <Card variant="outlined">
      <CardContent>
        <Stack justifyContent={"space-between"} direction="row">
          <Typography variant="subtitle2">Expected output</Typography>
          {syncing ? (
            <Skeleton width={100} />
          ) : (
            <Typography variant="subtitle2" textAlign={"right"}>
              {expectedOutputAmount
                ? `${expectedOutputAmount.toSignificant(6)}  ${
                    expectedOutputAmount.currency.symbol
                  }`
                : "-"}
            </Typography>
          )}
        </Stack>
        <Stack justifyContent={"space-between"} direction="row">
          <Typography variant="subtitle2">Price impact</Typography>
          {syncing ? (
            <Skeleton width={90} />
          ) : (
            <Typography
              variant="subtitle2"
              textAlign={"right"}
              color={priceImpactColor}
            >
              {priceImpact ? `${priceImpact.multiply(-1).toFixed(2)}%` : "-"}
            </Typography>
          )}
        </Stack>
        <Divider sx={{ my: 1 }} />
        <Stack justifyContent={"space-between"} direction="row">
          {trade?.tradeType === TradeType.EXACT_INPUT ? (
            <Typography color="ButtonText" variant="subtitle2">
              Minimum received after slippage ({allowedSlippage.toFixed(2)}%)
            </Typography>
          ) : (
            <Typography color="ButtonText" variant="subtitle2">
              Maximum sent after slippage ({allowedSlippage.toFixed(2)}%)
            </Typography>
          )}
          {syncing ? (
            <Skeleton width={90} />
          ) : (
            <Typography
              color="ButtonText"
              variant="subtitle2"
              textAlign={"right"}
            >
              {trade.tradeType === TradeType.EXACT_INPUT
                ? `${trade
                    .minimumAmountOut(allowedSlippage)
                    .toSignificant(6)} ${trade.outputAmount.currency.symbol}`
                : `${trade.maximumAmountIn(allowedSlippage).toSignificant(6)} ${
                    trade.inputAmount.currency.symbol
                  }`}
            </Typography>
          )}
        </Stack>
        {!trade?.gasUseEstimateUSD ||
        !chainId ||
        !SUPPORTED_GAS_ESTIMATE_CHAIN_IDS.includes(chainId) ? null : (
          <Stack justifyContent={"space-between"} direction="row">
            <Typography color="ButtonText" variant="subtitle2">
              Network Fee
            </Typography>
            {syncing ? (
              <Skeleton width={65} />
            ) : (
              <Typography
                color="ButtonText"
                variant="subtitle2"
                textAlign={"right"}
              >
                ~${trade.gasUseEstimateUSD.toFixed(2)}
              </Typography>
            )}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
