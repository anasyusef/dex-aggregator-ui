import { Typography, TypographyProps } from "@mui/material";
import { Fraction, TradeType } from "@uniswap/sdk-core";
import { nativeOnChain } from "constants/tokens";
import { useToken, useCurrency } from "hooks/Tokens";
import JSBI from "jsbi";
import React from "react";
import {
  ApproveTransactionInfo,
  ExactInputSwapTransactionInfo,
  ExactOutputSwapTransactionInfo,
  TransactionInfo,
  TransactionType,
  WrapTransactionInfo,
} from "state/transactions/actions";

function formatAmount(
  amountRaw: string,
  decimals: number,
  sigFigs: number
): string {
  return new Fraction(
    amountRaw,
    JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(decimals))
  ).toSignificant(sigFigs);
}

interface SwapSummaryProps extends TypographyProps {
  info: ExactInputSwapTransactionInfo | ExactOutputSwapTransactionInfo;
}

function SwapSummary({ info, ...rest }: SwapSummaryProps) {
  const inputCurrency = useCurrency(info.inputCurrencyId);
  const outputCurrency = useCurrency(info.outputCurrencyId);
  if (!inputCurrency || !outputCurrency) return null;
  if (info.tradeType === TradeType.EXACT_INPUT) {
    return (
      <Typography {...rest}>
        Swap exactly{" "}
        {formatAmount(info.inputCurrencyAmountRaw, inputCurrency.decimals, 6)}{" "}
        {inputCurrency.symbol} for{" "}
        {formatAmount(
          info.expectedOutputCurrencyAmountRaw,
          outputCurrency.decimals,
          6
        )}{" "}
        {outputCurrency.symbol}
      </Typography>
    );
  }
  return (
    <Typography {...rest}>
      Swap{" "}
      {formatAmount(
        info.expectedInputCurrencyAmountRaw,
        inputCurrency.decimals,
        6
      )}{" "}
      {inputCurrency.symbol} for exactly{" "}
      {formatAmount(info.outputCurrencyAmountRaw, outputCurrency.decimals, 6)}{" "}
      {outputCurrency.symbol}
    </Typography>
  );
}

interface WrapSummaryProps extends TypographyProps {
  info: WrapTransactionInfo;
}

function WrapSummary({
  info: { chainId, currencyAmountRaw, unwrapped },
  ...rest
}: WrapSummaryProps) {
  const native = chainId ? nativeOnChain(chainId) : undefined;

  if (unwrapped) {
    return (
      <Typography {...rest}>
        Unwrap {formatAmount(currencyAmountRaw, 18, 6)}{" "}
        {native?.wrapped?.symbol ?? "WETH"} to {native?.symbol ?? "ETH"}
      </Typography>
    );
  } else {
    return (
      <Typography {...rest}>
        Wrap {formatAmount(currencyAmountRaw, 18, 6)} {native?.symbol ?? "ETH"}
        to {native?.wrapped?.symbol ?? "WETH"}
      </Typography>
    );
  }
}

interface ApprovalSummaryProps extends TypographyProps {
  info: ApproveTransactionInfo;
}

function ApprovalSummary({ info, ...rest }: ApprovalSummaryProps) {
  const token = useToken(info.tokenAddress);
  return <Typography {...rest}>Approve {token?.symbol}</Typography>;
}

interface Props extends TypographyProps {
  info: TransactionInfo;
}

export default function TransactionSummary({ info, ...rest }: Props) {
  switch (info.type) {
    case TransactionType.SWAP:
      return <SwapSummary info={info} {...rest} />;
    case TransactionType.APPROVAL:
      return <ApprovalSummary info={info} {...rest} />;
    case TransactionType.WRAP:
      <WrapSummary info={info} {...rest} />;
    default:
      return null;
  }
}
