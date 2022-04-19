import { createSlice, createSelector } from "@reduxjs/toolkit";
import { TokenInfo } from "@uniswap/token-lists";
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
  const { input, output } = useAppSelector((state) => state.swap);

  return { isDisabled: !input || !output, message: "Select a token" };
}

export default swapSlice.reducer;
