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
import { Currency, CurrencyAmount } from "@uniswap/sdk-core";
import { SupportedChainId } from "constants/chains";
import { useWeb3 } from "contexts/Web3Provider";
import useBlockNumber from "hooks/useBlockNumber";
import useENSAddress from "hooks/useENSAddress";
import useIsSwapDisabled from "hooks/useIsSwapDisabled";
import useWrapCallback, { WrapType } from "hooks/useWrapCallback";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";
import { useAppDispatch } from "state";
import { Field } from "state/swap/actions";
import {
  useDerivedSwapInfo,
  useSwapActionHandlers,
  useSwapState,
} from "state/swap/hooks";
import { maxAmountSpend } from "utils/maxAmountSpend";
import { BlockInfo, SwapSettings, TopBar } from "../components";

const Home: NextPage = () => {
  const dispatch = useAppDispatch();
  const { query } = useRouter();
  const { independentField, typedValue, recipient } = useSwapState();
  const {
    trade: { state: tradeState, trade },
    allowedSlippage,
    currencyBalances,
    parsedAmount,
    currencies,
    inputError: swapInputError,
  } = useDerivedSwapInfo();

  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError,
  } = useWrapCallback(
    currencies[Field.INPUT],
    currencies[Field.OUTPUT],
    typedValue
  );
  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE;
  const { address: recipientAddress } = useENSAddress(recipient);

  const parsedAmounts = useMemo(
    () =>
      showWrap
        ? {
            [Field.INPUT]: parsedAmount,
            [Field.OUTPUT]: parsedAmount,
          }
        : {
            [Field.INPUT]:
              independentField === Field.INPUT
                ? parsedAmount
                : trade?.inputAmount,
            [Field.OUTPUT]:
              independentField === Field.OUTPUT
                ? parsedAmount
                : trade?.outputAmount,
          },
    [independentField, parsedAmount, showWrap, trade]
  );

  const {
    onSwitchTokens,
    onCurrencySelection,
    onUserInput,
    onChangeRecipient,
  } = useSwapActionHandlers();
  const isValid = !swapInputError;
  const dependentField: Field =
    independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT;
  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value);
    },
    [onUserInput]
  );
  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value);
    },
    [onUserInput]
  );

  const formattedAmounts = useMemo(
    () => ({
      [independentField]: typedValue,
      [dependentField]: showWrap
        ? parsedAmounts[independentField]?.toExact() ?? ""
        : parsedAmounts[dependentField]?.toSignificant(6) ?? "",
    }),
    [dependentField, independentField, parsedAmounts, showWrap, typedValue]
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

  const handleSwapClick = async () => {
    if (!isAccountActive) {
      await connect();
    }
  };

  const maxInputAmount: CurrencyAmount<Currency> | undefined = useMemo(
    () => maxAmountSpend(currencyBalances[Field.INPUT]),
    [currencyBalances]
  );
  const showMaxButton = Boolean(
    maxInputAmount?.greaterThan(0) &&
      !parsedAmounts[Field.INPUT]?.equalTo(maxInputAmount)
  );

  const handleInputSelect = useCallback(
    (inputCurrency: Currency) => {
      // setApprovalSubmitted(false) // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, inputCurrency);
    },
    [onCurrencySelection]
  );

  const handleMaxInput = useCallback(() => {
    maxInputAmount && onUserInput(Field.INPUT, maxInputAmount.toExact());
  }, [maxInputAmount, onUserInput]);

  const handleOutputSelect = useCallback(
    (outputCurrency: Currency) =>
      onCurrencySelection(Field.OUTPUT, outputCurrency),
    [onCurrencySelection]
  );

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
            <SwapSettings placeholderSlippage={allowedSlippage} />
          </Stack>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <SwapField
                currency={currencies[Field.INPUT]}
                value={formattedAmounts[Field.INPUT]}
                otherCurrency={currencies[Field.OUTPUT]}
                onUserInput={handleTypeInput}
                onCurrencySelect={handleInputSelect}
                onMax={handleMaxInput}
                showMaxButton={showMaxButton}
              />
            </Grid>
            <Grid display={"flex"} justifyContent={"center"} item xs={12}>
              <IconButton
                onClick={() => onSwitchTokens()}
                color="primary"
                size="large"
              >
                <SwapVertIcon />
              </IconButton>
            </Grid>
            <Grid item xs={12}>
              <SwapField
                currency={currencies[Field.OUTPUT]}
                showMaxButton={false}
                otherCurrency={currencies[Field.INPUT]}
                value={formattedAmounts[Field.OUTPUT]}
                onUserInput={handleTypeOutput}
                onCurrencySelect={handleOutputSelect}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                disabled={!isValid}
                onClick={handleSwapClick}
                fullWidth
                variant="contained"
              >
                {swapInputError ? swapInputError : "Swap"}
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
