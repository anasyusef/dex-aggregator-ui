import { useWeb3 } from "contexts/Web3Provider";
import { useAppSelector } from "state";

export default function useIsSwapDisabled(): {
  isDisabled: boolean;
  message: string;
} {
  const { isAccountActive, isNetworkSupported } = useWeb3();
  const { input, output, inputAmount, outputAmount } = useAppSelector(
    (state) => state.swap
  );

  if (!isAccountActive)
    return { isDisabled: false, message: "Connect to Wallet" };
  if (isAccountActive && !isNetworkSupported)
    return { isDisabled: true, message: "Network not supported" };

  if (!input || !output) {
    return { isDisabled: true, message: "Select a token" };
  }

  if (!inputAmount || !outputAmount) {
    return { isDisabled: true, message: "Enter an amount" };
  }
  return { isDisabled: false, message: "Swap" };
}
