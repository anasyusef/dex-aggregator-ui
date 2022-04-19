import BrandingProvider from "@/components/BrandingProvider";
import SwapField from "@/components/SwapField/SwapField";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import {
  Button,
  Container,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { CHAIN_INFO } from "constants/chainInfo";
import { SupportedChainId } from "constants/chains";
import { useWeb3 } from "contexts/Web3Provider";
import useBlockNumber from "hooks/useBlockNumber";
import useIsSwapDisabled from "hooks/useIsSwapDisabled";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "state";
import {
  setInputAmount,
  setInputToken,
  setOutputAmount,
  setOutputToken,
  swapTokenPositions,
} from "state/swapSlice";
import { BlockInfo, SwapSettings, TopBar } from "../components";

const Home: NextPage = () => {
  const dispatch = useAppDispatch();
  const { input, output, inputAmount, outputAmount } = useAppSelector(
    (state) => state.swap
  );

  const blockNumber = useBlockNumber();
  const {
    chainId: chainIdWeb3,
    isNetworkSupported,
    isAccountActive,
    connect,
  } = useWeb3();
  const { isDisabled, message: swapMessage } = useIsSwapDisabled();
  let chainId = chainIdWeb3 || SupportedChainId.MAINNET;
  if (!isNetworkSupported) {
    chainId = SupportedChainId.MAINNET;
  }
  useEffect(() => {
    const chainInfo = CHAIN_INFO[chainId];
    dispatch(
      setInputToken({
        ...chainInfo.nativeCurrency,
        logoURI: chainInfo.logoUrl,
        chainId,
        address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      })
    );
  }, [chainId, dispatch]);

  const handleSwapClick = async () => {
    if (!isAccountActive) {
      await connect();
    }
  };

  return (
    <BrandingProvider>
      <TopBar />
      <Container sx={{ mt: 8 }} maxWidth="sm">
        <Paper
          variant="outlined"
          sx={{
            pt: 3,
            pb: 6,
            px: 5,
          }}
        >
          <Stack
            sx={{ mb: 2 }}
            justifyContent={"space-between"}
            direction={"row"}
          >
            <Typography display={"flex"} alignItems="center" variant="h6">
              Swap
            </Typography>
            <SwapSettings />
          </Stack>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <SwapField
                selectedToken={input}
                amount={inputAmount}
                onAmountChange={(val) => dispatch(setInputAmount(val))}
                otherTokenSelected={output}
                onTokenSelect={(val) => dispatch(setInputToken(val))}
              />
            </Grid>
            <Grid display={"flex"} justifyContent={"center"} item xs={12}>
              <IconButton
                onClick={() => dispatch(swapTokenPositions())}
                color="primary"
                size="large"
              >
                <SwapVertIcon />
              </IconButton>
            </Grid>
            <Grid item xs={12}>
              <SwapField
                selectedToken={output}
                otherTokenSelected={input}
                amount={outputAmount}
                onAmountChange={(val) => dispatch(setOutputAmount(val))}
                onTokenSelect={(val) => dispatch(setOutputToken(val))}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                disabled={isDisabled}
                onClick={handleSwapClick}
                fullWidth
                variant="contained"
              >
                {swapMessage}
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
      <BlockInfo />
    </BrandingProvider>
  );
};

export default Home;
