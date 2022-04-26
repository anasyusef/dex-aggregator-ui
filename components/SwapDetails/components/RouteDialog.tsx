import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Stack,
  Card,
  CardContent,
  Typography,
  Chip,
  Grid,
} from "@mui/material";
import { Currency } from "@uniswap/sdk-core";
import { nativeOnChain } from "constants/tokens";
import { useActiveWeb3 } from "contexts/Web3Provider";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import React from "react";
import { CurrencyLogo } from "../..";
import { Box } from "@mui/system";

type Props = {
  open: boolean;
  onClose: () => void;
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

function CurrencyRoute() {
  const { chainId } = useActiveWeb3();
  const native = nativeOnChain(chainId);
  return (
    <Card variant="outlined">
      <CardContent>
        <Stack alignItems={"center"} spacing={0.5} direction="row">
          <CurrencyLogo currency={native} size={20} />
          <Typography>ETH</Typography>
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

export default function RouteDialog({ onClose, open }: Props) {
  const { chainId } = useActiveWeb3();
  const native = nativeOnChain(chainId);
  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="route-dialog">
      <DialogTitle id="route-dialog">Routing</DialogTitle>
      <DialogContent>
        <Stack spacing={4}>
          <Stack spacing={1} alignItems={"center"} direction="row">
            <Box sx={{ mr: 1 }}>
              <CurrencyLogo currency={native} size={30} />
            </Box>
            <Typography variant="caption">50%</Typography>
            <KeyboardArrowDownIcon sx={{ transform: "rotate(270deg)" }} />
            <CurrencyRoute />
            <KeyboardArrowDownIcon sx={{ transform: "rotate(270deg)" }} />
            <CurrencyRoute />
            <KeyboardArrowDownIcon sx={{ transform: "rotate(270deg)" }} />
            <CurrencyLogo currency={native} size={30} />
          </Stack>
          <Stack spacing={1} alignItems={"center"} direction="row">
            <Box sx={{ mr: 1 }}>
              <CurrencyLogo currency={native} size={30} />
            </Box>
            <Typography variant="caption">40%</Typography>
            <KeyboardArrowDownIcon sx={{ transform: "rotate(270deg)" }} />
            <CurrencyRoute />
            <KeyboardArrowDownIcon sx={{ transform: "rotate(270deg)" }} />
            <CurrencyRoute />
            <KeyboardArrowDownIcon sx={{ transform: "rotate(270deg)" }} />
            <CurrencyLogo currency={native} size={30} />
          </Stack>
          <Stack spacing={1} alignItems={"center"} direction="row">
            <Box sx={{ mr: 1 }}>
              <CurrencyLogo currency={native} size={30} />
            </Box>
            <Typography variant="caption">10%</Typography>
            <KeyboardArrowDownIcon sx={{ transform: "rotate(270deg)" }} />
            <CurrencyRoute />
            <KeyboardArrowDownIcon sx={{ transform: "rotate(270deg)" }} />
            <CurrencyLogo currency={native} size={30} />
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
