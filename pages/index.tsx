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
  Tooltip,
  Typography,
} from "@mui/material";
import { Currency, CurrencyAmount } from "@uniswap/sdk-core";
import { SupportedChainId } from "constants/chains";
import { useWeb3 } from "contexts/Web3Provider";
import useBlockNumber from "hooks/useBlockNumber";
import useENSAddress from "hooks/useENSAddress";
import { useUSDCValue } from "hooks/useUSDCPrice";
import useWrapCallback, { useErrorText, WrapType } from "hooks/useWrapCallback";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppDispatch } from "state";
import { TradeState } from "state/routing/types";
import { Field } from "state/swap/actions";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  useDerivedSwapInfo,
  useSwapActionHandlers,
  useSwapState,
} from "state/swap/hooks";
import { TradeType } from "@uniswap/sdk";
import { Trade } from "@uniswap/router-sdk";
import { computeFiatValuePriceImpact } from "utils/computeFiatValuePriceImpact";
import { maxAmountSpend } from "utils/maxAmountSpend";
import {
  BlockInfo,
  ConfirmSwapDialog,
  CurrencyLogo,
  Popups,
  SwapDetails,
  SwapSettings,
  TopBar,
} from "../components";
import JSBI from "jsbi";
import confirmPriceImpactWithoutFee from "utils/confirmPriceImpactWithoutFee";
import {
  ApprovalState,
  useApprovalOptimizedTrade,
  useApproveCallbackFromTrade,
} from "hooks/useApproveCallback";
import {
  useERC20PermitFromTrade,
  UseERC20PermitState,
} from "hooks/useERC20Permit";
import { useUserTransactionTTL } from "state/user/hooks";
import useTransactionDeadline from "hooks/useTransactionDeadline";
import { useSwapCallback } from "hooks/useSwapCallback";
import useIsArgentWallet from "hooks/useIsArgentWallet";
import { Trade as V2Trade } from "@uniswap/v2-sdk";
import { Trade as V3Trade } from "@uniswap/v3-sdk";
import { warningSeverity } from "utils/prices";
import { useAddPopup } from "state/application/hooks";
import { DEFAULT_TXN_DISMISS_MS } from "constants/misc";

const Home: NextPage = () => {
  const { independentField, typedValue, recipient } = useSwapState();
  const [showInverted, setShowInverted] = useState(false);
  const {
    trade: { state: tradeState, trade },
    allowedSlippage,
    currencyBalances,
    parsedAmount,
    currencies,
    inputError: swapInputError,
  } = useDerivedSwapInfo();

  // modal and loading
  const [
    { showConfirm, tradeToConfirm, swapErrorMessage, attemptingTxn, txHash },
    setSwapState,
  ] = useState<{
    showConfirm: boolean;
    tradeToConfirm: Trade<Currency, Currency, TradeType> | undefined;
    attemptingTxn: boolean;
    swapErrorMessage: string | undefined;
    txHash: string | undefined;
  }>({
    showConfirm: false,
    tradeToConfirm: undefined,
    attemptingTxn: false,
    swapErrorMessage: undefined,
    txHash: undefined,
  });

  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError,
  } = useWrapCallback(
    currencies[Field.INPUT],
    currencies[Field.OUTPUT],
    typedValue
  );

  const wrapErrorText = useErrorText({ wrapInputError });
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

  const [routeNotFound, routeIsLoading, routeIsSyncing] = useMemo(
    () => [
      !trade?.swaps,
      TradeState.LOADING === tradeState,
      TradeState.SYNCING === tradeState,
    ],
    [trade, tradeState]
  );

  const fiatValueInput = useUSDCValue(trade?.inputAmount);
  const fiatValueOutput = useUSDCValue(trade?.outputAmount);

  const priceImpact = useMemo(
    () =>
      routeIsSyncing
        ? undefined
        : computeFiatValuePriceImpact(fiatValueInput, fiatValueOutput),
    [fiatValueInput, fiatValueOutput, routeIsSyncing]
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
  let chainId = chainIdWeb3 || SupportedChainId.MAINNET;
  if (!isNetworkSupported) {
    chainId = SupportedChainId.MAINNET;
  }

  const handleSwapClick = async () => {
    setSwapState({
      tradeToConfirm: trade,
      attemptingTxn: false,
      swapErrorMessage: undefined,
      showConfirm: true,
      txHash: undefined,
    });
  };

  const userHasSpecifiedInputOutput = Boolean(
    currencies[Field.INPUT] &&
      currencies[Field.OUTPUT] &&
      parsedAmounts[independentField]?.greaterThan(JSBI.BigInt(0))
  );

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
      setApprovalSubmitted(false); // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, inputCurrency);
    },
    [onCurrencySelection]
  );

  const transactionDeadline = useTransactionDeadline();
  const handleMaxInput = useCallback(() => {
    maxInputAmount && onUserInput(Field.INPUT, maxInputAmount.toExact());
  }, [maxInputAmount, onUserInput]);

  const handleOutputSelect = useCallback(
    (outputCurrency: Currency) =>
      onCurrencySelection(Field.OUTPUT, outputCurrency),
    [onCurrencySelection]
  );

  const approvalOptimizedTrade = useApprovalOptimizedTrade(
    trade,
    allowedSlippage
  );

  const handleAcceptChanges = useCallback(() => {
    setSwapState({
      tradeToConfirm: trade,
      swapErrorMessage,
      txHash,
      attemptingTxn,
      showConfirm,
    });
  }, [attemptingTxn, showConfirm, swapErrorMessage, trade, txHash]);

  const handleConfirmDismiss = useCallback(() => {
    setSwapState({
      showConfirm: false,
      tradeToConfirm,
      attemptingTxn,
      swapErrorMessage,
      txHash,
    });
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.INPUT, "");
    }
  }, [attemptingTxn, onUserInput, swapErrorMessage, tradeToConfirm, txHash]);

  const {
    state: signatureState,
    signatureData,
    gatherPermitSignature,
  } = useERC20PermitFromTrade(
    approvalOptimizedTrade,
    allowedSlippage,
    transactionDeadline
  );

  const handleConnect = async () => {
    await connect();
  };

  const approvalOptimizedTradeString =
    approvalOptimizedTrade instanceof V2Trade
      ? "V2SwapRouter"
      : approvalOptimizedTrade instanceof V3Trade
      ? "V3SwapRouter"
      : "SwapRouter";

  // check whether the user has approved the router on the input token
  const [approvalState, approveCallback] = useApproveCallbackFromTrade(
    approvalOptimizedTrade,
    allowedSlippage
  );

  // the callback to execute the swap
  const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(
    approvalOptimizedTrade,
    allowedSlippage,
    recipient,
    signatureData
  );

  const isArgentWallet = useIsArgentWallet();

  // warnings on the greater of fiat value price impact and execution price impact
  const priceImpactSeverity = useMemo(() => {
    const executionPriceImpact = trade?.priceImpact;
    return warningSeverity(
      executionPriceImpact && priceImpact
        ? executionPriceImpact.greaterThan(priceImpact)
          ? executionPriceImpact
          : priceImpact
        : executionPriceImpact ?? priceImpact
    );
  }, [priceImpact, trade]);

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false);

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approvalState === ApprovalState.PENDING) {
      setApprovalSubmitted(true);
    }
  }, [approvalState, approvalSubmitted]);

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
    !isArgentWallet &&
    !swapInputError &&
    (approvalState === ApprovalState.NOT_APPROVED ||
      approvalState === ApprovalState.PENDING ||
      (approvalSubmitted && approvalState === ApprovalState.APPROVED)) &&
    !(priceImpactSeverity > 3);

  const priceImpactTooHigh = priceImpactSeverity > 3;

  const handleSwap = useCallback(() => {
    if (!swapCallback) {
      return;
    }
    if (priceImpact && !confirmPriceImpactWithoutFee(priceImpact)) {
      return;
    }
    setSwapState({
      attemptingTxn: true,
      tradeToConfirm,
      showConfirm,
      swapErrorMessage: undefined,
      txHash: undefined,
    });
    swapCallback()
      .then((hash) => {
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          showConfirm,
          swapErrorMessage: undefined,
          txHash: hash,
        });
      })
      .catch((error) => {
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          showConfirm,
          swapErrorMessage: error.message,
          txHash: undefined,
        });
      });
  }, [swapCallback, priceImpact, tradeToConfirm, showConfirm]);

  const handleApprove = useCallback(async () => {
    if (
      signatureState === UseERC20PermitState.NOT_SIGNED &&
      gatherPermitSignature
    ) {
      try {
        await gatherPermitSignature();
      } catch (error) {
        // try to approve if gatherPermitSignature failed for any reason other than the user rejecting it
        if ((error as any)?.code !== 4001) {
          await approveCallback();
        }
      }
    } else {
      await approveCallback();
    }
  }, [signatureState, gatherPermitSignature, approveCallback]);

  const addPopup = useAddPopup();

  return (
    <BrandingProvider>
      <TopBar />
      <ConfirmSwapDialog
        isOpen={showConfirm}
        trade={trade}
        originalTrade={tradeToConfirm}
        onAcceptChanges={handleAcceptChanges}
        attemptingTxn={attemptingTxn}
        txHash={txHash}
        recipient={recipient}
        allowedSlippage={allowedSlippage}
        onConfirm={handleSwap}
        swapErrorMessage={swapErrorMessage}
        onDismiss={handleConfirmDismiss}
      />
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
                fiatValue={fiatValueInput}
                loading={independentField === Field.OUTPUT && routeIsSyncing}
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
                priceImpact={priceImpact}
                onCurrencySelect={handleOutputSelect}
                fiatValue={fiatValueOutput}
                loading={independentField === Field.INPUT && routeIsSyncing}
              />
            </Grid>
            <Grid item xs={12}>
              {!showWrap &&
                userHasSpecifiedInputOutput &&
                (trade || routeIsLoading || routeIsSyncing) && (
                  <SwapDetails
                    trade={trade}
                    syncing={routeIsSyncing}
                    loading={routeIsLoading}
                    showInverted={showInverted}
                    setShowInverted={setShowInverted}
                    allowedSlippage={allowedSlippage}
                  />
                )}
            </Grid>
            <Grid item xs={12}>
              {!isAccountActive ? (
                <Button variant="contained" fullWidth onClick={handleConnect}>
                  Connect Wallet
                </Button>
              ) : showWrap ? (
                <Button
                  onClick={onWrap}
                  disabled={!!wrapInputError}
                  variant="contained"
                  fullWidth
                >
                  {wrapInputError
                    ? wrapErrorText
                    : wrapType === WrapType.WRAP
                    ? "Wrap"
                    : wrapType === WrapType.UNWRAP
                    ? "Unwrap"
                    : null}
                </Button>
              ) : showApproveFlow ? (
                <Button
                  startIcon={
                    <CurrencyLogo currency={currencies[Field.INPUT]} />
                  }
                  endIcon={
                    <Tooltip
                      title={`You must allow the smart contract to use your ${
                        currencies[Field.INPUT]?.symbol
                      }. You only have to do this once per token.`}
                    >
                      <InfoOutlinedIcon />
                    </Tooltip>
                  }
                  onClick={handleApprove}
                  disabled={
                    !isValid ||
                    routeIsSyncing ||
                    routeIsLoading ||
                    (approvalState !== ApprovalState.APPROVED &&
                      signatureState !== UseERC20PermitState.SIGNED) ||
                    priceImpactTooHigh
                  }
                  variant="contained"
                  fullWidth
                >
                  Allow the protocol to use your{" "}
                  {currencies[Field.INPUT]?.symbol}
                </Button>
              ) : (
                <Button
                  disabled={
                    !isValid ||
                    routeIsSyncing ||
                    routeIsLoading ||
                    priceImpactTooHigh ||
                    !!swapCallbackError
                  }
                  onClick={handleSwapClick}
                  fullWidth
                  variant="contained"
                >
                  {swapInputError ? swapInputError : "Swap"}
                </Button>
              )}
            </Grid>
          </Grid>
        </Paper>
      </Container>
      <BlockInfo />
      <Popups />
    </BrandingProvider>
  );
};

export default Home;
