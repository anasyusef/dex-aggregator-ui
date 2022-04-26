import { NativeCurrency } from "@uniswap/sdk-core";
import { CHAIN_INFO } from "constants/chainInfo";
import { nativeOnChain } from "constants/tokens";
import { useActiveWeb3 } from "contexts/Web3Provider";
import { BigNumber, ethers } from "ethers";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function useNativeCurrencyBalance() {
  const [balance, setBalance] = useState<BigNumber>(BigNumber.from(0));
  const [loading, setLoading] = useState(false);
  const { signer, chainId } = useActiveWeb3();

  const getBalance = useCallback(async () => {
    if (signer) {
      setLoading(true);
      setBalance(await signer.getBalance());
      setLoading(false);
    }
  }, [signer]);

  useEffect(() => {
    getBalance();
  }, [getBalance]);

  const {
    nativeCurrency: { decimals },
  } = CHAIN_INFO[chainId];

  return {
    rawBalance: balance,
    loading,
    formattedBalance: ethers.utils.formatUnits(balance, decimals),
  };
}
