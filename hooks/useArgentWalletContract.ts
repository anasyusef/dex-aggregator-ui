import { useActiveWeb3 } from "contexts/Web3Provider";
import ArgentWalletContractABI from "../abis/argent-wallet-contract.json";
import { ArgentWalletContract } from "../abis/types";
import { useContract } from "./useContract";
import useIsArgentWallet from "./useIsArgentWallet";

export function useArgentWalletContract(): ArgentWalletContract | null {
  const { account } = useActiveWeb3();
  const isArgentWallet = useIsArgentWallet();
  return useContract(
    isArgentWallet ? account ?? undefined : undefined,
    ArgentWalletContractABI,
    true
  ) as ArgentWalletContract;
}
