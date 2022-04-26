import { Currency, Token } from "@uniswap/sdk-core";
import { useWeb3 } from "contexts/Web3Provider";
// import useActiveWeb3React from 'hooks/useActiveWeb3React'
// import { useCurrencyFromMap, useTokenFromMapOrNetwork } from 'lib/hooks/useCurrency'
// import { getTokenFilter } from 'lib/hooks/useTokenList/filtering'
import { useMemo } from "react";

// import { useAllLists, useCombinedActiveList, useInactiveListUrls } from 'state/lists/hooks'
import { useGetTokensListQuery } from "state/lists/tokenListsApi";
import { TokenAddressMap } from "../state/lists/hooks";
import { useCurrencyFromMap, useTokenFromMapOrNetwork } from "./useCurrency";
import { tokensToChainTokenMap } from "./useTokenList/utils";

// reduce token map into standard address <-> Token mapping, optionally include user added tokens
function useTokensFromMap(tokenMap: TokenAddressMap): {
  [address: string]: Token;
} {
  const { chainId } = useWeb3();

  return useMemo(() => {
    if (!chainId) return {};

    // reduce to just tokens
    const mapWithoutUrls = Object.keys(tokenMap[chainId] ?? {}).reduce<{
      [address: string]: Token;
    }>((newMap, address) => {
      newMap[address] = tokenMap[chainId][address].token;
      return newMap;
    }, {});

    return mapWithoutUrls;
  }, [chainId, tokenMap]);
}

export function useAllTokens() {
  const { data, isLoading, isSuccess } = useGetTokensListQuery("");
  const tokensMap = tokensToChainTokenMap(data);
  const allTokens = useTokensFromMap(tokensMap);

  return { allTokens, isLoading, isSuccess };
}

// undefined if invalid or does not exist
// null if loading or null was passed
// otherwise returns the token
export function useToken(
  tokenAddress?: string | null
): Token | null | undefined {
  const { allTokens } = useAllTokens();
  return useTokenFromMapOrNetwork(allTokens, tokenAddress);
}

export function useCurrency(
  currencyId?: string | null
): Currency | null | undefined {
  const { allTokens } = useAllTokens();
  return useCurrencyFromMap(allTokens, currencyId);
}
