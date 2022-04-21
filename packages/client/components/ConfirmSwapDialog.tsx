import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Link,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
  useThemeProps,
} from "@mui/material";
import { Trade } from "@uniswap/router-sdk";
import { Currency, Percent, TradeType } from "@uniswap/sdk-core";
import { useUSDCValue } from "hooks/useUSDCPrice";
import { ReactNode, useCallback, useMemo, useState } from "react";
import { InterfaceTrade } from "state/routing/types";
import { tradeMeaningfullyDiffers } from "utils/tradeMeaningFullyDiffer";
import CurrencyLogo from "./CurrencyLogo";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Box } from "@mui/system";
import FiatValue from "./SwapField/components/FiatValue";
import TradePrice from "./SwapDetails/components/TradePrice";
import AdvancedSwapDetails from "./SwapDetails/components/AdvancedSwapDetails";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useActiveWeb3 } from "contexts/Web3Provider";
import useAddTokenToMetamask from "hooks/useAddTokenToMetamask";
import { ExplorerDataType, getExplorerLink } from "utils/getExplorerLink";
import MetaMaskLogo from "public/assets/images/metamask.png";
import Image from "next/image";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

type Props = {
  isOpen: boolean;
  trade: InterfaceTrade<Currency, Currency, TradeType>;
  originalTrade: Trade<Currency, Currency, TradeType> | undefined;
  attemptingTxn: boolean;
  txHash: string | undefined;
  recipient: string | null;
  allowedSlippage: Percent;
  onAcceptChanges: () => void;
  onConfirm: () => void;
  swapErrorMessage: ReactNode | undefined;
  onDismiss: () => void;
};

function SwapDialogContent({
  allowedSlippage,
  onAcceptChanges,
  onConfirm,
  recipient,
  showAcceptChanges,
  trade,
}: {
  trade: InterfaceTrade<Currency, Currency, TradeType>;
  allowedSlippage: Percent;
  recipient: string | null;
  showAcceptChanges: boolean;
  onConfirm: () => void;
  onAcceptChanges: () => void;
}) {
  const theme = useTheme();

  const [showInverted, setShowInverted] = useState<boolean>(false);

  const fiatValueInput = useUSDCValue(trade.inputAmount);
  const fiatValueOutput = useUSDCValue(trade.outputAmount);
  return (
    <>
      <DialogTitle>Confirm Swap</DialogTitle>
      <DialogContent>
        <Stack justifyContent={"center"} spacing={1}>
          <Paper variant="outlined">
            <Grid
              container
              justifyContent={"space-between"}
              alignItems="center"
            >
              <Grid sx={{ ml: 2, py: 1 }} item xs={8}>
                <Stack>
                  <Typography variant="h4">
                    {trade.inputAmount.toSignificant(6)}
                  </Typography>
                  <FiatValue fiatValue={fiatValueInput} />
                </Stack>
              </Grid>
              <Grid item xs={3}>
                <Stack spacing={1} direction="row" alignItems={"center"}>
                  <CurrencyLogo
                    currency={trade.inputAmount.currency}
                    size={25}
                  />
                  <Typography variant="h6">
                    {trade.inputAmount.currency.symbol}
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </Paper>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <KeyboardArrowDownIcon />
          </Box>
          <Paper variant="outlined">
            <Grid
              container
              justifyContent={"space-between"}
              alignItems="center"
            >
              <Grid sx={{ ml: 2, py: 1 }} item xs={8}>
                <Stack>
                  <Typography variant="h4">
                    {trade.outputAmount.toSignificant(6)}
                  </Typography>
                  <FiatValue fiatValue={fiatValueOutput} />
                </Stack>
              </Grid>
              <Grid item xs={3}>
                <Stack spacing={1} direction="row" alignItems={"center"}>
                  <CurrencyLogo
                    currency={trade.outputAmount.currency}
                    size={25}
                  />
                  <Typography variant="h6">
                    {trade.outputAmount.currency.symbol}
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </Paper>
          <TradePrice
            sx={{ mx: 1 }}
            price={trade.executionPrice}
            showInverted={showInverted}
            setShowInverted={setShowInverted}
          />
          <AdvancedSwapDetails
            allowedSlippage={allowedSlippage}
            trade={trade}
          />
          {showAcceptChanges && (
            <Alert
              severity="info"
              action={<Button onClick={onAcceptChanges}>Accept</Button>}
            >
              Price updated
            </Alert>
          )}

          {trade.tradeType === TradeType.EXACT_INPUT ? (
            <Typography variant="subtitle2" fontStyle={"italic"}>
              Output is estimated. You will receive at least{" "}
              <b>
                {trade.minimumAmountOut(allowedSlippage).toSignificant(6)}{" "}
                {trade.outputAmount.currency.symbol}
              </b>{" "}
              or the transaction will revert.
            </Typography>
          ) : (
            <Typography variant="caption" fontStyle={"italic"}>
              Input is estimated. You will sell at most{" "}
              <b>
                {trade.maximumAmountIn(allowedSlippage).toSignificant(6)}{" "}
                {trade.inputAmount.currency.symbol}
              </b>
              or the transaction will revert.
            </Typography>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onConfirm}
          disabled={showAcceptChanges}
          variant="contained"
          fullWidth
        >
          Confirm Swap
        </Button>
      </DialogActions>
    </>
  );
}

function TransactionErrorContent({
  message,
  onDismiss,
}: {
  message: ReactNode;
  onDismiss: () => void;
}) {
  return (
    <Box sx={{ p: 4 }}>
      <DialogContent>
        <Stack display={"flex"} justifyContent={"center"} spacing={1}>
          <Box
            sx={{ fontSize: (theme) => (theme.typography as any).h2.fontSize }}
            display={"flex"}
            justifyContent="center"
          >
            <ErrorOutlineIcon color="error" fontSize="inherit" />
          </Box>
          <Typography align="center" variant="h6">
            {message}
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onDismiss} variant="contained" fullWidth>
          Dismiss
        </Button>
      </DialogActions>
    </Box>
  );
}

function ConfirmationPendingContent({
  pendingText,
}: {
  pendingText: ReactNode;
}) {
  return (
    <DialogContent>
      <Stack display={"flex"} justifyContent="center" spacing={1}>
        <Box sx={{ p: 3 }} display="flex" justifyContent={"center"}>
          <CircularProgress size={80} />
        </Box>
        <Typography align="center" variant="h6">
          Waiting For Confirmation
        </Typography>
        <Typography align="center" variant="h6">
          {pendingText}
        </Typography>
        <Typography align="center" variant="subtitle2" color="ButtonText">
          Confirm this transaction in your wallet
        </Typography>
      </Stack>
    </DialogContent>
  );
}
function TransactionSubmittedContent({
  onDismiss,
  chainId,
  hash,
  currencyToAdd,
  inline,
}: {
  onDismiss: () => void;
  hash: string | undefined;
  chainId: number;
  currencyToAdd?: Currency | undefined;
  inline?: boolean; // not in modal
}) {
  const theme = useTheme();

  const { library } = useActiveWeb3();

  const { addToken, success } = useAddTokenToMetamask(currencyToAdd);

  return (
    <Box sx={{ p: 4 }}>
      <DialogContent>
        <Stack display={"flex"} justifyContent={"center"} spacing={1}>
          <Box
            sx={{ fontSize: (theme) => (theme.typography as any).h2.fontSize }}
            display={"flex"}
            justifyContent="center"
          >
            <ArrowUpwardIcon fontSize="inherit" />
          </Box>
          <Typography align="center" variant="h6">
            Transaction Submitted
          </Typography>
          {chainId && hash && (
            <Link
              href={getExplorerLink(
                chainId,
                hash,
                ExplorerDataType.TRANSACTION
              )}
              target={"_blank"}
              display={"flex"}
              justifyContent="center"
              align="center"
              variant="caption"
            >
              View on Explorer
            </Link>
          )}
          {currencyToAdd && library?.provider?.isMetaMask && (
            <Box width={"100%"} display="flex" justifyContent={"center"}>
              <Button
                sx={{
                  width: "fit-content",
                }}
                variant="outlined"
                endIcon={
                  <Image
                    width={20}
                    height={20}
                    alt="metamask-logo"
                    src={MetaMaskLogo}
                  />
                }
                onClick={addToken}
              >
                {!success ? (
                  <>Add {currencyToAdd.symbol} to Metamask </>
                ) : (
                  `Added ${currencyToAdd.symbol}`
                )}
              </Button>
            </Box>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onDismiss} variant="contained" fullWidth>
          Dismiss
        </Button>
      </DialogActions>
    </Box>
  );
}

export default function ConfirmSwapDialog({
  allowedSlippage,
  attemptingTxn,
  isOpen,
  onAcceptChanges,
  onConfirm,
  onDismiss,
  originalTrade,
  recipient,
  swapErrorMessage,
  trade,
  txHash,
}: Props) {
  const theme = useTheme();
  // text to show while loading
  const { chainId } = useActiveWeb3();
  const showAcceptChanges = useMemo(
    () =>
      Boolean(
        trade && originalTrade && tradeMeaningfullyDiffers(trade, originalTrade)
      ),
    [originalTrade, trade]
  );
  const pendingText = (
    <Typography>
      Swapping {trade?.inputAmount?.toSignificant(6)}{" "}
      {trade?.inputAmount?.currency?.symbol} for{" "}
      {trade?.outputAmount?.toSignificant(6)}{" "}
      {trade?.outputAmount?.currency?.symbol}
    </Typography>
  );

  const confirmationContent = swapErrorMessage ? (
    <TransactionErrorContent onDismiss={onDismiss} message={swapErrorMessage} />
  ) : (
    <SwapDialogContent
      trade={trade}
      onConfirm={onConfirm}
      allowedSlippage={allowedSlippage}
      recipient={recipient}
      showAcceptChanges={showAcceptChanges}
      onAcceptChanges={onAcceptChanges}
    />
  );

  let content = null;

  console.log({ attemptingTxn, txHash });

  if (attemptingTxn) {
    content = <ConfirmationPendingContent pendingText={pendingText} />;
  } else if (txHash) {
    content = (
      <TransactionSubmittedContent
        onDismiss={onDismiss}
        hash={txHash}
        chainId={chainId}
        currencyToAdd={trade?.outputAmount.currency}
      />
    );
  } else if (trade && confirmationContent) {
    content = confirmationContent;
  }
  return (
    <Dialog fullWidth maxWidth="xs" open={isOpen} onClose={onDismiss}>
      {content}
    </Dialog>
  );
}
