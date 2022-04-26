// eslint-disable-next-line no-restricted-imports
import { Percent, TradeType } from "@uniswap/sdk-core";
import { ReactNode, useMemo } from "react";

import { TransactionType } from "../state/transactions/actions";
import { useTransactionAdder } from "../state/transactions/hooks";
import { currencyId } from "utils/currencyId";
import useENS from "./useENS";
import { SignatureData } from "./useERC20Permit";
import useTransactionDeadline from "./useTransactionDeadline";
import { useActiveWeb3 } from "contexts/Web3Provider";
import { AnyTrade, useSwapCallArguments } from "hooks/useSwapCallArguments";
import { TransactionResponse } from "@ethersproject/providers";
import { BigNumber } from "@ethersproject/bignumber";
import { FeeOptions } from "@uniswap/v3-sdk";
import useSendSwapTransaction from "./useSendSwapTransaction";

export enum SwapCallbackState {
  INVALID,
  LOADING,
  VALID,
}

interface UseSwapCallbackReturns {
  state: SwapCallbackState;
  callback?: () => Promise<TransactionResponse>;
  error?: ReactNode;
}
interface UseSwapCallbackArgs {
  trade: AnyTrade | undefined; // trade to execute, required
  allowedSlippage: Percent; // in bips
  recipientAddressOrName: string | null | undefined; // the ENS name or address of the recipient of the trade, or null if swap should be returned to sender
  signatureData: SignatureData | null | undefined;
  deadline: BigNumber | undefined;
  feeOptions?: FeeOptions;
}

// returns a function that will execute a swap, if the parameters are all valid
// and the user has approved the slippage adjusted input amount for the trade
export function useLibSwapCallBack({
  trade,
  allowedSlippage,
  recipientAddressOrName,
  signatureData,
  deadline,
  feeOptions,
}: UseSwapCallbackArgs): UseSwapCallbackReturns {
  const { account, chainId, library } = useActiveWeb3();

  const swapCalls = useSwapCallArguments(
    trade,
    allowedSlippage,
    recipientAddressOrName,
    signatureData,
    deadline,
    feeOptions
  );
  const { callback } = useSendSwapTransaction(
    account,
    chainId,
    library,
    trade,
    swapCalls
  );

  const { address: recipientAddress } = useENS(recipientAddressOrName);
  const recipient =
    recipientAddressOrName === null ? account : recipientAddress;

  return useMemo(() => {
    if (!trade || !library || !account || !chainId || !callback) {
      return {
        state: SwapCallbackState.INVALID,
        error: "Missing dependencies",
      };
    }
    if (!recipient) {
      if (recipientAddressOrName !== null) {
        return { state: SwapCallbackState.INVALID, error: "Invalid recipient" };
      } else {
        return { state: SwapCallbackState.LOADING };
      }
    }

    return {
      state: SwapCallbackState.VALID,
      callback: async () => callback(),
    };
  }, [
    trade,
    library,
    account,
    chainId,
    callback,
    recipient,
    recipientAddressOrName,
  ]);
}

// returns a function that will execute a swap, if the parameters are all valid
// and the user has approved the slippage adjusted input amount for the trade
export function useSwapCallback(
  trade: AnyTrade | undefined, // trade to execute, required
  allowedSlippage: Percent, // in bips
  recipientAddressOrName: string | null, // the ENS name or address of the recipient of the trade, or null if swap should be returned to sender
  signatureData: SignatureData | undefined | null
): {
  state: SwapCallbackState;
  callback: null | (() => Promise<string>);
  error: ReactNode | null;
} {
  const { account } = useActiveWeb3();

  const deadline = useTransactionDeadline();

  const addTransaction = useTransactionAdder();

  const { address: recipientAddress } = useENS(recipientAddressOrName);
  const recipient =
    recipientAddressOrName === null ? account : recipientAddress;

  const {
    state,
    callback: libCallback,
    error,
  } = useLibSwapCallBack({
    trade,
    allowedSlippage,
    recipientAddressOrName: recipient,
    signatureData,
    deadline,
  });

  const callback = useMemo(() => {
    if (!libCallback || !trade) {
      return null;
    }
    return () =>
      libCallback().then((response) => {
        addTransaction(
          response,
          trade.tradeType === TradeType.EXACT_INPUT
            ? {
                type: TransactionType.SWAP,
                tradeType: TradeType.EXACT_INPUT,
                inputCurrencyId: currencyId(trade.inputAmount.currency),
                inputCurrencyAmountRaw: trade.inputAmount.quotient.toString(),
                expectedOutputCurrencyAmountRaw:
                  trade.outputAmount.quotient.toString(),
                outputCurrencyId: currencyId(trade.outputAmount.currency),
                minimumOutputCurrencyAmountRaw: trade
                  .minimumAmountOut(allowedSlippage)
                  .quotient.toString(),
              }
            : {
                type: TransactionType.SWAP,
                tradeType: TradeType.EXACT_OUTPUT,
                inputCurrencyId: currencyId(trade.inputAmount.currency),
                maximumInputCurrencyAmountRaw: trade
                  .maximumAmountIn(allowedSlippage)
                  .quotient.toString(),
                outputCurrencyId: currencyId(trade.outputAmount.currency),
                outputCurrencyAmountRaw: trade.outputAmount.quotient.toString(),
                expectedInputCurrencyAmountRaw:
                  trade.inputAmount.quotient.toString(),
              }
        );
        return response.hash;
      });
  }, [addTransaction, allowedSlippage, libCallback, trade]);

  return {
    state,
    callback,
    error,
  };
}
