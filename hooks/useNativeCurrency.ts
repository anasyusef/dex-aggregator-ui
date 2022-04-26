import { NativeCurrency } from "@uniswap/sdk-core";
import { nativeOnChain } from "constants/tokens";
import { useActiveWeb3 } from "contexts/Web3Provider";
import { useMemo } from "react";

export default function useNativeCurrency(): NativeCurrency {
  const { chainId } = useActiveWeb3();
  return useMemo(() => nativeOnChain(chainId), [chainId]);
}
