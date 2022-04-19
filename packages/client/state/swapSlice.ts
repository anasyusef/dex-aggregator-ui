import { createSlice, createSelector } from "@reduxjs/toolkit";
import { TokenInfo } from "@uniswap/token-lists";
import { useWeb3 } from "contexts/Web3Provider";
import { useAppSelector } from "state";

interface SwapState {
  input?: TokenInfo;
  inputAmount?: string;
  output?: TokenInfo;
  outputAmount?: string;
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
    setInputAmount: (state, action: { payload: string }) => {
      state.inputAmount = action.payload;
    },
    setOutputAmount: (state, action: { payload: string }) => {
      state.outputAmount = action.payload;
    },
  },
});

export const {
  setInputToken,
  setOutputToken,
  swapTokenPositions,
  setInputAmount,
  setOutputAmount,
} = swapSlice.actions;

export default swapSlice.reducer;
