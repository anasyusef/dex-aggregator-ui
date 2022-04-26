import { useActiveWeb3 } from "contexts/Web3Provider";
import { NEVER_RELOAD, useSingleCallResult } from "hooks/multicall";
import { useMemo } from "react";

import { useArgentWalletDetectorContract } from "./useContract";

export default function useIsArgentWallet(): boolean {
  const { account } = useActiveWeb3();
  const argentWalletDetector = useArgentWalletDetectorContract();
  const inputs = useMemo(() => [account ?? undefined], [account]);
  const call = useSingleCallResult(
    argentWalletDetector,
    "isArgentWallet",
    inputs,
    NEVER_RELOAD
  );
  return Boolean(call?.result?.[0]);
}
