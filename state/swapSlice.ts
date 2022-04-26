import { createSlice } from "@reduxjs/toolkit";
import { TokenInfo } from "@uniswap/token-lists";

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

export default swapSlice.reducer;
