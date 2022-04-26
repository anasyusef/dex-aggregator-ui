import { Token } from "@uniswap/sdk-core";
import { useActiveWeb3 } from "contexts/Web3Provider";
import { createContext, useContext, useMemo } from "react";
import { ChainTokenMap } from "./utils";

export type TokenMap = { [address: string]: Token };

const MISSING_PROVIDER = Symbol();
const ChainTokenMapContext = createContext<
  ChainTokenMap | undefined | typeof MISSING_PROVIDER
>(MISSING_PROVIDER);

function useChainTokenMapContext() {
  const chainTokenMap = useContext(ChainTokenMapContext);
  if (chainTokenMap === MISSING_PROVIDER) {
    throw new Error("TokenList hooks must be wrapped in a <TokenListProvider>");
  }
  return chainTokenMap;
}

export function useTokenMap(): TokenMap {
  const { chainId } = useActiveWeb3();
  const chainTokenMap = useChainTokenMapContext();
  const tokenMap = chainId && chainTokenMap?.[chainId];
  return useMemo(() => {
    if (!tokenMap) return {};
    return Object.entries(tokenMap).reduce((map, [address, { token }]) => {
      map[address] = token;
      return map;
    }, {} as TokenMap);
  }, [tokenMap]);
}
