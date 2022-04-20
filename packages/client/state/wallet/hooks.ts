import { useTokenBalances } from "hooks/useCurrencyBalance";

import { CurrencyAmount, Token } from "@uniswap/sdk-core";
import { useActiveWeb3 } from "contexts/Web3Provider";
import { useMemo } from "react";
import { useAllTokens } from "state/lists/hooks";
export {
  default as useCurrencyBalance,
  useCurrencyBalances,
  useNativeCurrencyBalances,
  useTokenBalance,
  useTokenBalances,
  useTokenBalancesWithLoadingIndicator,
} from "hooks/useCurrencyBalance";

export function useAllTokenBalances(): {
  [tokenAddress: string]: CurrencyAmount<Token> | undefined;
} {
  const { account } = useActiveWeb3();
  const { allTokens } = useAllTokens();
  const allTokensArray = useMemo(
    () => Object.values(allTokens ?? {}),
    [allTokens]
  );
  const balances = useTokenBalances(account ?? undefined, allTokensArray);
  return balances ?? {};
}
