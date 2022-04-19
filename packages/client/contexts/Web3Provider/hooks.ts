import { SupportedChainId } from "constants/chains";
import { BigNumberish, ethers } from "ethers";
import { useCallback, useContext, useEffect, useState } from "react";
import { IWeb3Provider, Web3Context } from "./Web3Provider";

type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };
interface IActiveWeb3 extends WithRequired<IWeb3Provider, "chainId"> {}

export function useWeb3(): IWeb3Provider {
  const web3Provider = useContext(Web3Context);
  if (!web3Provider) {
    throw new Error(
      "Calling hook from outside context. Make sure the app is wrapped with Web3Provider"
    );
  }
  return web3Provider;
}

export function useActiveWeb3(): IActiveWeb3 {
  const web3 = useWeb3();

  if (web3.isAccountActive) {
    return web3 as IActiveWeb3;
  }

  let { chainId, isNetworkSupported } = web3;
  if (!chainId || !isNetworkSupported) {
    chainId = SupportedChainId.MAINNET;
  }

  return {
    ...web3,
    isNetworkSupported: true,
    chainId,
  };
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
