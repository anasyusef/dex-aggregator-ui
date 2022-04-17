import { IWeb3Provider, Web3Context } from "./Web3Provider";
import { Token, TokenAmount } from "@uniswap/sdk";
import { useCallback, useContext, useEffect, useState } from "react";
import { BigNumber, BigNumberish, ethers } from "ethers";
import { CHAIN_INFO } from "constants/chainInfo";

export function useWeb3(): IWeb3Provider {
  const web3Provider = useContext(Web3Context);
  if (!web3Provider) {
    throw new Error(
      "Calling hook from outside context. Make sure the app is wrapped with Web3Provider"
    );
  }
  return web3Provider;
}

export function useNativeCurrencyBalance() {
  const { signer, chainId } = useWeb3();
  const [balance, setBalance] = useState<BigNumberish | undefined>(undefined);

  //   console.log(new NativeCurrency())

  const fetchBalance = useCallback(async () => {
    if (signer) {
      setBalance(await signer.getBalance());
    }
  }, [signer]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);
  return { balance, formattedBalance: ethers.utils.formatEther(balance || 0) };
}
