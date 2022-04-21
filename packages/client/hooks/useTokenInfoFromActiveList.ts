import { Currency } from "@uniswap/sdk-core";
import { useActiveWeb3 } from "contexts/Web3Provider";
import { useMemo } from "react";
// import { useCombinedActiveList } from 'state/lists/hooks'
import { useAllTokens } from "./Tokens";

/**
 * Returns a WrappedTokenInfo from the active token lists when possible,
 * or the passed token otherwise. */
export function useTokenInfoFromActiveList(currency: Currency) {
  const { chainId } = useActiveWeb3();
  const { allTokens } = useAllTokens();

  return useMemo(() => {
    if (!chainId) return;
    if (currency.isNative) return currency;

    try {
      return allTokens[currency.wrapped.address];
    } catch (e) {
      return currency;
    }
  }, [allTokens, chainId, currency]);
}
