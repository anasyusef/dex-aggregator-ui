import { createSlice, createSelector } from "@reduxjs/toolkit";
import { TokenInfo } from "@uniswap/token-lists";
import { useWeb3 } from "contexts/Web3Provider";
import { useAppSelector } from "state";

interface SwapState {
  input?: TokenInfo;
  output?: TokenInfo;
}

const initialState: SwapState = {};

export const swapSlice = createSlice({
  name: "swap",
  initialState,
  reducers: {
    setInputToken: (state, action: { payload: TokenInfo }) => {
      state.input = action.payload;
    },
    setOutputToken: (state, action: { payload: TokenInfo }) => {
      state.output = action.payload;
    },
    swapTokenPositions: (state) => {
      [state.input, state.output] = [state.output, state.input];
    },
  },
});

export const { setInputToken, setOutputToken, swapTokenPositions } =
  swapSlice.actions;

export function useIsSwapDisabled(): { isDisabled: boolean; message: string } {
  const { isAccountActive, isNetworkSupported } = useWeb3();
  const { input, output } = useAppSelector((state) => state.swap);

  if (!isAccountActive)
    return { isDisabled: false, message: "Connect to Wallet" };
  if (isAccountActive && !isNetworkSupported)
    return { isDisabled: true, message: "Network not supported" };

  if (!input || !output) {
    return { isDisabled: true, message: "Select a token" };
  }
  return { isDisabled: false, message: "Swap" };
}

export default swapSlice.reducer;
