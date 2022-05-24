import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { WETH } from "@uniswap/sdk";
import { Currency } from "@uniswap/sdk-core";
import { DAI, USDT, WBTC } from "constants/tokens";
import { useActiveWeb3 } from "contexts/Web3Provider";
import { sample } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { CurrencyLogo } from "../..";

type Props = {
  open: boolean;
  onClose: () => void;
  steps: number;
  inputCurrency?: Currency | null;
  outputCurrency?: Currency | null;
};

interface IDex {
  name: string;
  percent: number;
}

interface IStep {
  currency: Currency;
  dexes: IDex[];
}

interface IRoute {
  percent: number;
  step: IStep[];
}

interface ICurrencyRoute {
  currency?: Currency | null;
  useIntermediary?: boolean;
}

function CurrencyRoute({ currency, useIntermediary = false }: ICurrencyRoute) {
  const { chainId } = useActiveWeb3();
  const intermediaries = useMemo(
    () => [DAI, USDT, WBTC, WETH[chainId as 1 | 3 | 4 | 5 | 42]],
    [chainId]
  );
  const [intermediary, setIntermediary] = useState(intermediaries[0]);
  const currencyToUse = useIntermediary ? intermediary : currency;
  useEffect(() => {
    // create interval
    const interval = setInterval(
      () => setIntermediary(sample(intermediaries) as any),
      45000
    );

    // clean up interval on unmount
    return () => {
      clearInterval(interval);
    };
  }, [intermediaries]);
  return (
    <Card variant="outlined">
      <CardContent>
        <Stack alignItems={"center"} spacing={0.5} direction="row">
          <CurrencyLogo currency={currencyToUse as any} size={20} />
          <Typography>{currencyToUse?.symbol}</Typography>
        </Stack>
        <Grid container>
          <Grid item xs={9}>
            <Typography variant="subtitle2" sx={{ mr: 4 }}>
              Sushiswap
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="subtitle2" align="right">
              8%
            </Typography>
          </Grid>
          <Grid item xs={9}>
            <Typography variant="subtitle2" sx={{ mr: 4 }}>
              UniswapV2
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="subtitle2" align="right">
              20%
            </Typography>
          </Grid>
          <Grid item xs={9}>
            <Typography variant="subtitle2" sx={{ mr: 4 }}>
              UniswapV3
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="subtitle2" align="right">
              20%
            </Typography>
          </Grid>
          <Grid item xs={9}>
            <Typography variant="subtitle2" sx={{ mr: 4 }}>
              Shibaswap
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="subtitle2" align="right">
              25%
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default function RouteDialog({
  onClose,
  open,
  steps,
  inputCurrency,
  outputCurrency,
}: Props) {
  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="route-dialog">
      <DialogTitle id="route-dialog">Routing</DialogTitle>
      <DialogContent>
        <Stack spacing={4}>
          {new Array(steps).fill(0).map((_, idx) => (
            <Stack key={idx} spacing={1} alignItems={"center"} direction="row">
              <Box sx={{ mr: 1 }}>
                <CurrencyLogo currency={inputCurrency} size={30} />
              </Box>
              <Typography variant="caption">
                {Math.round((1 / steps) * 10000) / 100}%
              </Typography>
              <KeyboardArrowDownIcon sx={{ transform: "rotate(270deg)" }} />
              <CurrencyRoute useIntermediary />
              <KeyboardArrowDownIcon sx={{ transform: "rotate(270deg)" }} />
              <CurrencyRoute currency={outputCurrency} />
              <KeyboardArrowDownIcon sx={{ transform: "rotate(270deg)" }} />
              <CurrencyLogo currency={outputCurrency} size={30} />
            </Stack>
          ))}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
